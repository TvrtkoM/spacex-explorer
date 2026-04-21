"use client";

import React, { useCallback } from "react";
import { ChevronDown, Search } from "lucide-react";
import clsx from "clsx";
import type {
  LaunchFilters as Filters,
  LaunchStatusFilter,
  LaunchSuccessFilter,
  SortField,
  SortDirection,
} from "@/lib/types";
import { useIsHydrated } from "@/lib/useIsHydrated";

interface LaunchFiltersProps {
  filters: Filters;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onChange: (filters: Filters) => void;
}

function inputClass(extra?: string) {
  return clsx(
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 transition-colors",
    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
    extra
  );
}

function selectClass(extra?: string) {
  return inputClass(clsx("appearance-none pr-7", extra));
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" strokeWidth={1.5} />
    </div>
  );
}

export default function LaunchFiltersPanel({
  filters,
  searchValue,
  onSearchChange,
  onChange,
}: LaunchFiltersProps) {
  const isHydrated = useIsHydrated();
  const update = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      onChange({ ...filters, [key]: value });
    },
    [filters, onChange]
  );

  const resetFilters = () => {
    onChange({
      status: "all",
      success: "all",
      search: "",
      dateFrom: "",
      dateTo: "",
      sortField: "date_utc",
      sortDirection: "desc",
    });
  };

  const isFiltered =
    filters.status !== "all" ||
    filters.success !== "all" ||
    searchValue !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <section aria-label="Launch filters" className="space-y-4">
      <div>
        <label htmlFor="search" className="sr-only">
          Search missions
        </label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" strokeWidth={2} />
          <input
            id="search"
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search missions…"
            className={inputClass("w-full pl-9")}
            disabled={!isHydrated}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="status-filter" className="text-xs font-medium text-zinc-400">
            Status
          </label>
          <SelectWrapper>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) =>
                update("status", e.target.value as LaunchStatusFilter)
              }
              className={selectClass()}
              disabled={!isHydrated}
            >
              <option value="all">All launches</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </SelectWrapper>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="success-filter" className="text-xs font-medium text-zinc-400">
            Result
          </label>
          <SelectWrapper>
            <select
              id="success-filter"
              value={filters.success}
              onChange={(e) =>
                update("success", e.target.value as LaunchSuccessFilter)
              }
              className={selectClass()}
              disabled={!isHydrated}
            >
              <option value="all">All results</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </SelectWrapper>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sort-field" className="text-xs font-medium text-zinc-400">
            Sort by
          </label>
          <SelectWrapper>
            <select
              id="sort-field"
              value={filters.sortField}
              onChange={(e) => update("sortField", e.target.value as SortField)}
              className={selectClass()}
              disabled={!isHydrated}
            >
              <option value="date_utc">Date</option>
              <option value="name">Name</option>
              <option value="flight_number">Flight #</option>
            </select>
          </SelectWrapper>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sort-dir" className="text-xs font-medium text-zinc-400">
            Order
          </label>
          <SelectWrapper>
            <select
              id="sort-dir"
              value={filters.sortDirection}
              onChange={(e) =>
                update("sortDirection", e.target.value as SortDirection)
              }
              className={selectClass()}
              disabled={!isHydrated}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </SelectWrapper>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="date-from" className="text-xs font-medium text-zinc-400">
            From
          </label>
          <input
            id="date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update("dateFrom", e.target.value)}
            className={inputClass()}
            disabled={!isHydrated}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="date-to" className="text-xs font-medium text-zinc-400">
            To
          </label>
          <input
            id="date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => update("dateTo", e.target.value)}
            className={inputClass()}
            disabled={!isHydrated}
          />
        </div>

        {isFiltered && (
          <div className="flex flex-col justify-end">
            <button
              onClick={resetFilters}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
