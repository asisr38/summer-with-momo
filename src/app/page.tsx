"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ARRIVAL, DEPARTURE, HER_NAME, SECRET_PWD, eats, trips, weeks } from "@/lib/data";
import type { Day, Trip } from "@/lib/data";
import { SudokuGame } from "./components/sudoku/SudokuGame";

type Tab = "plan" | "trips" | "eats" | "progress" | "sudoku";

type Countdown =
  | { phase: "before"; days: number; hours: number; minutes: number; seconds: number }
  | { phase: "during"; dayOfTrip: number; totalDays: number }
  | { phase: "after" };

const TOTAL_DAYS = 56;

const progressNotes = [
  "Still waiting.",
  "She's landed. You're moving.",
  "Settling into it.",
  "Halfway through.",
  "More memory than countdown.",
  "Almost the long goodbye.",
  "Held."
];

function noteForProgress(pct: number): string {
  if (pct === 0) return progressNotes[0];
  if (pct < 20) return progressNotes[1];
  if (pct < 40) return progressNotes[2];
  if (pct < 60) return progressNotes[3];
  if (pct < 80) return progressNotes[4];
  if (pct < 100) return progressNotes[5];
  return progressNotes[6];
}

function readCheckedDays() {
  if (typeof window === "undefined") return new Set<string>();
  return new Set(
    weeks
      .flatMap((week) => week.days)
      .filter((day) => window.localStorage.getItem(`check_${day.id}`) === "1")
      .map((day) => day.id)
  );
}

function getCountdown(): Countdown {
  const arrival = new Date(ARRIVAL);
  const departure = new Date(DEPARTURE);
  const now = new Date();
  const diff = arrival.getTime() - now.getTime();

  if (diff <= 0 && now <= departure) {
    return {
      phase: "during",
      dayOfTrip: Math.floor((now.getTime() - arrival.getTime()) / 86400000) + 1,
      totalDays: TOTAL_DAYS
    };
  }

  if (now > departure) return { phase: "after" };

  return {
    phase: "before",
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
}

function stripTagEmoji(tag: string): string {
  return tag
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}]/gu, "")
    .trim()
    .toUpperCase();
}

const TYPE_TONE: Record<string, string> = {
  arrival: "tone-rose",
  nyc: "tone-rose",
  musical: "tone-plum",
  evening: "tone-ochre",
  weekend: "tone-sage",
  camp: "tone-sage",
  away: "tone-peach",
  holiday: "tone-peach",
  beach: "tone-teal"
};

