import type { LaunchFilters } from "./types";

export const DEFAULT_FILTERS: LaunchFilters = {
  status: "all",
  success: "all",
  search: "",
  dateFrom: "",
  dateTo: "",
  sortField: "date_utc",
  sortDirection: "desc",
};
