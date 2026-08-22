/**
 * Format a number of minutes (0-1440) into "HH:mm" clock format.
 * Negative values and values >= 1440 are clamped.
 */
export function minutesToClock(minutes: number): string {
  const clamped = Math.max(0, Math.min(1440, Math.floor(minutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Parse an "HH:mm" string into minutes-from-midnight. Returns null on invalid.
 */
export function clockToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 24 || m < 0 || m >= 60) return null;
  if (h === 24 && m !== 0) return null;
  return h * 60 + m;
}

/**
 * Pretty-print a duration given start and end "HH:mm" strings.
 * Returns "—" for invalid input.
 */
export function formatClockRange(start: string, end: string): string {
  const s = clockToMinutes(start);
  const e = clockToMinutes(end);
  if (s === null || e === null || e <= s) return "—";
  const minutes = e - s;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/**
 * Build an ISO-8601 string in UTC for a calendar date + clock time entered
 * by the user in **local time** (the time picked from `<input type="time">`).
 *
 * Why this exists: the backend stores everything as timestamptz (UTC). When a
 * user picks "Friday Aug 28, 12:00" in Bogotá they mean 12:00 America/Bogota,
 * which is 17:00 UTC. Naively concatenating `${date}T${clock}:00.000Z` would
 * silently treat "12:00" as UTC, shifting the event by the local offset.
 *
 * Implementation: build a Date in **local** time using `new Date(y, m, d, h, mi)`
 * (constructor with numeric args uses local time), then convert to UTC ISO.
 */
export function localDateTimeToUtcIso(
  date: string, // "YYYY-MM-DD"
  clock: string, // "HH:mm"
): string | null {
  const [y, m, d] = date.split("-").map(Number);
  const minutes = clockToMinutes(clock);
  if (!y || !m || !d || minutes === null) return null;
  const h = Math.floor(minutes / 60);
  const mi = minutes % 60;
  // new Date(y, mIdx, d, h, mi) interprets args as **local** time.
  // JS months are 0-indexed.
  const local = new Date(y, m - 1, d, h, mi, 0, 0);
  if (Number.isNaN(local.getTime())) return null;
  return local.toISOString();
}

export const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
] as const;