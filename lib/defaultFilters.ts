import type { LaunchFilters } from "./types";

/**
 * Default filter values used when no query parameters are present.
 *
 * Shows all launches sorted by launch date descending, with no text search
 * or date range constraints applied.
 */
export const DEFAULT_FILTERS: LaunchFilters = {
  status: "all",
  success: "all",
  search: "",
  dateFrom: "",
  dateTo: "",
  sortField: "date_utc",
  sortDirection: "desc",
};
