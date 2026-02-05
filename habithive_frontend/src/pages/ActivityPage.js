import React, { useMemo } from "react";
import { listActivityFeed } from "../api/client";
import { useAsync } from "../hooks/useAsync";

/**
 * Activity feed page: community / friends feed.
 */

// PUBLIC_INTERFACE
export function ActivityPage() {
  /** Social/community activity feed. */
  const feedCall = useAsync(listActivityFeed, [], { immediate: true });

  const items = useMemo(() => {
    if (!feedCall.value) return [];
    if (Array.isArray(feedCall.value)) return feedCall.value;
    if (typeof feedCall.value === "object" && Array.isArray(feedCall.value.items)) return feedCall.value.items;
    return [];
  }, [feedCall.value]);

  return (
    <div>
      <h2 className="hh-section-title">Activity</h2>

      <section className="hh-card hh-panel" aria-label="Activity feed">
        <div className="hh-inline" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Community feed</div>
            <div className="hh-muted">A retro ticker of streaks, badges, and shout-outs.</div>
          </div>
          <button className="hh-btn" type="button" onClick={() => feedCall.execute()}>
            Refresh
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {feedCall.isLoading || feedCall.isIdle ? <div className="hh-muted">Loading activity…</div> : null}

          {feedCall.isError ? (
            <div className="hh-alert">
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Could not load activity</div>
              <div className="hh-muted">{String(feedCall.error?.message || feedCall.error || "Unknown error")}</div>
              <div className="hh-muted" style={{ marginTop: 8 }}>
                This will become a real-time-ish feed once the backend adds the endpoint.
              </div>
            </div>
          ) : null}

          {!feedCall.isLoading && !feedCall.isError ? (
            items.length ? (
              <ul className="hh-list" aria-label="Activity items">
                {items.map((it, idx) => (
                  <li key={it.id || `${it.type || "evt"}-${idx}`} className="hh-list-item">
                    <div style={{ fontWeight: 800 }}>{it.title || it.type || "Activity"}</div>
                    <div className="hh-muted">{it.message || it.text || "A mysterious event echoes through the hive."}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="hh-muted">No activity yet (or endpoint not implemented). Complete a habit to start the buzz.</div>
            )
          ) : null}
        </div>
      </section>
    </div>
  );
}
