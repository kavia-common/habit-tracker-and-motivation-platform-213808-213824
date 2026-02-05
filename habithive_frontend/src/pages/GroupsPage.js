import React, { useMemo } from "react";
import { listGroups } from "../api/client";
import { useAsync } from "../hooks/useAsync";

/**
 * Groups page: shows groups list when backend supports it.
 */

// PUBLIC_INTERFACE
export function GroupsPage() {
  /** Accountability groups page. */
  const groupsCall = useAsync(listGroups, [], { immediate: true });

  const groups = useMemo(() => {
    if (!groupsCall.value) return [];
    if (Array.isArray(groupsCall.value)) return groupsCall.value;
    if (typeof groupsCall.value === "object" && Array.isArray(groupsCall.value.items)) return groupsCall.value.items;
    return [];
  }, [groupsCall.value]);

  return (
    <div>
      <h2 className="hh-section-title">Groups</h2>

      <section className="hh-card hh-panel" aria-label="Groups list">
        <div className="hh-inline" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Accountability arcade</div>
            <div className="hh-muted">Join a squad, run weekly challenges, and keep streaks honest.</div>
          </div>
          <button className="hh-btn" type="button" onClick={() => groupsCall.execute()}>
            Refresh
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {groupsCall.isLoading || groupsCall.isIdle ? <div className="hh-muted">Loading groups…</div> : null}

          {groupsCall.isError ? (
            <div className="hh-alert">
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Could not load groups</div>
              <div className="hh-muted">{String(groupsCall.error?.message || groupsCall.error || "Unknown error")}</div>
              <div className="hh-muted" style={{ marginTop: 8 }}>
                Backend groups endpoints will light up in later steps. For now, you can still browse the dashboard.
              </div>
            </div>
          ) : null}

          {!groupsCall.isLoading && !groupsCall.isError ? (
            groups.length ? (
              <ul className="hh-list" aria-label="Groups list">
                {groups.map((g, idx) => (
                  <li key={g.id || g.group_id || `${g.name || "group"}-${idx}`} className="hh-list-item">
                    <div style={{ fontWeight: 800 }}>{g.name || "Unnamed group"}</div>
                    <div className="hh-muted">
                      {g.members_count != null ? (
                        <>
                          members: <span className="hh-mono">{g.members_count}</span>
                        </>
                      ) : (
                        "members: unknown"
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="hh-muted">
                No groups found (or endpoint not implemented yet). When ready, this page will show your squads and
                challenges.
              </div>
            )
          ) : null}
        </div>
      </section>
    </div>
  );
}
