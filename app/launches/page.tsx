import type { Metadata } from "next";
import LaunchList from "@/components/launches/LaunchList";

export const metadata: Metadata = {
  title: "Launches — SpaceX Explorer",
  description:
    "Browse all SpaceX launches. Filter by status, success, date range, and more.",
};

export default function LaunchesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Launches
        </h1>
        <p className="mt-2 text-zinc-400">
          Explore all SpaceX missions, past and upcoming.
        </p>
      </div>

      <LaunchList />
    </main>
  );
}
