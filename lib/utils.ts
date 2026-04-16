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

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
