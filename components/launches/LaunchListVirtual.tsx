"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Launch } from "@/lib/types";
import LaunchCard from "./LaunchCard";
import { LaunchCardSkeleton } from "@/components/ui/Skeleton";

const CARD_HEIGHT = 152;
const CARD_GAP = 16;
const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP;

function getLanes(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

function useLanes(): number {
  return useSyncExternalStore(
    subscribe,
    () => getLanes(window.innerWidth),
    () => 1,
  );
}

interface LaunchListVirtualProps {
  launches: Launch[];
  onEndReached?: () => void;
  hasMore?: boolean;
  isFetching?: boolean;
  isLoading?: boolean;
}

export default function LaunchListVirtual({
  launches,
  onEndReached,
  hasMore = false,
  isFetching = false,
  isLoading = false,
}: LaunchListVirtualProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const lanes = useLanes();
  const rowCount = Math.ceil(launches.length / lanes);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => gridRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!onEndReached) return;
    const lastVirtualItem = virtualItems.at(-1);
    if (!lastVirtualItem) return;
    if (lastVirtualItem.index >= rowCount - 1 && hasMore && !isFetching) {
      onEndReached();
    }
  }, [virtualItems, rowCount, hasMore, isFetching, onEndReached]);

  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      ref={gridRef}
      className="h-[calc(100vh-500px)] overflow-y-auto"
      aria-label="Launches"
    >
      {isLoading && launches.length === 0 ? (
        <div
          role="status"
          aria-label="Loading launches"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <LaunchCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div style={{ height: (isFetching && hasMore ? ROW_HEIGHT + totalSize : 0) }} className="relative">
          {virtualItems.map((row) => {
            const startIndex = row.index * lanes;
            const rowLaunches = launches.slice(startIndex, startIndex + lanes);

            return (
              <div
                key={row.key}
                className="absolute inset-x-0 grid pb-4"
                style={{
                  top: row.start,
                  gridTemplateColumns: `repeat(${lanes}, minmax(0, 1fr))`,
                  gap: CARD_GAP,
                }}
              >
                {rowLaunches.map((launch) => (
                  <LaunchCard key={launch.id} launch={launch} />
                ))}
              </div>
            );
          })}
          {isFetching && hasMore && (
            <div
              className="absolute inset-x-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              style={{ top: totalSize }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <LaunchCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
