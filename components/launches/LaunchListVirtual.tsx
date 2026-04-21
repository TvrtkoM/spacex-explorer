"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Launch } from "@/lib/types";
import LaunchCard from "./LaunchCard";
import { LaunchCardSkeleton } from "@/components/ui/Skeleton";
import { useIsHydrated } from "@/lib/useIsHydrated";

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
    () => 1
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
  isLoading = false
}: LaunchListVirtualProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const lanes = useLanes();
  const rowCount = Math.ceil(launches.length / lanes);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (gridRef.current && isHydrated) {
      setScrollMargin(gridRef.current.offsetTop);
    }
  }, [isHydrated]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3,
    scrollMargin
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
        <div className="relative">
          {!isHydrated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {launches.map((launch) => (
                <LaunchCard key={launch.id} launch={launch} />
              ))}
            </div>
          ) : (
            virtualItems.map((row) => {
              const startIndex = row.index * lanes;
              const rowLaunches = launches.slice(
                startIndex,
                startIndex + lanes
              );

              return (
                <div
                  key={row.key}
                  className="absolute inset-x-0 grid pb-4"
                  style={{
                    top: row.start - scrollMargin,
                    gridTemplateColumns: `repeat(${lanes}, minmax(0, 1fr))`,
                    gap: CARD_GAP
                  }}
                >
                  {rowLaunches.map((launch) => (
                    <LaunchCard key={launch.id} launch={launch} />
                  ))}
                </div>
              );
            })
          )}
          {isFetching && hasMore && (
            <div
              className="absolute inset-x-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              style={{ top: totalSize }}
            >
              {Array.from({ length: lanes }).map((_, i) => (
                <LaunchCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
