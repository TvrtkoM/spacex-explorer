"use client";

const STORAGE_KEY = "spacex-favorites";
const CHANGE_EVENT = "spacex-favorites-change";

let cachedRaw: string | null = undefined as unknown as string | null;
let cachedSnapshot: string[] = [];

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (!raw) return (cachedSnapshot = []);
    const parsed: unknown = JSON.parse(raw);
    cachedSnapshot = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
    return cachedSnapshot;
  } catch {
    return (cachedSnapshot = []);
  }
}

function setFavorites(next: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addFavorite(id: string): void {
  const current = getFavorites();
  if (!current.includes(id)) {
    setFavorites([...current, id]);
  }
}

export function removeFavorite(id: string): void {
  setFavorites(getFavorites().filter((f) => f !== id));
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
