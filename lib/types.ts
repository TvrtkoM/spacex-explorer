// SpaceX API v4 Types

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: "half" | "quarter" | "year" | "month" | "day" | "hour";
  upcoming: boolean;
  success: boolean | null;
  details: string | null;
  flight_number: number;
  rocket: string; // rocket id
  launchpad: string; // launchpad id
  payloads: string[];
  cores: LaunchCore[];
  crew: string[];
  ships: string[];
  capsules: string[];
  links: LaunchLinks;
  failures: LaunchFailure[];
  auto_update: boolean;
  tbd: boolean;
  net: boolean;
  window: number | null;
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
}

export interface LaunchLinks {
  patch: {
    small: string | null;
    large: string | null;
  };
  reddit: {
    campaign: string | null;
    launch: string | null;
    media: string | null;
    recovery: string | null;
  };
  flickr: {
    small: string[];
    original: string[];
  };
  presskit: string | null;
  webcast: string | null;
  youtube_id: string | null;
  article: string | null;
  wikipedia: string | null;
}

export interface LaunchFailure {
  time: number;
  altitude: number | null;
  reason: string;
}

export interface LaunchCore {
  core: string | null;
  flight: number | null;
  gridfins: boolean | null;
  legs: boolean | null;
  reused: boolean | null;
  landing_attempt: boolean | null;
  landing_success: boolean | null;
  landing_type: string | null;
  landpad: string | null;
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: { meters: number; feet: number };
  diameter: { meters: number; feet: number };
  mass: { kg: number; lb: number };
  description: string;
  wikipedia: string;
  flickr_images: string[];
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  status: "active" | "inactive" | "unknown" | "retired" | "lost" | "under construction";
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[];
  launches: string[];
  details: string;
  images: {
    large: string[];
  };
}

// API query types
export interface LaunchQuery {
  query?: Record<string, unknown>;
  options?: QueryOptions;
}

export interface QueryOptions {
  select?: string | Record<string, number>;
  sort?: Record<string, "asc" | "desc" | 1 | -1>;
  page?: number;
  limit?: number;
  pagination?: boolean;
  populate?: string[] | PopulateOption[];
  offset?: number;
}

export interface PopulateOption {
  path: string;
  select?: Record<string, number>;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Filter / UI types
export type LaunchStatusFilter = "all" | "upcoming" | "past";
export type LaunchSuccessFilter = "all" | "success" | "failure";
export type SortField = "date_utc" | "name" | "flight_number";
export type SortDirection = "asc" | "desc";

export interface LaunchFilters {
  status: LaunchStatusFilter;
  success: LaunchSuccessFilter;
  search: string;
  dateFrom: string;
  dateTo: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
