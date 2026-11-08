/**
 * Local-time date helpers.
 *
 * The backend works in `America/Bogota` (see `TZ` in the Dockerfile and
 * render.yaml) and returns every instant as a UTC ISO string. Comparing
 * those instants against `Date.prototype.toISOString()` (UTC) shifts the
 * "current day" by the UTC offset: after 19:00 in Bogotá, `toISOString()`
 * already points at the next day, which silently hides the appointments of
 * the current evening.
 *
 * These helpers work with the **local** calendar day of the browser, which
 * is what the user sees on a date picker and on an agenda row.
 */

/** Returns today's calendar date as `YYYY-MM-DD` in local time. */
export function todayLocalISODate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Converts an ISO instant into the calendar date (`YYYY-MM-DD`) it falls on
 * in local time.
 */
export function toLocalISODate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns the `YYYY-MM-DD` date that is `days` away from `baseISO`
 * (negative = past). Days are calendar days, not 24h chunks.
 */
export function shiftISODate(baseISO: string, days: number): string {
  const d = new Date(`${baseISO}T00:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
