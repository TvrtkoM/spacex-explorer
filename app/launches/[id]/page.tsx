import LaunchDetailClient from "@/components/launches/LaunchDetailClient";
import ErrorState from "@/components/ui/ErrorState";
import { fetchLaunchById, fetchLaunches, fetchLaunchpadById, fetchRocketById } from "@/lib/api";
import { DEFAULT_FILTERS } from "@/lib/defaultFilters";
import { getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// ISR: revalidate detail pages every 5 minutes
export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Pre-build the most recent 48 launches at build time
  const data = await fetchLaunches(DEFAULT_FILTERS, 1);
  return data.docs.map((launch) => ({ id: launch.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const launch = await fetchLaunchById(id);
    return {
      title: `${launch.name} — SpaceX Explorer`,
      description: launch.details ?? `SpaceX ${launch.name} mission details.`,
    };
  } catch {
    return {
      title: "Launch — SpaceX Explorer",
    };
  }
}

async function LaunchDetailServer({ id }: { id: string }) {
  let launch;
  try {
    launch = await fetchLaunchById(id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("404")) notFound();
    return (
      <ErrorState
        message="Failed to load launch details. Please refresh the page."
      />
    );
  }

  if (!launch) notFound();

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.rocket(launch.rocket),
      queryFn: () => fetchRocketById(launch.rocket),
      staleTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.launchpad(launch.launchpad),
      queryFn: () => fetchLaunchpadById(launch.launchpad),
      staleTime: 10 * 60 * 1000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LaunchDetailClient launch={launch} />
    </HydrationBoundary>
  );
}

export default async function LaunchDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <LaunchDetailServer id={id} />
    </main>
  );
}
