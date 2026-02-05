import React, { useCallback, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { getHealth } from "./api/client";
import { useAsync } from "./hooks/useAsync";

import { AppShell } from "./components/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

// PUBLIC_INTERFACE
function App() {
  /** Main application entry component. */
  const healthCall = useAsync(getHealth, [], { immediate: true });

  const backendStatus = useMemo(() => {
    if (healthCall.isLoading || healthCall.isIdle) return { ok: false, state: "connecting" };
    if (healthCall.isError) return { ok: false, state: "error", error: healthCall.error };
    return { ok: true, state: "ok", value: healthCall.value };
  }, [healthCall.isLoading, healthCall.isIdle, healthCall.isError, healthCall.error, healthCall.value]);

  const retryBackend = useCallback(() => {
    healthCall.execute();
  }, [healthCall]);

  return (
    <BrowserRouter>
      <AppShell backendStatus={backendStatus} onRetryBackend={retryBackend}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/habits"
            element={<PlaceholderPage title="Habits" description="Create, schedule, and track habits." />}
          />
          <Route
            path="/groups"
            element={<PlaceholderPage title="Groups" description="Accountability groups & shared challenges." />}
          />
          <Route
            path="/achievements"
            element={<PlaceholderPage title="Achievements" description="Badges, rewards, and shareable milestones." />}
          />
          <Route
            path="/activity"
            element={<PlaceholderPage title="Activity" description="Friend feed and community highlights." />}
          />
          <Route
            path="*"
            element={<PlaceholderPage title="Not found" description="This route does not exist (yet)." />}
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
