// Time and duration helpers. Times are stored as "HH:mm" (24h); durations as whole minutes.

const HHMM = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(value: string): boolean {
  return HHMM.test(value.trim());
}

/** "HH:mm" -> minutes since midnight, or null if invalid/empty. */
export function timeToMinutes(value: string): number | null {
  if (!value) return null;
  const m = value.trim().match(HHMM);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/**
 * Duration between two "HH:mm" times, in minutes.
 * Same-day assumption; if the end is before the start it is treated as crossing midnight.
 */
export function durationMinutes(inicio: string, fim: string): number | null {
  const a = timeToMinutes(inicio);
  const b = timeToMinutes(fim);
  if (a === null || b === null) return null;
  let d = b - a;
  if (d < 0) d += 24 * 60;
  return d;
}

/** minutes -> "H:mm" (hours can exceed 23 for totals). */
export function formatDuration(min: number | null | undefined): string {
  if (min === null || min === undefined || Number.isNaN(min)) return '';
  const sign = min < 0 ? '-' : '';
  const abs = Math.abs(Math.round(min));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}:${String(m).padStart(2, '0')}`;
}

/** "H:mm" or plain minutes string -> minutes, or null. */
export function parseDuration(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  if (v.includes(':')) {
    const parts = v.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  }
  const n = Number(v);
  return Number.isNaN(n) ? null : Math.round(n);
}

/** minutes -> Excel time serial (fraction of a day). */
export function minutesToExcelSerial(min: number): number {
  return min / (24 * 60);
}
