import {
  parseAsString,
  parseAsStringLiteral,
  createSearchParamsCache,
} from "nuqs/server";
import type { LaunchStatusFilter, LaunchSuccessFilter, SortField, SortDirection } from "./types";

/**
 * nuqs parser definitions for all launch filter URL search parameters.
 *
 * Each entry maps a `LaunchFilters` key to a typed nuqs parser with a safe
 * default, ensuring the application always has a valid filter state even when
 * query parameters are absent or malformed.
 */
export const filterParsers = {
  /** Parses the `status` search param as a {@link LaunchStatusFilter}. Defaults to `"all"`. */
  status: parseAsStringLiteral(["all", "upcoming", "past"] as const).withDefault("all" as LaunchStatusFilter),
  /** Parses the `success` search param as a {@link LaunchSuccessFilter}. Defaults to `"all"`. */
  success: parseAsStringLiteral(["all", "success", "failure"] as const).withDefault("all" as LaunchSuccessFilter),
  /** Parses the `search` search param as a plain string. Defaults to `""`. */
  search: parseAsString.withDefault(""),
  /** Parses the `dateFrom` search param as a plain string. Defaults to `""`. */
  dateFrom: parseAsString.withDefault(""),
  /** Parses the `dateTo` search param as a plain string. Defaults to `""`. */
  dateTo: parseAsString.withDefault(""),
  /** Parses the `sortField` search param as a {@link SortField}. Defaults to `"date_utc"`. */
  sortField: parseAsStringLiteral(["date_utc", "name", "flight_number"] as const).withDefault("date_utc" as SortField),
  /** Parses the `sortDirection` search param as a {@link SortDirection}. Defaults to `"desc"`. */
  sortDirection: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc" as SortDirection),
};

/**
 * Server-side nuqs cache built from {@link filterParsers}.
 *
 * Use this in React Server Components to read the current filter values from
 * the incoming `searchParams` without parsing them manually.
 */
export const searchParamsCache = createSearchParamsCache(filterParsers);
