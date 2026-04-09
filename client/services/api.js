// ─── API base URL from env (falls back to localhost for safety) ────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "" : "http://localhost:5000");

// ─── Numeric field keys per category ─────────────────────────────────────────
const NUMERIC_FIELDS = {
  planner:   ["budget", "guestCount"],
  performer: ["duration"],
  crew:      ["numberOfPeople", "shiftDuration"],
};

/**
 * Coerce number-typed fields from string → Number before sending.
 * HTML <input type="number"> always gives us strings via e.target.value.
 */
function coerceDetails(category, details) {
  if (!details || !category) return details;
  const numericKeys = NUMERIC_FIELDS[category] ?? [];
  const coerced = { ...details };
  for (const key of numericKeys) {
    const raw = coerced[key];
    if (raw !== "" && raw !== undefined && raw !== null) {
      const parsed = Number(raw);
      coerced[key] = isNaN(parsed) ? raw : parsed;
    }
  }
  return coerced;
}

/**
 * Transforms the flat form state into the exact shape expected by the backend:
 * {
 *   eventName, eventType, date: { start, end? },
 *   location, venue?, category,
 *   details: { [category]: { ...fields } }
 * }
 */
export function buildPayload(formData) {
  const { details, category, date, venue, ...rest } = formData;

  return {
    ...rest,
    ...(venue?.trim() ? { venue: venue.trim() } : {}),
    category,
    date: {
      start: date.start,
      ...(date.end ? { end: date.end } : {}),
    },
    details: {
      [category]: coerceDetails(category, details[category]),
    },
  };
}

/**
 * POST /api/requirements
 * Returns { success, data } on 2xx, throws Error with .message on failure.
 */
export async function submitRequirement(formData) {
  const payload = buildPayload(formData);

  let res;
  try {
    res = await fetch(`${API_BASE}/api/requirements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network-level failure (server down, CORS preflight failure, etc.)
    throw new Error(
      "Cannot reach the server. Make sure the backend is running on port 5000."
    );
  }

  const json = await res.json();

  if (!res.ok) {
    // Surface the most helpful message from the backend
    const msg =
      json.errors
        ? json.errors.map((e) => `${e.field}: ${e.message}`).join(" · ")
        : json.message || `Server error ${res.status}`;
    throw new Error(msg);
  }

  return json; // { success: true, message, data }
}
