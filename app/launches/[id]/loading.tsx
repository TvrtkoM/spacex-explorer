import { LaunchDetailSkeleton } from "@/components/ui/Skeleton";

export default function LaunchDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <LaunchDetailSkeleton />
    </main>
  );
}
