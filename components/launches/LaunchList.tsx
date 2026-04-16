"use client";

import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { LaunchFilters, LaunchStatusFilter, LaunchSuccessFilter, SortField, SortDirection } from "@/lib/types";
import LaunchFiltersPanel from "./LaunchFilters";
import LaunchListVirtual from "./LaunchListVirtual";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { useQueryStates, parseAsString, parseAsStringLiteral } from "nuqs";

const DEFAULT_FILTERS: LaunchFilters = {
  status: "all",
  success: "all",
  search: "",
  dateFrom: "",
  dateTo: "",
  sortField: "date_utc",
  sortDirection: "desc",
};

const filterParsers = {
  status: parseAsStringLiteral(["all", "upcoming", "past"] as const).withDefault("all" as LaunchStatusFilter),
  success: parseAsStringLiteral(["all", "success", "failure"] as const).withDefault("all" as LaunchSuccessFilter),
  search: parseAsString.withDefault(""),
  dateFrom: parseAsString.withDefault(""),
  dateTo: parseAsString.withDefault(""),
  sortField: parseAsStringLiteral(["date_utc", "name", "flight_number"] as const).withDefault("date_utc" as SortField),
  sortDirection: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc" as SortDirection),
};

export default function LaunchList() {
  const [filters, setFilters] = useQueryStates(filterParsers, { history: "push" });

  const fetch = ({ pageParam }: { pageParam: unknown }) => {
    if (typeof pageParam === 'string' || typeof pageParam === 'number') {
      return fetchLaunches(filters, +pageParam)
    }
  }

  const { data, fetchNextPage, isFetching, isError, error, refetch, hasNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? null
    },
    queryKey: queryKeys.launches(filters),
    queryFn: fetch,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const handleFiltersChange = (newFilters: LaunchFilters) => {
    setFilters(newFilters);
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
      <LaunchFiltersPanel filters={filters} onChange={handleFiltersChange} />

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
