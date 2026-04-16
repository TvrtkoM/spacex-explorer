"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  subscribe,
} from "@/lib/favorites";

interface FavoritesContextValue {
  favorites: string[];
  hydrated: boolean;
  toggleFavorite: (id: string) => void;
  isFav: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useSyncExternalStore(
    subscribe,
    getFavorites,
    () => null,
  );

  const hydrated = favorites !== null;
  const favList = useMemo(() => favorites ?? [], [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }, []);

  const isFav = useCallback(
    (id: string) => favList.includes(id),
    [favList]
  );

  return (
    <FavoritesContext.Provider value={{ favorites: favList, hydrated, toggleFavorite, isFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
