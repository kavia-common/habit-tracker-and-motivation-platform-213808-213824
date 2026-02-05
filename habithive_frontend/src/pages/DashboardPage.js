import React, { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Dashboard page (retro look). Uses mock data until backend implements real habit endpoints.
 */

// PUBLIC_INTERFACE
export function DashboardPage() {
  const chartData = useMemo(
    () => [
      { day: "Mon", score: 2 },
      { day: "Tue", score: 3 },
      { day: "Wed", score: 4 },
      { day: "Thu", score: 3 },
      { day: "Fri", score: 5 },
      { day: "Sat", score: 4 },
      { day: "Sun", score: 6 }
    ],
    []
  );

  return (
    <div>
      <div className="hh-grid">
        <section className="hh-card hh-kpi hh-col-4" aria-label="KPI habits">
          <div className="hh-kpi-label">Active habits</div>
          <div className="hh-kpi-value">3</div>
          <div className="hh-muted">Add more to grow your hive.</div>
        </section>

        <section className="hh-card hh-kpi hh-col-4" aria-label="KPI streak">
          <div className="hh-kpi-label">Longest streak</div>
          <div className="hh-kpi-value">7 days</div>
          <div className="hh-muted">Keep the chain alive.</div>
        </section>

        <section className="hh-card hh-kpi hh-col-4" aria-label="KPI badges">
          <div className="hh-kpi-label">Badges earned</div>
          <div className="hh-kpi-value">2</div>
          <div className="hh-muted">Next badge: “Neon Nova”.</div>
        </section>

        <section className="hh-card hh-panel hh-col-8" aria-label="Progress chart">
          <h2 className="hh-section-title">Weekly progress</h2>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.65)" />
                <YAxis stroke="rgba(255,255,255,0.65)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 15, 30, 0.95)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 12,
                    color: "rgba(255,255,255,0.92)"
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="hh-muted">
            Chart is demo data until habit/progress endpoints are implemented on the backend.
          </p>
        </section>

        <section className="hh-card hh-panel hh-col-4" aria-label="Activity feed">
          <h2 className="hh-section-title">Activity</h2>
          <div className="hh-muted">
            <div>• Completed “Drink Water”</div>
            <div>• Streak +1 on “Read 10 pages”</div>
            <div>• Shared an achievement</div>
          </div>
        </section>
      </div>
    </div>
  );
}
