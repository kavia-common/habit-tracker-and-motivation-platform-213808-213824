import React from "react";

// PUBLIC_INTERFACE
export function PlaceholderPage({ title, description }) {
  /** Simple placeholder page for sections not yet implemented. */
  return (
    <div className="hh-card hh-panel">
      <h2 className="hh-section-title">{title}</h2>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{description}</div>
      <div className="hh-muted">
        This section will be wired to backend endpoints in the next steps (habits, groups, badges, and social feed).
      </div>
    </div>
  );
}
