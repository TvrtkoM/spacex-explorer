import type {
  Launch,
  LaunchQuery,
  PaginatedResponse,
  Rocket,
  Launchpad,
  QueryOptions,
  LaunchFilters,
  SortField,
} from "./types";

const BASE_URL = "https://api.spacexdata.com/v4";
const DEFAULT_PAGE_SIZE = 48;

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Issues a typed request to the SpaceX API and deserialises the JSON response.
 *
 * @typeParam T - Expected shape of the parsed response body.
 * @param path - API path relative to the base URL (e.g. `"/launches/query"`).
 * @param init - Optional `fetch` init overrides.
 * @throws {@link ApiError} on non-2xx responses.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    throw new ApiError(res.status, `SpaceX API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Translates the application filter state into a SpaceX API query body.
 *
 * @param filters - The currently active launch filters.
 * @param page - The 1-based page number to request.
 * @returns A {@link LaunchQuery} ready to be serialised as the POST body.
 */
function buildLaunchQuery(
  filters: LaunchFilters,
  page: number
): LaunchQuery {
  const query: Record<string, unknown> = {};

  if (filters.status === "upcoming") {
    query.upcoming = true;
  } else if (filters.status === "past") {
    query.upcoming = false;
  }

  if (filters.success === "success") {
    query.success = true;
  } else if (filters.success === "failure") {
    query.success = false;
  }

  if (filters.search.trim()) {
    query.name = { $regex: filters.search.trim(), $options: "i" };
  }

  if (filters.dateFrom || filters.dateTo) {
    const dateQuery: Record<string, string> = {};
    if (filters.dateFrom) dateQuery.$gte = new Date(filters.dateFrom).toISOString();
    if (filters.dateTo) dateQuery.$lte = new Date(filters.dateTo).toISOString();
    query.date_utc = dateQuery;
  }

  const sortMap: Partial<Record<SortField, string>> = {
    date_utc: "date_utc",
    name: "name",
    flight_number: "flight_number",
  };

  const options: QueryOptions = {
    sort: {
      [sortMap[filters.sortField] ?? "date_utc"]:
        filters.sortDirection === "asc" ? "asc" : "desc",
    },
    limit: DEFAULT_PAGE_SIZE,
    page,
    pagination: true,
  };

  return { query, options };
}

/**
 * Fetches a paginated list of launches matching the given filters.
 *
 * @param filters - Active filter and sort state.
 * @param page - 1-based page number to retrieve.
 * @returns A paginated response containing matching {@link Launch} documents.
 */
export async function fetchLaunches(
  filters: LaunchFilters,
  page: number
): Promise<PaginatedResponse<Launch>> {
  const body = buildLaunchQuery(filters, page);
  return apiFetch<PaginatedResponse<Launch>>("/launches/query", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Fetches the full detail record for a single launch.
 *
 * @param id - The launch ID.
 * @returns The matching {@link Launch} document.
 */
export async function fetchLaunchById(id: string): Promise<Launch> {
  return apiFetch<Launch>(`/launches/${id}`);
}

/**
 * Fetches the full detail record for a single rocket.
 *
 * @param id - The rocket ID.
 * @returns The matching {@link Rocket} document.
 */
export async function fetchRocketById(id: string): Promise<Rocket> {
  return apiFetch<Rocket>(`/rockets/${id}`);
}

/**
 * Fetches the full detail record for a single launchpad.
 *
 * @param id - The launchpad ID.
 * @returns The matching {@link Launchpad} document.
 */
export async function fetchLaunchpadById(id: string): Promise<Launchpad> {
  return apiFetch<Launchpad>(`/launchpads/${id}`);
}

/**
 * Fetches minimal data for all past launches, optimised for chart rendering.
 *
 * Only the `date_utc`, `success`, and `upcoming` fields are requested, keeping
 * the payload small. Pagination is disabled so the full dataset is returned in
 * a single response.
 *
 * @returns An array of objects containing `date_utc`, `success`, and `upcoming`
 *   for every past launch.
 */
export async function fetchAllLaunchesForCharts(): Promise<
  Array<{ date_utc: string; success: boolean | null; upcoming: boolean }>
> {
  const body = {
    query: { upcoming: false },
    options: {
      select: { date_utc: 1, success: 1, upcoming: 1 },
      limit: 0,
      pagination: false,
    },
  };
  const res = await apiFetch<{ docs: Array<{ date_utc: string; success: boolean | null; upcoming: boolean }> }>(
    "/launches/query",
    { method: "POST", body: JSON.stringify(body) }
  );
  return res.docs;
}

export { DEFAULT_PAGE_SIZE };
