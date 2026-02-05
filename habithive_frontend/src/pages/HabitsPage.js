import React, { useCallback, useMemo, useState } from "react";
import { createHabit, listHabits } from "../api/client";
import { useAsync } from "../hooks/useAsync";

/**
 * Habits page: list + create.
 * Uses backend endpoints when available; shows actionable errors otherwise.
 */

// PUBLIC_INTERFACE
export function HabitsPage() {
  /** Habits screen with basic CRUD scaffolding and retro UI. */
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("daily"); // daily | weekly

  const habitsCall = useAsync(listHabits, [], { immediate: true });

  const normalizedHabits = useMemo(() => {
    // Accept either array payload, or {items: []}, or null.
    if (!habitsCall.value) return [];
    if (Array.isArray(habitsCall.value)) return habitsCall.value;
    if (typeof habitsCall.value === "object" && Array.isArray(habitsCall.value.items)) return habitsCall.value.items;
    return [];
  }, [habitsCall.value]);

  const [createError, setCreateError] = useState(null);
  const [createStatus, setCreateStatus] = useState("idle"); // idle | loading | success | error

  const validate = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return "Please enter a habit name.";
    if (trimmed.length < 2) return "Habit name is too short.";
    if (trimmed.length > 64) return "Habit name is too long (max 64).";
    if (!["daily", "weekly"].includes(schedule)) return "Invalid schedule.";
    return null;
  }, [name, schedule]);

  const onCreate = useCallback(
    async (e) => {
      e.preventDefault();
      setCreateError(null);

      const msg = validate();
      if (msg) {
        setCreateStatus("error");
        setCreateError(new Error(msg));
        return;
      }

      setCreateStatus("loading");
      try {
        await createHabit({ name: name.trim(), schedule });
        setCreateStatus("success");
        setName("");
        // refresh list
        habitsCall.execute();
      } catch (err) {
        setCreateStatus("error");
        setCreateError(err);
      }
    },
    [validate, name, schedule, habitsCall]
  );

  return (
    <div>
      <h2 className="hh-section-title">Habits</h2>

      <div className="hh-grid">
        <section className="hh-card hh-panel hh-col-6" aria-label="Create habit">
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Create a new habit</div>
          <div className="hh-muted" style={{ marginBottom: 12 }}>
            Start tiny. Keep it consistent. Earn streaks like it’s 1989.
          </div>

          <form onSubmit={onCreate}>
            <div className="hh-grid">
              <div className="hh-col-12">
                <label className="hh-muted" style={{ display: "block", marginBottom: 6 }}>
                  Habit name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="hh-input"
                  placeholder="e.g., Drink water"
                  maxLength={64}
                />
              </div>

              <div className="hh-col-12">
                <label className="hh-muted" style={{ display: "block", marginBottom: 6 }}>
                  Schedule
                </label>
                <select value={schedule} onChange={(e) => setSchedule(e.target.value)} className="hh-input">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="hh-col-12">
                <button className="hh-btn hh-btn-primary" type="submit" disabled={createStatus === "loading"}>
                  {createStatus === "loading" ? "Creating..." : "Create habit"}
                </button>
                {createStatus === "success" ? (
                  <span className="hh-muted" style={{ marginLeft: 10 }}>
                    Saved. Refreshing list…
                  </span>
                ) : null}
              </div>
            </div>
          </form>

          {createStatus === "error" && createError ? (
            <div className="hh-alert" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Could not create habit</div>
              <div className="hh-muted">{String(createError.message || createError)}</div>
            </div>
          ) : null}
        </section>

        <section className="hh-card hh-panel hh-col-6" aria-label="Habit list">
          <div className="hh-inline" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Your hive</div>
              <div className="hh-muted">Live data when backend endpoints are available.</div>
            </div>
            <button className="hh-btn" type="button" onClick={() => habitsCall.execute()}>
              Refresh
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            {habitsCall.isLoading || habitsCall.isIdle ? (
              <div className="hh-muted">Loading habits…</div>
            ) : null}

            {habitsCall.isError ? (
              <div className="hh-alert">
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Could not load habits</div>
                <div className="hh-muted">
                  {String(habitsCall.error?.message || habitsCall.error || "Unknown error")}
                </div>
                <div className="hh-muted" style={{ marginTop: 8 }}>
                  Tip: The current backend OpenAPI only exposes <span className="hh-mono">GET /</span> (health). Habits
                  endpoints may be added in later steps.
                </div>
              </div>
            ) : null}

            {!habitsCall.isLoading && !habitsCall.isError ? (
              normalizedHabits.length ? (
                <ul className="hh-list" aria-label="Habits list">
                  {normalizedHabits.map((h, idx) => (
                    <li key={h.id || h.habit_id || `${h.name || "habit"}-${idx}`} className="hh-list-item">
                      <div style={{ fontWeight: 800 }}>{h.name || "Untitled habit"}</div>
                      <div className="hh-muted">
                        {h.schedule || h.frequency || "schedule: unknown"}{" "}
                        {h.streak != null ? (
                          <>
                            <span className="hh-muted">•</span> streak: <span className="hh-mono">{h.streak}</span>
                          </>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="hh-muted">
                  No habits yet (or the endpoint isn’t implemented). Create one on the left to get started.
                </div>
              )
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
