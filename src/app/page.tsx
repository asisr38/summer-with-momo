"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ARRIVAL, DEPARTURE, HER_NAME, SECRET_PWD, eats, trips, weeks } from "@/lib/data";
import type { Day } from "@/lib/data";

type Tab = "plan" | "trips" | "eats" | "track";

const progressMessages = [
  "Check off dates as you experience them together! 💕",
  "The adventure is just beginning! 🌟",
  "You're on your way — keep making memories! 💖",
  "Halfway through the most amazing summer! ✨",
  "Almost there — every moment counts! 🥹",
  "What an incredible summer you've had together! 💖🎉"
];

function readCheckedDays() {
  if (typeof window === "undefined") return new Set<string>();

  return new Set(
    weeks
      .flatMap((week) => week.days)
      .filter((day) => window.localStorage.getItem(`check_${day.id}`) === "1")
      .map((day) => day.id)
  );
}

function getCountdown() {
  const arrival = new Date(ARRIVAL);
  const departure = new Date(DEPARTURE);
  const now = new Date();
  const diff = arrival.getTime() - now.getTime();

  if (diff <= 0 && now <= departure) {
    const dayIn = Math.floor((now.getTime() - arrival.getTime()) / 86400000) + 1;
    return { message: `🎉 She's here! Day ${dayIn} of 56! 💖` };
  }

  if (now > departure) {
    return { message: "💖 What an incredible summer together! 🌟" };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000)
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [checkedDays, setCheckedDays] = useState<Set<string>>(() => new Set());
  const [countdown, setCountdown] = useState(getCountdown);
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretMode, setSecretMode] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [secretError, setSecretError] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; emoji: string; left: number; duration: number; delay: number; size: number }>>([]);

  const allDays = useMemo(() => weeks.flatMap((week) => week.days), []);
  const doneCount = checkedDays.size;
  const totalDays = allDays.length;
  const progressPct = totalDays ? Math.round((doneCount / totalDays) * 100) : 0;
  const progressNote = progressMessages[Math.min(Math.floor(progressPct / 20), progressMessages.length - 1)];

  useEffect(() => {
    setCheckedDays(readCheckedDays());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);

    const emojis = ["💖", "💕", "🌸", "✨", "💗", "🌷", "💝", "⭐", "🌟", "💞"];
    setHearts(
      Array.from({ length: 18 }, (_, id) => ({
        id,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 20,
        size: 0.9 + Math.random() * 1.2
      }))
    );

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
      <div className="hearts-bg" aria-hidden="true">
        {hearts.map((heart) => (
          <div
            className="heart-float"
            key={heart.id}
            style={{
              left: `${heart.left}%`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}rem`
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>

      <header className="hero">
        <div className="hero-logo">Our Summer in DC 💖</div>
        <div className="hero-sub">
          Ashish & <span>{HER_NAME}</span> · June 22 – August 16, 2026
        </div>
        <CountdownView countdown={countdown} />
        <div className="hero-dates">✈️ Arrives June 22 &nbsp;·&nbsp; 56 magical days &nbsp;·&nbsp; Departs August 16 ✈️</div>
      </header>

      <StatsBar doneCount={doneCount} totalDays={totalDays} />

      <nav className="tabs-nav" aria-label="Summer sections">
        <TabButton active={activeTab === "plan"} onClick={() => setActiveTab("plan")}>
          📅 The Plan
        </TabButton>
        <TabButton active={activeTab === "trips"} onClick={() => setActiveTab("trips")}>
          ✈️ Our Trips
        </TabButton>
        <TabButton active={activeTab === "eats"} onClick={() => setActiveTab("eats")}>
          🍽️ Where to Eat
        </TabButton>
        <TabButton active={activeTab === "track"} onClick={() => setActiveTab("track")}>
          💚 Progress
        </TabButton>
      </nav>

      <main className="content">
        <section className={`tab-panel ${activeTab === "plan" ? "active" : ""}`}>
          {weeks.map((week) => (
            <div className="week-block" key={week.title}>
              <div className="week-title">
                {week.title} <span className="badge">{week.subtitle}</span>
              </div>
              {week.days.map((day) => (
                <DayCard day={day} checked={checkedDays.has(day.id)} key={day.id} onToggle={toggleCheck} />
              ))}
            </div>
          ))}
        </section>

        <section className={`tab-panel ${activeTab === "trips" ? "active" : ""}`}>
          <p className="section-title">✈️ Our Adventures Beyond DC</p>
          <div className="trip-grid">
            {trips.map((trip) => (
              <div className="trip-card" key={trip.title}>
                <div className={`trip-header ${trip.type}`}>
                  <div className="trip-when">{trip.when}</div>
                  <div className="trip-title-text">
                    {trip.icon} {trip.title}
                  </div>
                  <div className="trip-subtitle">{trip.subtitle}</div>
                </div>
                <div className="trip-body">
                  {trip.items.map((item) => (
                    <div className="trip-row" key={`${trip.title}-${item.t}`}>
                      <div className="trip-icon">{item.i}</div>
                      <div className="trip-row-text">{item.t}</div>
                    </div>
                  ))}
                  <div>
                    <span className="trip-cost">💰 {trip.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`tab-panel ${activeTab === "eats" ? "active" : ""}`}>
          <p className="section-title">🍽️ Where We&apos;re Eating This Summer</p>
          {eats.map((section) => (
            <div className="resto-section" key={section.section}>
              <div className="resto-section-title">{section.section}</div>
              <div className="resto-grid">
                {section.items.map((restaurant) => (
                  <div className="resto-card" key={`${section.section}-${restaurant.n}`}>
                    <div className="resto-name">{restaurant.n}</div>
                    <div className="resto-type">{restaurant.c}</div>
                    <div className="resto-why">{restaurant.w}</div>
                    <div className="resto-price">{restaurant.p}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className={`tab-panel ${activeTab === "track" ? "active" : ""}`}>
          <div className="progress-box">
            <div className="progress-title">💚 Our Summer Progress</div>
            <div className="progress-pct">{progressPct}%</div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="progress-note">{progressNote}</div>
            <div className="progress-grid">
              <ProgressCard label="Dates Done" value={doneCount} />
              <ProgressCard label="Still Ahead" value={totalDays - doneCount} />
              <ProgressCard label="Trips Planned" value={4} />
              <ProgressCard label="Days Together" value={56} />
            </div>
          </div>
          <div>
            <div className="section-title">✅ All Dates Checklist</div>
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
      </main>

      <button id="secret-btn" onClick={openSecretModal} title="Ashish's Secret View" type="button">
        {secretMode ? "🔓" : "🔒"}
      </button>

      <div className={`modal-overlay ${secretOpen ? "open" : ""}`} onClick={(event) => event.target === event.currentTarget && closeModal()}>
        <div className="modal">
          <div className="modal-emoji">🔐</div>
          <div className="modal-title">Secret Mode</div>
          <div className="modal-sub">Enter the password to reveal all surprise details and secret notes! Only Ashish knows this one 🤫</div>
          <input
            className={`modal-input ${secretError ? "error" : ""}`}
            onChange={(event) => setSecretInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && checkSecret()}
            placeholder="password"
            type="password"
            value={secretInput}
          />
          <button className="modal-btn" onClick={checkSecret} type="button">
            Unlock Surprises 🌟
          </button>
          <button className="modal-close" onClick={closeModal} type="button">
            Never mind
          </button>
        </div>
      </div>
    </>
  );
}

function CountdownView({ countdown }: { countdown: ReturnType<typeof getCountdown> }) {
  if ("message" in countdown) {
    return (
      <div className="countdown-box">
        <div className="countdown-message">{countdown.message}</div>
      </div>
    );
  }

  return (
    <div className="countdown-box">
      <CountdownUnit label="Days" value={countdown.days} />
      <div className="cd-sep">:</div>
      <CountdownUnit label="Hours" value={countdown.hours} />
      <div className="cd-sep">:</div>
      <CountdownUnit label="Minutes" value={countdown.minutes} />
    </div>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="cd-unit">
      <div className="cd-num">{String(value).padStart(2, "0")}</div>
      <div className="cd-label">{label}</div>
    </div>
  );
}

function StatsBar({ doneCount, totalDays }: { doneCount: number; totalDays: number }) {
  return (
    <div className="stats">
      <div className="stat-pill">📅 56 days together</div>
      <div className="stat-pill">✈️ 4 trips planned</div>
      <div className="stat-pill">🛍️ Tysons shopping day</div>
      <div className="stat-pill">🎭 Musical nights every week</div>
      <div className="stat-pill">🌲 Grand Marais birthday</div>
      <div className="stat-pill">🗽 NYC + Broadway</div>
      <div className="stat-pill">
        💚 {doneCount}/{totalDays} dates done
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button className={`tab-btn ${active ? "active" : ""}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function DayCard({ checked, day, onToggle }: { checked: boolean; day: Day; onToggle: (id: string) => void }) {
  const [month, dayNumber] = day.date.split(" ");

  return (
    <div className={`day-card type-${day.type} ${checked ? "completed" : ""}`} id={`card_${day.id}`}>
      <div className="date-col">
        <div className="day-name">{day.day}</div>
        <div className="day-num">{dayNumber}</div>
        <div className="month-name">{month}</div>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className={`type-tag tag-${day.type}`}>{day.tag}</span>
        </div>
        <div className="card-title">
          {day.emoji} {day.title}
        </div>
        <div className="card-desc">{day.desc}</div>
        {day.isSurprise ? <div className="surprise-blur">✨ Ashish has something magical planned... 🔒</div> : null}
        {day.secretNote ? <div className="secret-note">{day.secretNote}</div> : null}
        <div className="card-footer">
          <span className="cost-badge">💰 {day.cost}</span>
          <button className={`check-btn ${checked ? "checked" : ""}`} onClick={() => onToggle(day.id)} title="Mark as done!" type="button">
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="prog-card">
      <div className="prog-card-num">{value}</div>
      <div className="prog-card-label">{label}</div>
    </div>
  );
}

function TrackRow({ checked, day, onToggle }: { checked: boolean; day: Day; onToggle: (id: string) => void }) {
  return (
    <div className={`track-row ${checked ? "is-complete" : ""}`}>
      <button className={`check-btn ${checked ? "checked" : ""}`} onClick={() => onToggle(day.id)} type="button">
        ✓
      </button>
      <span className="track-date">
        {day.day} {day.date}
      </span>
      <span className="track-title">
        {day.emoji} {day.title}
      </span>
    </div>
  );
}
