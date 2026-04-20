"use client";

const STORAGE_KEY = "spacex-favorites";
const CHANGE_EVENT = "spacex-favorites-change";

let cachedRaw: string | null = null;
let cachedSnapshot: string[] = [];

/**
 * Returns the current list of favorited launch IDs from `localStorage`.
 *
 * Results are memoized: the array is only re-parsed when the raw
 * `localStorage` value has changed since the last call.
 *
 * @returns An array of launch ID strings. Returns an empty array when called
 *   outside the browser or when the stored value cannot be parsed.
 */
export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (!raw) return (cachedSnapshot = []);
    const parsed: unknown = JSON.parse(raw);
    cachedSnapshot = Array.isArray(parsed)
      ? parsed.filter((x) => typeof x === "string")
      : [];
    return cachedSnapshot;
  } catch {
    return (cachedSnapshot = []);
  }
}

/**
 * Persists the given array of favorite IDs to `localStorage` and dispatches
 * a `spacex-favorites-change` event so all subscribers are notified.
 *
 * @param next - The new complete list of favorite launch IDs.
 */
function setFavorites(next: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Adds a launch ID to the favorites list.
 *
 * No-ops if the ID is already present.
 *
 * @param id - The launch ID to add.
 */
export function addFavorite(id: string): void {
  const current = getFavorites();
  if (!current.includes(id)) {
    setFavorites([...current, id]);
  }
}

/**
 * Removes a launch ID from the favorites list.
 *
 * No-ops if the ID is not present.
 *
 * @param id - The launch ID to remove.
 */
export function removeFavorite(id: string): void {
  setFavorites(getFavorites().filter((f) => f !== id));
}

/**
 * Returns whether a given launch ID is currently in the favorites list.
 *
 * @param id - The launch ID to check.
 * @returns `true` if the launch is a favorite, `false` otherwise.
 */
export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

/**
 * Subscribes to favorites changes, including changes made in other browser tabs.
 *
 * Listens for both the custom `spacex-favorites-change` event (same-tab
 * mutations) and the native `storage` event (cross-tab mutations).
 *
 * @param callback - Function invoked whenever the favorites list changes.
 * @returns A cleanup function that removes the event listeners.
 */
export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
