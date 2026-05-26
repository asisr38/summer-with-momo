export type Difficulty = "easy" | "medium" | "hard";

export type CellValue = number | null;

export type Cell = {
  value: CellValue;
  given: boolean;
  pencil: number[];
};

export type Board = Cell[][];

export type CellCoord = { row: number; col: number };

export type Puzzle = {
  id: string;
  difficulty: Difficulty;
  givens: string;
};
