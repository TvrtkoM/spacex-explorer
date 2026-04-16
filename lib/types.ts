// SpaceX API v4 Types

/** A SpaceX launch record as returned by the SpaceX API v4. */
export interface Launch {
  /** Unique launch identifier. */
  id: string;
  /** Human-readable launch name. */
  name: string;
  /** Launch date in UTC ISO 8601 format. */
  date_utc: string;
  /** Launch date as a Unix timestamp (seconds). */
  date_unix: number;
  /** Launch date in local time ISO 8601 format. */
  date_local: string;
  /** Precision of the scheduled launch date. */
  date_precision: "half" | "quarter" | "year" | "month" | "day" | "hour";
  /** Whether the launch has not yet occurred. */
  upcoming: boolean;
  /** Whether the launch succeeded. `null` if not yet determined. */
  success: boolean | null;
  /** Human-readable description of the launch. `null` if unavailable. */
  details: string | null;
  /** Sequential SpaceX flight number. */
  flight_number: number;
  /** ID of the rocket used for this launch. */
  rocket: string;
  /** ID of the launchpad used for this launch. */
  launchpad: string;
  /** IDs of the payloads carried on this launch. */
  payloads: string[];
  /** Details about each booster core used. */
  cores: LaunchCore[];
  /** IDs of crew members aboard. */
  crew: string[];
  /** IDs of ships involved in the launch. */
  ships: string[];
  /** IDs of capsules used. */
  capsules: string[];
  /** Media and external links related to the launch. */
  links: LaunchLinks;
  /** List of failure events during the launch, if any. */
  failures: LaunchFailure[];
  /** Whether the launch entry is automatically updated. */
  auto_update: boolean;
  /** Whether the launch date is "to be determined". */
  tbd: boolean;
  /** Whether the launch is "no earlier than" (NET). */
  net: boolean;
  /** Launch window duration in seconds. `null` if unknown. */
  window: number | null;
  /** Date of static fire test in UTC ISO 8601 format. `null` if not performed. */
  static_fire_date_utc: string | null;
  /** Date of static fire test as a Unix timestamp. `null` if not performed. */
  static_fire_date_unix: number | null;
}

/** Media and external reference links for a launch. */
export interface LaunchLinks {
  /** Mission patch images. */
  patch: {
    /** URL of the small patch image. */
    small: string | null;
    /** URL of the large patch image. */
    large: string | null;
  };
  /** Reddit discussion links. */
  reddit: {
    /** Reddit campaign thread URL. */
    campaign: string | null;
    /** Reddit launch thread URL. */
    launch: string | null;
    /** Reddit media thread URL. */
    media: string | null;
    /** Reddit recovery thread URL. */
    recovery: string | null;
  };
  /** Flickr photo album links. */
  flickr: {
    /** URLs of small Flickr images. */
    small: string[];
    /** URLs of original-resolution Flickr images. */
    original: string[];
  };
  /** URL to the press kit PDF. */
  presskit: string | null;
  /** URL of the live webcast. */
  webcast: string | null;
  /** YouTube video ID for the launch webcast. */
  youtube_id: string | null;
  /** URL of a news article about the launch. */
  article: string | null;
  /** URL of the Wikipedia article for the launch. */
  wikipedia: string | null;
}

/** Describes a failure event that occurred during a launch. */
export interface LaunchFailure {
  /** Time in seconds from launch when the failure occurred. */
  time: number;
  /** Altitude in metres at which the failure occurred. `null` if unknown. */
  altitude: number | null;
  /** Human-readable description of the failure cause. */
  reason: string;
}

/** Information about a single booster core used in a launch. */
export interface LaunchCore {
  /** ID of the core. `null` if unknown. */
  core: string | null;
  /** Flight number of this core. `null` if unknown. */
  flight: number | null;
  /** Whether grid fins were used. `null` if unknown. */
  gridfins: boolean | null;
  /** Whether landing legs were deployed. `null` if unknown. */
  legs: boolean | null;
  /** Whether this core was previously flown. `null` if unknown. */
  reused: boolean | null;
  /** Whether a landing was attempted. `null` if unknown. */
  landing_attempt: boolean | null;
  /** Whether the landing succeeded. `null` if unknown. */
  landing_success: boolean | null;
  /** Type of landing (e.g. ASDS, RTLS). `null` if unknown. */
  landing_type: string | null;
  /** ID of the landpad targeted. `null` if unknown. */
  landpad: string | null;
}

