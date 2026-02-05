import React, { useCallback, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { getHealth } from "./api/client";
import { useAsync } from "./hooks/useAsync";

import { AppShell } from "./components/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { HabitsPage } from "./pages/HabitsPage";
import { GroupsPage } from "./pages/GroupsPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { ActivityPage } from "./pages/ActivityPage";
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
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
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
