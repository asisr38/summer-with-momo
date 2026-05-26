"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Board, Cell as SuCell, Difficulty, Puzzle } from "@/lib/sudoku/types";
import { cloneBoard, parseBoard } from "@/lib/sudoku/engine";
import {
  boardToJson,
  createRoom as svcCreateRoom,
  fetchRoom,
  jsonToBoard,
  pushBoardState,
  replaceRoomPuzzle as svcReplaceRoomPuzzle,
  type BoardJson,
  type RoomRow
} from "./room";
import { supabase } from "./client";

export type GameState = { puzzle: Puzzle; solution: string; board: Board };

type Opts = { roomCode: string; me: "ashish" | "momo" } | null;

type CellPayload = { row: number; col: number; value: number | null; pencil: number[] };
type BoardPayload = { board: BoardJson };

type Result = {
  partnerHere: boolean;
  pushCell?: (row: number, col: number, cell: SuCell, fullBoard: Board) => void;
  pushBoard?: (board: Board) => void;
  createRoom?: (difficulty: Difficulty) => Promise<string | null>;
  replaceRoomPuzzle?: (difficulty: Difficulty) => Promise<void>;
};

const DB_DEBOUNCE_MS = 400;

export function useRoomSync(
  opts: Opts,
  _state: GameState | null,
  setState: Dispatch<SetStateAction<GameState | null>>,
  onPuzzleChange: () => void
): Result {
  const [partnerHere, setPartnerHere] = useState(false);
  const versionRef = useRef(0);
  const currentPuzzleRef = useRef<string | null>(null);
  const lastPushedVersionRef = useRef(-1);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const dbTimerRef = useRef<number | null>(null);
  const pendingBoardRef = useRef<Board | null>(null);

  useEffect(() => {
    if (!opts || !supabase) return;
    let canceled = false;

    (async () => {
      const data = await fetchRoom(opts.roomCode);
      if (canceled) return;
      if (!data) {
        console.warn("Room not found:", opts.roomCode);
        return;
      }
      versionRef.current = data.state.version;
      currentPuzzleRef.current = data.room.puzzle;
      const puzzle: Puzzle = {
        id: opts.roomCode,
        difficulty: data.room.difficulty,
        givens: data.room.puzzle
      };
      setState({ puzzle, solution: data.room.solution, board: jsonToBoard(data.state.board) });
      onPuzzleChange();
    })();

    const channel = supabase.channel(`room:${opts.roomCode}`, {
      config: {
        broadcast: { self: false, ack: false },
        presence: { key: opts.me }
      }
    });
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "cell" }, ({ payload }) => {
        const { row, col, value, pencil } = payload as CellPayload;
        setState((prev) => {
          if (!prev) return prev;
          const next = cloneBoard(prev.board);
          next[row][col].value = value;
          next[row][col].pencil = pencil ?? [];
          return { ...prev, board: next };
        });
      })
      .on("broadcast", { event: "board" }, ({ payload }) => {
        const { board } = payload as BoardPayload;
        setState((prev) => (prev ? { ...prev, board: jsonToBoard(board) } : prev));
      })
      .on("presence", { event: "sync" }, () => {
        const presence = channel.presenceState() as Record<string, unknown[]>;
        const other = opts.me === "ashish" ? "momo" : "ashish";
        setPartnerHere(Boolean(presence[other]?.length));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ at: Date.now() });
        }
      });

    // Keep room metadata listener for puzzle swaps (rare; postgres_changes latency is fine).
    const roomChannel = supabase
      .channel(`room-meta:${opts.roomCode}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${opts.roomCode}` },
        (payload) => {
          const room = payload.new as RoomRow;
          if (room.puzzle === currentPuzzleRef.current) return;
          currentPuzzleRef.current = room.puzzle;
          versionRef.current = 0;
          lastPushedVersionRef.current = -1;
          const puzzle: Puzzle = {
            id: opts.roomCode,
            difficulty: room.difficulty,
            givens: room.puzzle
          };
          setState({ puzzle, solution: room.solution, board: parseBoard(room.puzzle) });
          onPuzzleChange();
        }
      )
      .subscribe();

    return () => {
      canceled = true;
      if (dbTimerRef.current) {
        window.clearTimeout(dbTimerRef.current);
        dbTimerRef.current = null;
      }
      channel.unsubscribe();
      roomChannel.unsubscribe();
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts?.roomCode, opts?.me]);

  const scheduleDbWrite = useCallback(
    (board: Board) => {
      if (!opts) return;
      pendingBoardRef.current = board;
      if (dbTimerRef.current != null) return;
      dbTimerRef.current = window.setTimeout(() => {
        const b = pendingBoardRef.current;
        pendingBoardRef.current = null;
        dbTimerRef.current = null;
        if (b && opts) {
          versionRef.current += 1;
          lastPushedVersionRef.current = versionRef.current;
          void pushBoardState(opts.roomCode, b, versionRef.current);
        }
      }, DB_DEBOUNCE_MS);
    },
    [opts?.roomCode]
  );

  const pushCell = useCallback(
    (row: number, col: number, cell: SuCell, fullBoard: Board) => {
      const channel = channelRef.current;
      if (!opts || !channel) return;
      void channel.send({
        type: "broadcast",
        event: "cell",
        payload: { row, col, value: cell.value, pencil: cell.pencil }
      });
      scheduleDbWrite(fullBoard);
    },
    [opts?.roomCode, scheduleDbWrite]
  );

  const pushBoard = useCallback(
    (board: Board) => {
      const channel = channelRef.current;
      if (!opts || !channel) return;
      void channel.send({
        type: "broadcast",
        event: "board",
        payload: { board: boardToJson(board) }
      });
      if (dbTimerRef.current != null) {
        window.clearTimeout(dbTimerRef.current);
        dbTimerRef.current = null;
        pendingBoardRef.current = null;
      }
      versionRef.current += 1;
      lastPushedVersionRef.current = versionRef.current;
      void pushBoardState(opts.roomCode, board, versionRef.current);
    },
    [opts?.roomCode]
  );

  const createRoom = useCallback(async (difficulty: Difficulty) => {
    const result = await svcCreateRoom(difficulty);
    return result?.code ?? null;
  }, []);

  const replaceRoomPuzzle = useCallback(
    async (difficulty: Difficulty) => {
      if (!opts) return;
      await svcReplaceRoomPuzzle(opts.roomCode, difficulty);
    },
    [opts?.roomCode]
  );

  if (!opts) {
    return { partnerHere: false, createRoom };
  }

  return { partnerHere, pushCell, pushBoard, createRoom, replaceRoomPuzzle };
}