const TAB_LIST: Array<{ key: Tab; label: string }> = [
  { key: "plan", label: "Plan" },
  { key: "trips", label: "Trips" },
  { key: "eats", label: "Eats" },
  { key: "progress", label: "Progress" },
  { key: "sudoku", label: "Sudoku" }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [checkedDays, setCheckedDays] = useState<Set<string>>(() => new Set());
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretMode, setSecretMode] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [secretError, setSecretError] = useState(false);
  const [tabRect, setTabRect] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});
  const tabsNavRef = useRef<HTMLDivElement | null>(null);

  const allDays = useMemo(() => weeks.flatMap((week) => week.days), []);
  const doneCount = checkedDays.size;
  const totalDays = allDays.length;
  const progressPct = totalDays ? Math.round((doneCount / totalDays) * 100) : 0;

  useEffect(() => {
    setCheckedDays(readCheckedDays());
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("secret-mode", secretMode);
    return () => document.body.classList.remove("secret-mode");
  }, [secretMode]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useLayoutEffect(() => {
    const node = tabRefs.current[activeTab];
    const wrap = tabsNavRef.current;
    if (!node || !wrap) return;
    setTabRect({ left: node.offsetLeft, width: node.offsetWidth });
  }, [activeTab]);

  useEffect(() => {
    function resize() {
      const node = tabRefs.current[activeTab];
      if (!node) return;
      setTabRect({ left: node.offsetLeft, width: node.offsetWidth });
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [activeTab]);

  function toggleCheck(id: string) {
    setCheckedDays((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
        window.localStorage.setItem(`check_${id}`, "0");
      } else {
        next.add(id);
        window.localStorage.setItem(`check_${id}`, "1");
      }
      return next;
    });
  }

  function openSecretModal() {
    if (secretMode) {
      setSecretMode(false);
      return;
    }
    setSecretOpen(true);
  }

  function closeModal() {
    setSecretOpen(false);
    setSecretInput("");
    setSecretError(false);
  }

  function checkSecret() {
    if (secretInput.trim() === SECRET_PWD) {
      setSecretMode(true);
      closeModal();
      return;
    }
    setSecretError(true);
    setSecretInput("");
    window.setTimeout(() => setSecretError(false), 400);
  }

  return (
    <>
      <Hero countdown={countdown} doneCount={doneCount} totalDays={totalDays} tripCount={trips.length} />

      <nav className="tabs-nav" aria-label="Sections">
        <div className="tabs-nav-inner" ref={tabsNavRef}>
          {TAB_LIST.map((tab) => (
            <button
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
          <div className="tab-indicator" style={{ left: tabRect.left, width: tabRect.width }} />
        </div>
      </nav>

      <main className="content">
        <section className={`tab-panel ${activeTab === "plan" ? "active" : ""}`}>
          <p className="section-eyebrow">The plan</p>
          <h2 className="section-headline">Sixty-two days, mostly together.</h2>
          {weeks.map((week) => (
            <div className="week-block" key={week.title}>
              <header className="week-header">
                <h3 className="week-title">{week.title}</h3>
                <div className="week-sub">{week.subtitle}</div>
              </header>
              {week.days.map((day) => (
                <DayRow day={day} checked={checkedDays.has(day.id)} key={day.id} onToggle={toggleCheck} />
              ))}
            </div>
          ))}
        </section>

        <section className={`tab-panel ${activeTab === "trips" ? "active" : ""}`}>
          <p className="section-eyebrow">Beyond DC</p>
          <h2 className="section-headline">The four trips.</h2>
          <div>
            {trips.map((trip) => (
              <TripBlock trip={trip} key={trip.title} />
            ))}
          </div>
        </section>

        <section className={`tab-panel ${activeTab === "eats" ? "active" : ""}`}>
          <p className="section-eyebrow">Where to eat</p>
          <h2 className="section-headline">A short list, by mood.</h2>
          {eats.map((section) => (
            <div className="resto-section" key={section.section}>
              <h3 className="resto-section-title">{section.section}</h3>
              <div className="resto-list">
                {section.items.map((r) => (
                  <article className="resto-row" key={`${section.section}-${r.n}`}>
                    <div>
                      <h4 className="resto-name">
                        {r.n}
                        <span className="resto-type"> — {r.c}</span>
                      </h4>
                      <p className="resto-why">{r.w}</p>
                    </div>
                    <div className="resto-price">{r.p}</div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className={`tab-panel ${activeTab === "progress" ? "active" : ""}`}>
          <p className="section-eyebrow">Progress</p>
          <h2 className="section-headline">{noteForProgress(progressPct)}</h2>
          <div className="progress-hero">
            <div className="progress-num">
              {doneCount}
              <small>/{totalDays}</small>
            </div>
            <div className="progress-meta">
              <div className="progress-meta-line">
                <strong>{doneCount}</strong> dates lived
              </div>
              <div className="progress-meta-line">
                <strong>{totalDays - doneCount}</strong> still ahead
              </div>
              <div className="progress-meta-line">
                <strong>{trips.length}</strong> trip blocks planned
              </div>
              <p className="progress-note">{progressPct}% of the summer.</p>
            </div>
          </div>

          <div className="progress-cal" aria-label="Calendar of 56 days">
            {allDays.map((day) => (
              <div
                aria-label={`${day.date}, ${checkedDays.has(day.id) ? "done" : "ahead"}`}
                className={`progress-dot ${checkedDays.has(day.id) ? "is-done" : ""}`}
                key={`dot-${day.id}`}
              />
            ))}
          </div>

          <div className="track-list">
            <p className="section-eyebrow">All dates</p>
            {weeks.map((week) => (
              <div key={`track-${week.title}`}>
                <div className="track-week-title">{week.title}</div>
                {week.days.map((day) => (
                  <TrackRow day={day} checked={checkedDays.has(day.id)} key={`track-${day.id}`} onToggle={toggleCheck} />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className={`tab-panel ${activeTab === "sudoku" ? "active" : ""}`}>
          <p className="section-eyebrow">Sudoku</p>
          <h2 className="section-headline">A board for the two of you.</h2>
          {activeTab === "sudoku" ? <SudokuGame /> : null}
        </section>
      </main>

      <button id="secret-btn" onClick={openSecretModal} title="Private notes" type="button">
        {secretMode ? "Hide notes" : "Private"}
      </button>

      <div className={`modal-overlay ${secretOpen ? "open" : ""}`} onClick={(event) => event.target === event.currentTarget && closeModal()}>
        <div className="modal">
          <div className="modal-title">Private notes</div>
          <div className="modal-sub">
            Enter the password to see the notes you left for yourself. Only you know this one.
          </div>
          <input
            autoFocus
            className={`modal-input ${secretError ? "error" : ""}`}
            onChange={(event) => setSecretInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && checkSecret()}
            placeholder="Password"
            type="password"
            value={secretInput}
          />
          <button className="btn-primary" onClick={checkSecret} type="button">
            Unlock
          </button>
          <button className="modal-close" onClick={closeModal} type="button">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

function Hero({ countdown, doneCount, totalDays, tripCount }: { countdown: Countdown | null; doneCount: number; totalDays: number; tripCount: number }) {
  return (
    <header className="hero">
      <p className="hero-eyebrow">Our summer.</p>

      {countdown === null ? (
        <div className="hero-counter-row">
          <div className="hero-counter" suppressHydrationWarning>
            &nbsp;
          </div>
          <div className="hero-counter-label">
            days until <span className="her-name">{HER_NAME}</span> lands in DC.
          </div>
        </div>
      ) : countdown.phase === "before" ? (
        <>
          <div className="hero-counter-row">
            <div className="hero-counter">{countdown.days}</div>
            <div className="hero-counter-label">
              days until <span className="her-name">{HER_NAME}</span> lands in DC.
            </div>
          </div>
          <div className="hero-units">
            <strong>{String(countdown.hours).padStart(2, "0")}</strong>h
            <strong>{String(countdown.minutes).padStart(2, "0")}</strong>m
            <strong>{String(countdown.seconds).padStart(2, "0")}</strong>s
          </div>
        </>
      ) : countdown.phase === "during" ? (
        <>
          <div className="hero-counter-row">
            <div className="hero-counter">{countdown.dayOfTrip}</div>
            <div className="hero-counter-label">
              of {countdown.totalDays} with <span className="her-name">{HER_NAME}</span>.
            </div>
          </div>
        </>
      ) : (
        <div className="hero-arrived">Held.</div>
      )}

      <div className="hero-meta">
        <span>Arrives Jun 22, 2026</span>
        <span>{TOTAL_DAYS} days</span>
        <span>Departs Aug 16, 2026</span>
        <span>
          {doneCount} of {totalDays} done
        </span>
        <span>{tripCount} trips</span>
      </div>
    </header>
  );
}

function DayRow({ checked, day, onToggle }: { checked: boolean; day: Day; onToggle: (id: string) => void }) {
  const [month, dayNumber] = day.date.split(" ");
  const tagText = stripTagEmoji(day.tag);
  const tone = TYPE_TONE[day.type] ?? "";

  return (
    <article className={`day ${checked ? "is-done" : ""}`}>
      <div className="day-date">
        {day.day}
        <span className="day-date-num">{dayNumber}</span>
        <span className="day-date-month">{month}</span>
      </div>
      <div className="day-body">
        {tagText ? <div className={`day-tag ${tone}`}>{tagText}</div> : null}
        <h3 className="day-title">
          {day.emoji} {day.title}
        </h3>
        <p className="day-desc">{day.desc}</p>
        {day.isSurprise ? <div className="surprise-blur">Ashish has something planned.</div> : null}
        {day.secretNote ? <div className="secret-note">{day.secretNote}</div> : null}
        {day.cost ? <div className="day-cost">{day.cost}</div> : null}
      </div>
      <button
        aria-label={checked ? "Mark as not done" : "Mark as done"}
        className={`day-check ${checked ? "is-checked" : ""}`}
        onClick={() => onToggle(day.id)}
        type="button"
      >
        ✓
      </button>
    </article>
  );
}

function TripBlock({ trip }: { trip: Trip }) {
  return (
    <article className="trip">
      <header>
        <div className="trip-when">{trip.when}</div>
        <h3 className="trip-title-text">
          {trip.icon} {trip.title}
        </h3>
        <p className="trip-subtitle">{trip.subtitle}</p>
      </header>
      <div className="trip-body">
        {trip.items.map((item, idx) => (
          <div className="trip-row" key={`${trip.title}-${item.t}`}>
            <div className="trip-row-marker">{String(idx + 1).padStart(2, "0")}</div>
            <div className="trip-row-text">
              <strong>{item.i}</strong> {item.t}
            </div>
          </div>
        ))}
        <div className="trip-cost">Budget · {trip.cost}</div>
      </div>
    </article>
  );
}

function TrackRow({ checked, day, onToggle }: { checked: boolean; day: Day; onToggle: (id: string) => void }) {
  return (
    <div className={`track-row ${checked ? "is-done" : ""}`}>
      <button
        aria-label={checked ? "Mark as not done" : "Mark as done"}
        className={`day-check ${checked ? "is-checked" : ""}`}
        onClick={() => onToggle(day.id)}
        type="button"
      >
        ✓
      </button>
      <span className="track-date">
        {day.day} {day.date}
      </span>
      <span className="track-title">{day.title}</span>
    </div>
  );
}
