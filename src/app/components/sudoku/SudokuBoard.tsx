import type { Board, CellCoord } from "@/lib/sudoku/types";
import { getPeers } from "@/lib/sudoku/engine";
import { SudokuCell } from "./SudokuCell";

type Props = {
  board: Board;
  selected: CellCoord | null;
  conflicts: Set<string>;
  onSelect: (row: number, col: number) => void;
};

export function SudokuBoard({ board, selected, conflicts, onSelect }: Props) {
  const peers = selected ? getPeers(selected.row, selected.col) : new Set<string>();
  const sameValue = selected ? board[selected.row][selected.col].value : null;

  return (
    <div className="su-board" role="grid" aria-label="Sudoku board">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r},${c}`;
          const isSelected = selected?.row === r && selected?.col === c;
          const isPeer = peers.has(key);
          const isSameValue = sameValue != null && cell.value === sameValue;
          const isConflict = conflicts.has(key);
          return (
            <SudokuCell
              cell={cell}
              col={c}
              isConflict={isConflict}
              isPeer={isPeer}
              isSameValue={isSameValue}
              isSelected={isSelected}
              key={key}
              onSelect={onSelect}
              row={r}
            />
          );
        })
      )}
      <div className="su-thicks" aria-hidden="true">
        <div className="su-thick-h" style={{ top: "33.3333%" }} />
        <div className="su-thick-h" style={{ top: "66.6667%" }} />
        <div className="su-thick-v" style={{ left: "33.3333%" }} />
        <div className="su-thick-v" style={{ left: "66.6667%" }} />
      </div>
    </div>
  );
}
