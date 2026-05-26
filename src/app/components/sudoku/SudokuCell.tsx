import type { Cell } from "@/lib/sudoku/types";

type Props = {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  isPeer: boolean;
  isSameValue: boolean;
  isConflict: boolean;
  onSelect: (row: number, col: number) => void;
};

export function SudokuCell({ cell, row, col, isSelected, isPeer, isSameValue, isConflict, onSelect }: Props) {
  const classes = [
    "su-cell",
    cell.given ? "is-given" : "is-user-mine",
    isSelected ? "is-selected" : "",
    isPeer && !isSelected ? "is-peer" : "",
    isSameValue && !isSelected ? "is-same" : "",
    isConflict ? "is-conflict" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} onClick={() => onSelect(row, col)} type="button">
      {cell.value ? (
        <span className="su-value">{cell.value}</span>
      ) : cell.pencil.length > 0 ? (
        <span className="su-pencil-grid">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <span className="su-pencil-mark" key={n}>
              {cell.pencil.includes(n) ? n : ""}
            </span>
          ))}
        </span>
      ) : null}
    </button>
  );
}
