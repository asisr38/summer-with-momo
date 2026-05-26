import type { Board } from "@/lib/sudoku/types";

type Props = {
  board: Board;
  pencilMode: boolean;
  onInput: (n: number) => void;
  onErase: () => void;
  onTogglePencil: () => void;
};

function countPlaced(board: Board, n: number): number {
  let total = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.value === n) total += 1;
    }
  }
  return total;
}

export function NumberPad({ board, pencilMode, onInput, onErase, onTogglePencil }: Props) {
  return (
    <div className="su-pad">
      <div className="su-pad-numbers">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const placed = countPlaced(board, n);
          const done = placed >= 9;
          return (
            <button
              className={`su-pad-num ${done ? "is-done" : ""}`}
              disabled={done}
              key={n}
              onClick={() => onInput(n)}
              type="button"
            >
              <span className="su-pad-digit">{n}</span>
              <span className="su-pad-count">{placed}/9</span>
            </button>
          );
        })}
      </div>
      <div className="su-pad-actions">
        <button
          aria-pressed={pencilMode}
          className={`su-pad-action ${pencilMode ? "is-active" : ""}`}
          onClick={onTogglePencil}
          type="button"
        >
          Pencil · {pencilMode ? "on" : "off"}
        </button>
        <button className="su-pad-action" onClick={onErase} type="button">
          Erase
        </button>
      </div>
    </div>
  );
}
