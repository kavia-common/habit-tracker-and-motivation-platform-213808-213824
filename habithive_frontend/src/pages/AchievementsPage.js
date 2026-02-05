import React, { useMemo } from "react";
import { listAchievements } from "../api/client";
import { useAsync } from "../hooks/useAsync";

/**
 * Achievements page: badges and milestones.
 */

// PUBLIC_INTERFACE
export function AchievementsPage() {
  /** Badges/achievements screen. */
  const achCall = useAsync(listAchievements, [], { immediate: true });

  const achievements = useMemo(() => {
    if (!achCall.value) return [];
    if (Array.isArray(achCall.value)) return achCall.value;
    if (typeof achCall.value === "object" && Array.isArray(achCall.value.items)) return achCall.value.items;
    return [];
  }, [achCall.value]);

  return (
    <div>
      <h2 className="hh-section-title">Achievements</h2>

      <section className="hh-card hh-panel" aria-label="Achievements">
        <div className="hh-inline" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Badge cabinet</div>
            <div className="hh-muted">Collect neon milestones. Share wins. Level up your hive.</div>
          </div>
          <button className="hh-btn" type="button" onClick={() => achCall.execute()}>
            Refresh
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {achCall.isLoading || achCall.isIdle ? <div className="hh-muted">Loading achievements…</div> : null}

          {achCall.isError ? (
            <div className="hh-alert">
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Could not load achievements</div>
              <div className="hh-muted">{String(achCall.error?.message || achCall.error || "Unknown error")}</div>
            </div>
          ) : null}

          {!achCall.isLoading && !achCall.isError ? (
            achievements.length ? (
              <ul className="hh-list" aria-label="Achievements list">
                {achievements.map((a, idx) => (
                  <li key={a.id || a.badge_id || `${a.title || "badge"}-${idx}`} className="hh-list-item">
                    <div style={{ fontWeight: 800 }}>{a.title || a.name || "Untitled badge"}</div>
                    <div className="hh-muted">{a.description || "A mysterious retro achievement."}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="hh-muted">
                No achievements yet (or endpoint not implemented). Complete habits to unlock your first badge.
              </div>
            )
          ) : null}
        </div>
      </section>
    </div>
  );
}
