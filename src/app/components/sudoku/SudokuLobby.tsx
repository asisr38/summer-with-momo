"use client";

import { useEffect, useState } from "react";
import type { Difficulty } from "@/lib/sudoku/types";

type Identity = "ashish" | "momo";

type Props = {
  supabaseReady: boolean;
  onEnterSolo: (difficulty: Difficulty) => void;
  onCreateRoom: (me: Identity, difficulty: Difficulty) => void;
  onJoinRoom: (code: string, me: Identity) => void;
};

const IDENTITIES: Array<{ key: Identity; label: string }> = [
  { key: "ashish", label: "Ashish" },
  { key: "momo", label: "Momo" }
];

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function difficultyLabel(d: Difficulty): string {
  if (d === "easy") return "Easy";
  if (d === "medium") return "Medium";
  return "Hard";
}

export function SudokuLobby({ supabaseReady, onEnterSolo, onCreateRoom, onJoinRoom }: Props) {
  const [me, setMe] = useState<Identity>(() => {
    if (typeof window === "undefined") return "ashish";
    return (window.localStorage.getItem("su:me") as Identity | null) ?? "ashish";
  });
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("su:me", me);
  }, [me]);

  const handleCreate = async () => {
    if (!supabaseReady) return;
    setCreating(true);
    try {
      await onCreateRoom(me, difficulty);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) return;
    onJoinRoom(code, me);
  };

  return (
    <div className="su-wrap">
      <div className="su-lobby">
        <h3>One board, two players.</h3>
        <p>
          Start solo, or open a room and share the code so you can solve the same puzzle from opposite couches (or
          opposite cities).
        </p>

        <p className="section-eyebrow" style={{ marginBottom: 8 }}>
          You are
        </p>
        <div className="su-diff" style={{ marginBottom: 24 }}>
          {IDENTITIES.map((id) => (
            <button
              aria-pressed={me === id.key}
              className={`btn-ghost ${me === id.key ? "is-active" : ""}`}
              key={id.key}
              onClick={() => setMe(id.key)}
              type="button"
            >
              {id.label}
            </button>
          ))}
        </div>

        <p className="section-eyebrow" style={{ marginBottom: 8 }}>
          Difficulty
        </p>
        <div className="su-diff" style={{ marginBottom: 28 }}>
          {DIFFICULTIES.map((d) => (
            <button
              aria-pressed={difficulty === d}
              className={`btn-ghost ${difficulty === d ? "is-active" : ""}`}
              key={d}
              onClick={() => setDifficulty(d)}
              type="button"
            >
              {difficultyLabel(d)}
            </button>
          ))}
        </div>

        <div className="su-lobby-row">
          <button className="btn-primary" onClick={handleCreate} disabled={!supabaseReady || creating} type="button">
            {creating ? "Opening room…" : "Open a room"}
          </button>
          <button className="btn-ghost" onClick={() => onEnterSolo(difficulty)} type="button">
            Play solo
          </button>
        </div>

        {!supabaseReady ? (
          <div className="su-status">
            <span className="dot is-err" />
            Sync disabled. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> + <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
            <code>.env.local</code> to play together.
          </div>
        ) : (
          <div className="su-status">
            <span className="dot is-on" />
            Sync ready.
          </div>
        )}

        <div className="su-lobby-divider">or join a room</div>
        <div className="su-lobby-row">
          <input
            className="modal-input"
            maxLength={6}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            onKeyDown={(event) => event.key === "Enter" && handleJoin()}
            placeholder="Room code"
            style={{ marginBottom: 0, letterSpacing: "0.18em", textAlign: "center" }}
            type="text"
            value={joinCode}
          />
          <button className="btn-ghost" onClick={handleJoin} disabled={joinCode.trim().length < 4} type="button">
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
