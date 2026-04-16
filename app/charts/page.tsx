import type { Metadata } from "next";
import LaunchesChart from "@/components/charts/LaunchesChart";

export const metadata: Metadata = {
  title: "Launch Statistics – SpaceX Explorer",
  description: "Visualize SpaceX launch success and failure rates by year.",
};

export default function ChartsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Launch Statistics</h1>
        <p className="text-sm text-zinc-400">
          Successful and failed launches per year. Toggle between line and bar chart, and filter by year range.
        </p>
      </div>
      <LaunchesChart />
    </main>
  );
}
