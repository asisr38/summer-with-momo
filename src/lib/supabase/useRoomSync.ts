"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Board, Difficulty, Puzzle } from "@/lib/sudoku/types";
import { parseBoard } from "@/lib/sudoku/engine";
import {
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

type Result = {
  partnerHere: boolean;
  pushBoard?: (board: Board) => void;
  createRoom?: (difficulty: Difficulty) => Promise<string | null>;
  replaceRoomPuzzle?: (difficulty: Difficulty) => Promise<void>;
};

export function useRoomSync(
  opts: Opts,
  state: GameState | null,
  setState: Dispatch<SetStateAction<GameState | null>>,
  onPuzzleChange: () => void
): Result {
  const [partnerHere, setPartnerHere] = useState(false);
  const versionRef = useRef(0);
  const currentPuzzleRef = useRef<string | null>(null);
  const lastPushedVersionRef = useRef(-1);

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

    const stateChannel = supabase
      .channel(`room-state:${opts.roomCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_state", filter: `room_id=eq.${opts.roomCode}` },
        (payload) => {
          const next = payload.new as { board: BoardJson; version: number };
          if (next.version === lastPushedVersionRef.current) return;
          if (next.version < versionRef.current) return;
          versionRef.current = next.version;
          const board = jsonToBoard(next.board);
          setState((prev) => (prev ? { ...prev, board } : prev));
        }
      )
      .subscribe();

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

    const presenceChannel = supabase.channel(`presence:${opts.roomCode}`, {
      config: { presence: { key: opts.me } }
    });
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const presence = presenceChannel.presenceState() as Record<string, unknown[]>;
        const other = opts.me === "ashish" ? "momo" : "ashish";
        setPartnerHere(Boolean(presence[other]?.length));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ at: Date.now() });
        }
      });

    return () => {
      canceled = true;
      stateChannel.unsubscribe();
      roomChannel.unsubscribe();
      presenceChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts?.roomCode, opts?.me]);

  const pushBoard = useCallback(
    (board: Board) => {
      if (!opts) return;
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

  return { partnerHere, pushBoard, createRoom, replaceRoomPuzzle };
}