/** A SpaceX rocket record as returned by the SpaceX API v4. */
export interface Rocket {
  /** Unique rocket identifier. */
  id: string;
  /** Human-readable rocket name. */
  name: string;
  /** Type classification of the rocket. */
  type: string;
  /** Whether the rocket is currently active. */
  active: boolean;
  /** Number of stages. */
  stages: number;
  /** Number of strap-on boosters. */
  boosters: number;
  /** Cost per launch in USD. */
  cost_per_launch: number;
  /** Historical success rate as a percentage. */
  success_rate_pct: number;
  /** Date of the first flight in ISO 8601 format. */
  first_flight: string;
  /** Country of origin. */
  country: string;
  /** Company that operates the rocket. */
  company: string;
  /** Overall rocket height. */
  height: { meters: number; feet: number };
  /** Rocket diameter. */
  diameter: { meters: number; feet: number };
  /** Total mass of the rocket. */
  mass: { kg: number; lb: number };
  /** Human-readable description of the rocket. */
  description: string;
  /** URL of the Wikipedia article for the rocket. */
  wikipedia: string;
  /** URLs of Flickr images of the rocket. */
  flickr_images: string[];
}

/** A SpaceX launchpad record as returned by the SpaceX API v4. */
export interface Launchpad {
  /** Unique launchpad identifier. */
  id: string;
  /** Short human-readable name of the launchpad. */
  name: string;
  /** Full official name of the launchpad. */
  full_name: string;
  /** Operational status of the launchpad. */
  status: "active" | "inactive" | "unknown" | "retired" | "lost" | "under construction";
  /** City or locality where the launchpad is located. */
  locality: string;
  /** State or region where the launchpad is located. */
  region: string;
  /** IANA timezone identifier for the launchpad location. */
  timezone: string;
  /** Latitude of the launchpad in decimal degrees. */
  latitude: number;
  /** Longitude of the launchpad in decimal degrees. */
  longitude: number;
  /** Total number of launch attempts from this pad. */
  launch_attempts: number;
  /** Total number of successful launches from this pad. */
  launch_successes: number;
  /** IDs of rockets that have launched from this pad. */
  rockets: string[];
  /** IDs of launches that have taken place from this pad. */
  launches: string[];
  /** Human-readable description of the launchpad. */
  details: string;
  /** Images of the launchpad. */
  images: {
    /** URLs of large launchpad images. */
    large: string[];
  };
}

// API query types

/** Request body used when querying the SpaceX `/launches/query` endpoint. */
export interface LaunchQuery {
  /** MongoDB-style filter document. */
  query?: Record<string, unknown>;
  /** Pagination and sorting options. */
  options?: QueryOptions;
}

/** Pagination, sorting, and field-selection options for a SpaceX API query. */
export interface QueryOptions {
  /** Fields to include or exclude (MongoDB projection). */
  select?: string | Record<string, number>;
  /** Sort criteria: field name mapped to direction or numeric sort value. */
  sort?: Record<string, "asc" | "desc" | 1 | -1>;
  /** 1-based page number to retrieve. */
  page?: number;
  /** Maximum number of documents per page. `0` returns all documents. */
  limit?: number;
  /** Whether to include pagination metadata in the response. */
  pagination?: boolean;
  /** Paths to populate (join) with their referenced documents. */
  populate?: string[] | PopulateOption[];
  /** Number of documents to skip before the first result. */
  offset?: number;
}

/** Describes a single field to populate (join) in a query result. */
export interface PopulateOption {
  /** The field path to populate. */
  path: string;
  /** Optional MongoDB projection for the populated document. */
  select?: Record<string, number>;
}

/** Paginated response envelope returned by the SpaceX API query endpoints. */
export interface PaginatedResponse<T> {
  /** Array of documents for the current page. */
  docs: T[];
  /** Total number of documents matching the query. */
  totalDocs: number;
  /** Number of documents skipped. */
  offset: number;
  /** Maximum documents per page. */
  limit: number;
  /** Total number of pages. */
  totalPages: number;
  /** Current 1-based page number. */
  page: number;
  /** 1-based index of the first document on this page. */
  pagingCounter: number;
  /** Whether a previous page exists. */
  hasPrevPage: boolean;
  /** Whether a next page exists. */
  hasNextPage: boolean;
  /** Previous page number, or `null` if on the first page. */
  prevPage: number | null;
  /** Next page number, or `null` if on the last page. */
  nextPage: number | null;
}

// Filter / UI types

/** Filter option for the launch timeline status. */
export type LaunchStatusFilter = "all" | "upcoming" | "past";

/** Filter option for launch outcome. */
export type LaunchSuccessFilter = "all" | "success" | "failure";

/** Field by which launches can be sorted. */
export type SortField = "date_utc" | "name" | "flight_number";

/** Sort order direction. */
export type SortDirection = "asc" | "desc";

/** All active filter and sort values applied to the launch list view. */
export interface LaunchFilters {
  /** Timeline status filter. */
  status: LaunchStatusFilter;
  /** Outcome filter. */
  success: LaunchSuccessFilter;
  /** Free-text search string matched against launch names. */
  search: string;
  /** Earliest launch date to include (ISO 8601 date string). */
  dateFrom: string;
  /** Latest launch date to include (ISO 8601 date string). */
  dateTo: string;
  /** Field to sort results by. */
  sortField: SortField;
  /** Direction of the sort. */
  sortDirection: SortDirection;
}
