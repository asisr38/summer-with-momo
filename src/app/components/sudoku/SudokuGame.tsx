"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyHint,
  cloneBoard,
  findHintCell,
  getConflicts,
  parseBoard,
  revealBoard,
  serializeValues,
  solve
} from "@/lib/sudoku/engine";
import { PUZZLES, randomPuzzle } from "@/lib/sudoku/puzzles";
import type { Board, CellCoord, Cell as SuCell, Difficulty, Puzzle } from "@/lib/sudoku/types";
import { isSupabaseReady } from "@/lib/supabase/client";
import { SudokuBoard } from "./SudokuBoard";
import { NumberPad } from "./NumberPad";
import { SudokuLobby } from "./SudokuLobby";
import { useRoomSync } from "@/lib/supabase/useRoomSync";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

const SPARKLE_COLORS = [
  "var(--rose)",
  "var(--peach)",
  "var(--ochre)",
  "var(--rose-bright)",
  "var(--rose)",
  "var(--peach)",
  "var(--ochre)",
  "var(--rose-bright)",
  "var(--rose)",
  "var(--peach)",
  "var(--ochre)",
  "var(--rose-bright)"
];

function difficultyLabel(d: Difficulty): string {
  if (d === "easy") return "Easy";
  if (d === "medium") return "Medium";
  return "Hard";
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type GameState = {
  puzzle: Puzzle;
  solution: string;
  board: Board;
};

function newGameState(difficulty: Difficulty, excludeId?: string): GameState {
  const puzzle = randomPuzzle(difficulty, excludeId);
  const solution = solve(puzzle.givens);
  if (!solution) throw new Error(`Puzzle ${puzzle.id} has no solution`);
  return { puzzle, solution, board: parseBoard(puzzle.givens) };
}

type Mode =
  | { kind: "lobby" }
  | { kind: "solo" }
  | { kind: "room"; roomCode: string; me: "ashish" | "momo" };

export function SudokuGame() {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return { kind: "lobby" };
    const saved = window.localStorage.getItem("su:lastMode");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Mode;
        if (parsed.kind === "solo" || parsed.kind === "room") return parsed;
      } catch {
        /* noop */
      }
    }
    return { kind: "lobby" };
  });
  const [state, setState] = useState<GameState | null>(null);
  const [selected, setSelected] = useState<CellCoord | null>({ row: 0, col: 0 });
  const [pencilMode, setPencilMode] = useState(false);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [won, setWon] = useState(false);
  const [revealArmed, setRevealArmed] = useState(false);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("su:lastMode", JSON.stringify(mode));
  }, [mode]);

  const board = state?.board ?? null;
  const difficulty: Difficulty = state?.puzzle.difficulty ?? "easy";
  const conflicts = useMemo(() => (board ? getConflicts(board) : new Set<string>()), [board]);

  const sync = useRoomSync(
    mode.kind === "room" ? { roomCode: mode.roomCode, me: mode.me } : null,
    state,
    setState,
    () => {
      setSelected({ row: 0, col: 0 });
      setPencilMode(false);
      setStartTime(Date.now());
      setNow(Date.now());
      setWon(false);
      setRevealArmed(false);
    }
  );

  const startSolo = useCallback((d: Difficulty, excludeId?: string) => {
    const fresh = newGameState(d, excludeId);
    setState(fresh);
    setSelected({ row: 0, col: 0 });
    setPencilMode(false);
    setStartTime(Date.now());
    setNow(Date.now());
    setWon(false);
    setRevealArmed(false);
  }, []);

  const handleEnterSolo = useCallback(
    (chosenDifficulty: Difficulty) => {
      setMode({ kind: "solo" });
      startSolo(chosenDifficulty);
    },
    [startSolo]
  );

  const handleCreateRoom = useCallback(
    async (me: "ashish" | "momo", chosenDifficulty: Difficulty) => {
      if (!sync.createRoom) return;
      const code = await sync.createRoom(chosenDifficulty);
      if (code) setMode({ kind: "room", roomCode: code, me });
    },
    [sync]
  );

  const handleJoinRoom = useCallback((code: string, me: "ashish" | "momo") => {
    setMode({ kind: "room", roomCode: code.toUpperCase(), me });
  }, []);

  const handleLeaveRoom = useCallback(() => {
    setMode({ kind: "lobby" });
    setState(null);
  }, []);

  const handleDifficultyClick = useCallback(
    (d: Difficulty) => {
      if (mode.kind === "solo") {
        startSolo(d, state?.puzzle.id);
      } else if (mode.kind === "room" && sync.replaceRoomPuzzle) {
        void sync.replaceRoomPuzzle(d);
      }
    },
    [mode, startSolo, state?.puzzle.id, sync]
  );

  const newPuzzleInSameMode = useCallback(() => {
    if (mode.kind === "solo") {
      startSolo(difficulty, state?.puzzle.id);
    } else if (mode.kind === "room" && sync.replaceRoomPuzzle) {
      void sync.replaceRoomPuzzle(difficulty);
    }
  }, [difficulty, mode, startSolo, state?.puzzle.id, sync]);

  useEffect(() => {
    if (won) return;
    if (!state) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [won, state]);

  useEffect(() => {
    if (!state || won) return;
    if (serializeValues(state.board) === state.solution) setWon(true);
  }, [state, won]);

  const updateCell = useCallback(
    (mutator: (cell: SuCell) => void) => {
      if (!selected || !state) return;
      const target = state.board[selected.row][selected.col];
      if (target.given) return;
      const nextBoard = cloneBoard(state.board);
      const nextCell = nextBoard[selected.row][selected.col];
      mutator(nextCell);
      const nextState = { ...state, board: nextBoard };
      setState(nextState);
      if (mode.kind === "room" && sync.pushCell) {
        sync.pushCell(selected.row, selected.col, nextCell, nextBoard);
      }
    },
    [mode, selected, state, sync]
  );

  const handleNumberInput = useCallback(
    (n: number) => {
      if (won) return;
      updateCell((cell) => {
        if (pencilMode) {
          const idx = cell.pencil.indexOf(n);
          if (idx >= 0) cell.pencil.splice(idx, 1);
          else {
            cell.pencil.push(n);
            cell.pencil.sort();
          }
        } else {
          cell.value = cell.value === n ? null : n;
          cell.pencil = [];
        }
      });
    },
    [pencilMode, updateCell, won]
  );

  const handleErase = useCallback(() => {
    if (won) return;
    updateCell((cell) => {
      cell.value = null;
      cell.pencil = [];
    });
  }, [updateCell, won]);

  const handleHint = useCallback(() => {
    if (won || !state) return;
    const coord = findHintCell(state.board);
    if (!coord) return;
    const nextBoard = applyHint(state.board, state.solution, coord);
    setState({ ...state, board: nextBoard });
    setSelected(coord);
    if (mode.kind === "room" && sync.pushCell) {
      sync.pushCell(coord.row, coord.col, nextBoard[coord.row][coord.col], nextBoard);
    }
  }, [mode, state, sync, won]);

  const armReveal = useCallback(() => {
    setRevealArmed(true);
    if (revealTimer.current) window.clearTimeout(revealTimer.current);
    revealTimer.current = window.setTimeout(() => setRevealArmed(false), 3000);
  }, []);

  const handleReveal = useCallback(() => {
    if (won || !state) return;
    if (!revealArmed) {
      armReveal();
      return;
    }
    if (revealTimer.current) window.clearTimeout(revealTimer.current);
    setRevealArmed(false);
    const nextBoard = revealBoard(state.board, state.solution);
    setState({ ...state, board: nextBoard });
    if (mode.kind === "room" && sync.pushBoard) sync.pushBoard(nextBoard);
  }, [armReveal, mode, revealArmed, state, sync, won]);

  useEffect(() => {
    return () => {
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
    };
  }, []);

  const moveSelection = useCallback((dr: number, dc: number) => {
    setSelected((curr) => {
      if (!curr) return { row: 0, col: 0 };
      return {
        row: Math.max(0, Math.min(8, curr.row + dr)),
        col: Math.max(0, Math.min(8, curr.col + dc))
      };
    });
  }, []);

  useEffect(() => {
    if (mode.kind === "lobby") return;
    function handleKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const key = event.key;
      if (key >= "1" && key <= "9") { handleNumberInput(Number(key)); return; }
      if (key === "0" || key === "Backspace" || key === "Delete") { handleErase(); return; }
      if (key === "p" || key === "P") { setPencilMode((p) => !p); return; }
      if (key === "h" || key === "H") { handleHint(); return; }
      if (key === "ArrowUp") { event.preventDefault(); moveSelection(-1, 0); return; }
      if (key === "ArrowDown") { event.preventDefault(); moveSelection(1, 0); return; }
      if (key === "ArrowLeft") { event.preventDefault(); moveSelection(0, -1); return; }
      if (key === "ArrowRight") { event.preventDefault(); moveSelection(0, 1); return; }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleErase, handleHint, handleNumberInput, mode.kind, moveSelection]);

  useEffect(() => {
    if (mode.kind === "solo" && !state) {
      startSolo("easy");
    }
  }, [mode, startSolo, state]);

  if (mode.kind === "lobby" || !state) {
    return (
      <SudokuLobby
        onCreateRoom={handleCreateRoom}
        onEnterSolo={handleEnterSolo}
        onJoinRoom={handleJoinRoom}
        supabaseReady={isSupabaseReady}
      />
    );
  }

  const elapsed = now - startTime;
  const emptyCells = state.board.flat().filter((c) => c.value == null).length;

  return (
    <div className="su-wrap">
      {mode.kind === "room" ? (
        <div className="su-room-bar">
          <div>
            <div className="su-room-bar-label">Room</div>
            <div className="su-room-bar-code">{mode.roomCode}</div>
          </div>
          <div className="su-room-bar-presence">
            <PresenceChip name="you" active />
            <PresenceChip name={mode.me === "ashish" ? "momo" : "ashish"} active={sync.partnerHere} />
            <button className="btn-ghost" onClick={handleLeaveRoom} type="button">
              Leave
            </button>
          </div>
        </div>
      ) : null}

      <div className="su-controls">
        <div className="su-diff">
          {DIFFICULTIES.map((d) => (
            <button
              aria-pressed={difficulty === d}
              className={`btn-ghost ${difficulty === d ? "is-active" : ""}`}
              key={d}
              onClick={() => handleDifficultyClick(d)}
              type="button"
            >
              {difficultyLabel(d)}
            </button>
          ))}
        </div>
        <div className="su-meta">
          <div className="su-timer">{formatTime(elapsed)}</div>
          <button className="btn-ghost" onClick={newPuzzleInSameMode} type="button">
            New
          </button>
        </div>
      </div>

      <SudokuBoard board={state.board} conflicts={conflicts} onSelect={(row, col) => setSelected({ row, col })} selected={selected} />

      <div className="su-actions">
        <button
          className="btn-ghost"
          disabled={won || emptyCells === 0}
          onClick={handleHint}
          type="button"
          title="Fill one cell from the solution"
        >
          Hint
        </button>
        <button
          aria-pressed={revealArmed}
          className={`btn-ghost ${revealArmed ? "is-warn" : ""}`}
          disabled={won || emptyCells === 0}
          onClick={handleReveal}
          type="button"
          title="Fill the rest from the solution"
        >
          {revealArmed ? "Tap again to reveal" : "Reveal"}
        </button>
      </div>

      {won ? (
        <div className="su-win">
          <div className="su-sparkles" aria-hidden="true">
            {SPARKLE_COLORS.map((c, i) => (
              <span
                className="su-sparkle"
                key={i}
                style={{ ["--i" as never]: i, ["--c" as never]: c } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="su-win-eyebrow">Solved</div>
          <div className="su-win-title">Held.</div>
          <div className="su-win-sub">
            {difficultyLabel(difficulty)} · {formatTime(elapsed)}
          </div>
          <button className="btn-primary" onClick={newPuzzleInSameMode} type="button">
            Play another
          </button>
        </div>
      ) : null}

      <NumberPad
        board={state.board}
        onErase={handleErase}
        onInput={handleNumberInput}
        onTogglePencil={() => setPencilMode((p) => !p)}
        pencilMode={pencilMode}
      />

      <div className="su-hints">
        Tap a cell, then a number. <kbd>1</kbd>–<kbd>9</kbd> to fill, <kbd>P</kbd> pencil, <kbd>H</kbd> hint, <kbd>⌫</kbd> erase, arrows to move.
        <br />
        {PUZZLES[difficulty].length} {difficulty} puzzles in the bank.
      </div>
    </div>
  );
}

function PresenceChip({ name, active }: { name: string; active: boolean }) {
  return <span className={`su-presence-chip ${active ? "is-here" : ""}`}>{name}</span>;
}
