import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/api";
import { makeQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { searchParamsCache } from "@/lib/filterParsers";
import LaunchList from "@/components/launches/LaunchList";
import { LaunchCardSkeleton } from "@/components/ui/Skeleton";
import type { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Launches — SpaceX Explorer",
  description:
    "Browse all SpaceX launches. Filter by status, success, date range, and more.",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

// Separated async component so the page shell renders before this suspends.
async function PrefetchedLaunchList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParamsCache.parse(searchParams);

  const queryClient = makeQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.launches(filters),
    queryFn: ({ pageParam }) => fetchLaunches(filters, pageParam),
    initialPageParam: 1,
    pages: 1,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage ?? null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LaunchList />
    </HydrationBoundary>
  );
}

function LaunchListFallback() {
  return (
    <div
      role="status"
      aria-label="Loading launches"
      className="space-y-6"
    >
      <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <LaunchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function LaunchesPage({ searchParams }: PageProps) {
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

      {/* <Suspense fallback={<LaunchListFallback />}> */}
        <PrefetchedLaunchList searchParams={searchParams} />
      {/* </Suspense> */}
    </main>
  );
}
