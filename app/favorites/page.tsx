import type { Metadata } from "next";
import FavoritesList from "@/components/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "Favorites — SpaceX Explorer",
  description: "Your bookmarked SpaceX launches.",
};

export default function FavoritesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Favorites
        </h1>
        <p className="mt-2 text-zinc-400">
          Launches you&apos;ve saved for quick access.
        </p>
      </div>
      <FavoritesList />
    </main>
  );
}
