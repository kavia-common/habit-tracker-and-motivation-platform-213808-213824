/**
 * HabitHive API client (REST).
 * Uses fetch and a configurable base URL.
 */

const DEFAULT_BASE_URL = ""; // same-origin by default

function getApiBaseUrl() {
  // CRA exposes env vars prefixed with REACT_APP_
  return (process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
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
