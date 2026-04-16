"use client";

import { useQueries } from "@tanstack/react-query";
import { fetchLaunchById } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useFavorites } from "@/context/FavoritesContext";
import LaunchListVirtual from "@/components/launches/LaunchListVirtual";
import { LaunchCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

export default function FavoritesList() {
  const { favorites, hydrated } = useFavorites();

  const results = useQueries({
    queries: favorites.map((id) => ({
      queryKey: queryKeys.launch(id),
      queryFn: () => fetchLaunchById(id),
      staleTime: 60 * 1000,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  if (!hydrated) return null;

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Bookmark launches to save them here."
        action={
          <Link
            href="/launches"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Browse launches
          </Link>
        }
      />
    );
  }

  const launches = results
    .filter((r) => r.data !== undefined)
    .map((r) => r.data!);

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        {favorites.length} saved launch{favorites.length !== 1 ? "es" : ""}
      </p>
      {isLoading && launches.length === 0 ? (
        <div
          role="status"
          aria-label="Loading launches"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <LaunchCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <LaunchListVirtual launches={launches} />
      )}
    </div>
  );
}
