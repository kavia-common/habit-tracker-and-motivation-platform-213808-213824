import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Application shell: header + sidebar + main content area.
 */

// PUBLIC_INTERFACE
export function AppShell({ children, backendStatus, onRetryBackend }) {
  /** @param {{children: React.ReactNode, backendStatus: any, onRetryBackend: Function}} props */
  return (
    <div className="App">
      <div className="hh-shell">
        <header className="hh-header">
          <div className="hh-brand">
            <div className="hh-logo" aria-hidden="true" />
            <div>
              <h1 className="hh-title">HabitHive</h1>
              <p className="hh-tagline">Retro habit tracking + motivation hub</p>
            </div>
          </div>

          <nav className="hh-topnav" aria-label="Top navigation">
            <NavLink className="hh-link" to="/" end>
              Dashboard
            </NavLink>
            <NavLink className="hh-link" to="/habits">
              Habits
            </NavLink>
            <NavLink className="hh-link" to="/groups">
              Groups
            </NavLink>
          </nav>
        </header>

        <aside className="hh-card hh-sidebar" aria-label="Sidebar">
          <div>
            <div className="hh-section-title">Quick Access</div>
            <div className="hh-inline">
              <NavLink className="hh-link" to="/achievements">
                Achievements
              </NavLink>
              <NavLink className="hh-link" to="/activity">
                Activity
              </NavLink>
            </div>
          </div>

          <div>
            <div className="hh-section-title">Backend Status</div>
            {backendStatus?.ok ? (
              <div className="hh-badge">
                <span className="hh-mono">ONLINE</span>
                <span className="hh-muted">/</span>
                <span className="hh-muted">health check OK</span>
              </div>
            ) : (
              <div className="hh-alert">
                <div style={{ fontWeight: 800, marginBottom: 6 }}>OFFLINE</div>
                <div className="hh-muted" style={{ marginBottom: 10 }}>
                  Cannot reach API. Set <span className="hh-mono">REACT_APP_API_BASE_URL</span> if needed.
                </div>
                <button className="hh-btn hh-btn-primary" onClick={onRetryBackend} type="button">
                  Retry connection
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="hh-section-title">Retro Tip</div>
            <div className="hh-muted">
              “Small steps, big streaks.” Start with one daily habit, then level up weekly.
            </div>
          </div>
        </aside>

        <main className="hh-card hh-main" aria-label="Main content">
          {children}
        </main>
      </div>
    </div>
  );
}
