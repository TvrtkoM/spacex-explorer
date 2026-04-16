import {
  parseAsString,
  parseAsStringLiteral,
  createSearchParamsCache,
} from "nuqs/server";
import type { LaunchStatusFilter, LaunchSuccessFilter, SortField, SortDirection } from "./types";

export const filterParsers = {
  status: parseAsStringLiteral(["all", "upcoming", "past"] as const).withDefault("all" as LaunchStatusFilter),
  success: parseAsStringLiteral(["all", "success", "failure"] as const).withDefault("all" as LaunchSuccessFilter),
  search: parseAsString.withDefault(""),
  dateFrom: parseAsString.withDefault(""),
  dateTo: parseAsString.withDefault(""),
  sortField: parseAsStringLiteral(["date_utc", "name", "flight_number"] as const).withDefault("date_utc" as SortField),
  sortDirection: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc" as SortDirection),
};

export const searchParamsCache = createSearchParamsCache(filterParsers);
