/**
 * Formats a date string into a human-readable representation using the en-US locale.
 *
 * @param dateString - An ISO 8601 date string, or `null`/`undefined`.
 * @param options - `Intl.DateTimeFormatOptions` to control the output format.
 *   Defaults to `{ year: "numeric", month: "short", day: "numeric" }`.
 * @returns The formatted date string, `"TBD"` when the input is falsy, or
 *   `"Invalid date"` when parsing fails.
 */
export function formatDate(
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!dateString) return "TBD";
  try {
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  } catch {
    return "Invalid date";
  }
}

/**
 * Formats a number using en-US locale conventions (e.g. thousands separators).
 *
 * @param n - The number to format.
 * @returns The formatted number string.
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Clamps a value to the inclusive range `[min, max]`.
 *
 * @param value - The number to clamp.
 * @param min - The lower bound (inclusive).
 * @param max - The upper bound (inclusive).
 * @returns `min` if `value < min`, `max` if `value > max`, otherwise `value`.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
