import type { Board, Cell, CellValue } from "./types";

export const SIZE = 9;
export const BOX = 3;

export function parseBoard(givens: string): Board {
  if (givens.length !== 81) {
    throw new Error(`Puzzle string must be 81 chars, got ${givens.length}`);
  }

  const board: Board = [];
  for (let row = 0; row < SIZE; row += 1) {
    const cells: Cell[] = [];
    for (let col = 0; col < SIZE; col += 1) {
      const ch = givens[row * SIZE + col];
      const n = Number(ch);
      const isGiven = n >= 1 && n <= 9;
      cells.push({
        value: isGiven ? n : null,
        given: isGiven,
        pencil: []
      });
    }
    board.push(cells);
  }
  return board;
}

export function serializeValues(board: Board): string {
  let out = "";
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      out += board[row][col].value ?? 0;
    }
  }
  return out;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell, pencil: [...cell.pencil] })));
}

function valuesGrid(board: Board): CellValue[][] {
  return board.map((row) => row.map((cell) => cell.value));
}

export function getConflicts(board: Board): Set<string> {
  const conflicts = new Set<string>();
  const grid = valuesGrid(board);

  for (let i = 0; i < SIZE; i += 1) {
    addLineConflicts(
      conflicts,
      Array.from({ length: SIZE }, (_, j) => ({ row: i, col: j, value: grid[i][j] }))
    );
    addLineConflicts(
      conflicts,
      Array.from({ length: SIZE }, (_, j) => ({ row: j, col: i, value: grid[j][i] }))
    );
  }

  for (let br = 0; br < SIZE; br += BOX) {
    for (let bc = 0; bc < SIZE; bc += BOX) {
      const cells: Array<{ row: number; col: number; value: CellValue }> = [];
      for (let r = br; r < br + BOX; r += 1) {
        for (let c = bc; c < bc + BOX; c += 1) {
          cells.push({ row: r, col: c, value: grid[r][c] });
        }
      }
      addLineConflicts(conflicts, cells);
    }
  }

  return conflicts;
}

function addLineConflicts(
  conflicts: Set<string>,
  cells: Array<{ row: number; col: number; value: CellValue }>
) {
  const byValue = new Map<number, Array<{ row: number; col: number }>>();
  for (const cell of cells) {
    if (cell.value == null) continue;
    const list = byValue.get(cell.value) ?? [];
    list.push({ row: cell.row, col: cell.col });
    byValue.set(cell.value, list);
  }
  for (const list of byValue.values()) {
    if (list.length > 1) {
      for (const { row, col } of list) {
        conflicts.add(`${row},${col}`);
      }
    }
  }
}

export function isSolved(board: Board): boolean {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col].value == null) return false;
    }
  }
  return getConflicts(board).size === 0;
}

export function solve(givens: string): string | null {
  if (givens.length !== 81) return null;
  const grid: number[] = givens.split("").map((c) => {
    const n = Number(c);
    return n >= 1 && n <= 9 ? n : 0;
  });

  if (!isValidStart(grid)) return null;
  if (!backtrack(grid)) return null;
  return grid.join("");
}

function isValidStart(grid: number[]): boolean {
  for (let i = 0; i < 81; i += 1) {
    const v = grid[i];
    if (v === 0) continue;
    grid[i] = 0;
    if (!canPlace(grid, i, v)) {
      grid[i] = v;
      return false;
    }
    grid[i] = v;
  }
  return true;
}

function backtrack(grid: number[]): boolean {
  const idx = grid.indexOf(0);
  if (idx === -1) return true;
  for (let v = 1; v <= 9; v += 1) {
    if (canPlace(grid, idx, v)) {
      grid[idx] = v;
      if (backtrack(grid)) return true;
      grid[idx] = 0;
    }
  }
  return false;
}

function canPlace(grid: number[], idx: number, value: number): boolean {
  const row = Math.floor(idx / SIZE);
  const col = idx % SIZE;
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;

  for (let i = 0; i < SIZE; i += 1) {
    if (grid[row * SIZE + i] === value) return false;
    if (grid[i * SIZE + col] === value) return false;
  }
  for (let r = boxRow; r < boxRow + BOX; r += 1) {
    for (let c = boxCol; c < boxCol + BOX; c += 1) {
      if (grid[r * SIZE + c] === value) return false;
    }
  }
  return true;
}

export function getPeers(row: number, col: number): Set<string> {
  const peers = new Set<string>();
  for (let i = 0; i < SIZE; i += 1) {
    peers.add(`${row},${i}`);
    peers.add(`${i},${col}`);
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r += 1) {
    for (let c = boxCol; c < boxCol + BOX; c += 1) {
      peers.add(`${r},${c}`);
    }
  }
  peers.delete(`${row},${col}`);
  return peers;
}
