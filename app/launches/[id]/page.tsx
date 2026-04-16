import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchLaunchById } from "@/lib/api";
import LaunchDetailClient from "@/components/launches/LaunchDetailClient";
import ErrorState from "@/components/ui/ErrorState";

interface PageProps {
  params: Promise<{ id: string }>;
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

  return <LaunchDetailClient launch={launch} />;
}

export default async function LaunchDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <LaunchDetailServer id={id} />
    </main>
  );
}
