import type { Board, Difficulty } from "@/lib/sudoku/types";
import { parseBoard, solve } from "@/lib/sudoku/engine";
import { randomPuzzle } from "@/lib/sudoku/puzzles";
import { supabase } from "./client";

export type RoomRow = {
  id: string;
  puzzle: string;
  solution: string;
  difficulty: Difficulty;
  created_at: string;
  completed_at: string | null;
};

export type BoardJson = Array<Array<{ v: number | null; g: boolean; p: number[] }>>;

export type RoomStateRow = {
  room_id: string;
  board: BoardJson;
  version: number;
  updated_at: string;
};

export function boardToJson(board: Board): BoardJson {
  return board.map((row) => row.map((cell) => ({ v: cell.value, g: cell.given, p: cell.pencil })));
}

export function jsonToBoard(json: BoardJson): Board {
  return json.map((row) => row.map((cell) => ({ value: cell.v, given: cell.g, pencil: cell.p ?? [] })));
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(length = 6): string {
  let s = "";
  for (let i = 0; i < length; i += 1) {
    s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return s;
}

export type CreateResult = { code: string; puzzle: string; solution: string; difficulty: Difficulty };

export async function createRoom(difficulty: Difficulty): Promise<CreateResult | null> {
  if (!supabase) return null;
  const puzzle = randomPuzzle(difficulty);
  const solution = solve(puzzle.givens);
  if (!solution) throw new Error(`Puzzle ${puzzle.id} has no solution`);
  const board = parseBoard(puzzle.givens);
  const code = makeCode();

  const { error: roomErr } = await supabase
    .from("rooms")
    .insert({ id: code, puzzle: puzzle.givens, solution, difficulty });
  if (roomErr) {
    console.error("createRoom rooms:", roomErr);
    return null;
  }

  const { error: stateErr } = await supabase
    .from("room_state")
    .insert({ room_id: code, board: boardToJson(board), version: 0 });
  if (stateErr) {
    console.error("createRoom state:", stateErr);
    return null;
  }

  return { code, puzzle: puzzle.givens, solution, difficulty };
}

export async function replaceRoomPuzzle(code: string, difficulty: Difficulty): Promise<CreateResult | null> {
  if (!supabase) return null;
  const puzzle = randomPuzzle(difficulty);
  const solution = solve(puzzle.givens);
  if (!solution) return null;
  const board = parseBoard(puzzle.givens);

  const { error: rErr } = await supabase
    .from("rooms")
    .update({ puzzle: puzzle.givens, solution, difficulty, completed_at: null })
    .eq("id", code);
  if (rErr) {
    console.error("replaceRoomPuzzle rooms:", rErr);
    return null;
  }

  const { error: sErr } = await supabase
    .from("room_state")
    .upsert({ room_id: code, board: boardToJson(board), version: 0 });
  if (sErr) {
    console.error("replaceRoomPuzzle state:", sErr);
    return null;
  }

  return { code, puzzle: puzzle.givens, solution, difficulty };
}

export async function fetchRoom(code: string): Promise<{ room: RoomRow; state: RoomStateRow } | null> {
  if (!supabase) return null;
  const { data: room, error: roomErr } = await supabase.from("rooms").select("*").eq("id", code).maybeSingle();
  if (roomErr || !room) return null;
  const { data: state, error: stateErr } = await supabase
    .from("room_state")
    .select("*")
    .eq("room_id", code)
    .maybeSingle();
  if (stateErr || !state) return null;
  return { room: room as RoomRow, state: state as RoomStateRow };
}

export async function pushBoardState(code: string, board: Board, version: number): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("room_state")
    .update({ board: boardToJson(board), version, updated_at: new Date().toISOString() })
    .eq("room_id", code);
  if (error) console.error("pushBoardState:", error);
}
