/**
 * HabitHive API client (REST).
 * Uses fetch and a configurable base URL.
 */

const DEFAULT_BASE_URL = ""; // same-origin by default

function getApiBaseUrl() {
  /**
   * CRA exposes env vars prefixed with REACT_APP_.
   *
   * For this project we standardize on:
   *   - REACT_APP_BACKEND_URL
   *
   * Backwards compatibility:
   *   - REACT_APP_API_BASE_URL (older name)
   */
  const raw =
    process.env.REACT_APP_BACKEND_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    DEFAULT_BASE_URL;

  return String(raw).replace(/\/*$/, "");
}

async function parseJsonSafe(resp) {
  const text = await resp.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /**
   * Make a request to the HabitHive backend.
   * @param {string} path - Path starting with "/"
   * @param {RequestInit} options - fetch options
   * @returns {Promise<any>} parsed JSON (or text) body
   */
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  const resp = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {})
    }
  });

  const body = await parseJsonSafe(resp);

  if (!resp.ok) {
    const message =
      (body && typeof body === "object" && body.detail) ||
      (typeof body === "string" && body) ||
      `Request failed (${resp.status})`;
    const err = new Error(message);
    err.status = resp.status;
    err.body = body;
    throw err;
  }

  return body;
}

// PUBLIC_INTERFACE
export async function getHealth() {
  /** Fetch backend health. */
  return apiRequest("/", { method: "GET" });
}

/**
 * The current backend OpenAPI exposes only GET / (health check).
 * The helpers below are scaffolded so the frontend pages can be functional
 * (loading/error states) and will automatically work once the backend adds
 * these endpoints.
 */

// PUBLIC_INTERFACE
export async function listHabits() {
  /** List habits (scaffold; backend endpoint may be added later). */
  return apiRequest("/habits", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createHabit(payload) {
  /** Create habit (scaffold; backend endpoint may be added later). */
  return apiRequest("/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {})
  });
}

// PUBLIC_INTERFACE
export async function listGroups() {
  /** List groups (scaffold; backend endpoint may be added later). */
  return apiRequest("/groups", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function listAchievements() {
  /** List achievements/badges (scaffold; backend endpoint may be added later). */
  return apiRequest("/achievements", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function listActivityFeed() {
  /** List activity feed (scaffold; backend endpoint may be added later). */
  return apiRequest("/activity", { method: "GET" });
}
