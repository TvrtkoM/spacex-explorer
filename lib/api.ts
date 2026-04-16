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

/**
 * Performs an HTTP request with exponential-backoff retries for transient
 * errors (HTTP 429 and 5xx responses, as well as network failures).
 *
 * @param url - The full URL to fetch.
 * @param options - Standard `fetch` init options (method, headers, body, …).
 * @param retries - Maximum number of attempts before throwing. Defaults to `3`.
 * @param baseDelayMs - Delay for the first retry in milliseconds. Each
 *   subsequent attempt doubles the delay. Defaults to `500`.
 * @returns The successful `Response` object.
 * @throws The last encountered `Error` when all attempts are exhausted.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  baseDelayMs = 500
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, options);

      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        // Exponential backoff: 500ms, 1000ms, 2000ms
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
        lastError = new Error(`HTTP ${res.status}`);
        continue;
      }

      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries - 1) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError ?? new Error("Request failed after retries");
}

/**
 * Low-level helper that issues a request to the SpaceX API and deserialises
 * the JSON response body.
 *
 * Automatically prepends {@link BASE_URL} to `path` and sets the
 * `Content-Type: application/json` header.
 *
 * @typeParam T - Expected shape of the parsed response body.
 * @param path - API path relative to the base URL (e.g. `"/launches/query"`).
 * @param init - Optional `fetch` init overrides.
 * @returns A promise that resolves to the parsed response of type `T`.
 * @throws An `Error` with HTTP status information when the response is not OK.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithRetry(
    `${BASE_URL}${path}`,
    {
      headers: { "Content-Type": "application/json" },
      ...init,
    }
  );

  if (!res.ok) {
    throw new Error(`SpaceX API error: ${res.status} ${res.statusText}`);
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
