"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { LaunchFilters } from "@/lib/types";
import LaunchFiltersPanel from "./LaunchFilters";
import LaunchListVirtual from "./LaunchListVirtual";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { useQueryStates } from "nuqs";
import { DEFAULT_FILTERS } from "@/lib/defaultFilters";
import { filterParsers } from "@/lib/filterParsers";

export default function LaunchList() {
  const [filters, setFilters] = useQueryStates(filterParsers, { history: "push" });
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const activeFilters = { ...filters, search: debouncedSearch };

  const fetch = ({ pageParam }: { pageParam: unknown }) => {
    if (typeof pageParam === 'string' || typeof pageParam === 'number') {
      return fetchLaunches(activeFilters, +pageParam)
    }
  }

  const { data, fetchNextPage, isFetching, isError, error, refetch, hasNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? null
    },
    queryKey: queryKeys.launches(activeFilters),
    queryFn: fetch,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const handleFiltersChange = (newFilters: LaunchFilters) => {
    setFilters(newFilters);
    setSearchInput(newFilters.search);
    refetch();
  }

  const allPages = useMemo(() => data?.pages ?? [], [data?.pages]);
  const allLaunches = allPages.flatMap((page) => page?.docs ?? []);
  const hasResults = allLaunches.length > 0;

  const isFirstLoad = isFetching && allLaunches.length === 0;

  const lastPage = [...allPages].pop();
  const totalDocs = lastPage?.totalDocs ?? 0;

  return (
    <div className="space-y-6">
      <LaunchFiltersPanel
        filters={filters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onChange={handleFiltersChange}
      />

      {totalDocs > 0 && !isFirstLoad && (
        <p className="text-sm text-zinc-500">
          {totalDocs.toLocaleString()} launch
          {totalDocs !== 1 ? "es" : ""} found
        </p>
      )}

      {isError && !hasResults && (
        <ErrorState
          message={
            error instanceof Error ? error.message : "Failed to load launches."
          }
          onRetry={() => refetch()}
        />
      )}

      {!isFirstLoad && !isError && hasResults === false && (
        <EmptyState
          title="No launches found"
          description="Try adjusting your filters or search terms."
          action={
            <button
              onClick={() => handleFiltersChange(DEFAULT_FILTERS)}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Clear all filters
            </button>
          }
        />
      )}

      <LaunchListVirtual
        launches={allLaunches}
        onEndReached={fetchNextPage}
        hasMore={hasNextPage}
        isFetching={isFetching}
        isLoading={isFirstLoad}
      />
    </div>
  );
}
