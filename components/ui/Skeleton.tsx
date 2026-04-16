import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "animate-pulse rounded bg-zinc-800",
        className
      )}
    />
  );
}

export function LaunchCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-38 flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function LaunchDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading launch details" className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-zinc-800 p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
