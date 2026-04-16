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

// Retry with exponential backoff for 429 and 5xx
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

export async function fetchLaunchById(id: string): Promise<Launch> {
  return apiFetch<Launch>(`/launches/${id}`);
}

export async function fetchRocketById(id: string): Promise<Rocket> {
  return apiFetch<Rocket>(`/rockets/${id}`);
}

export async function fetchLaunchpadById(id: string): Promise<Launchpad> {
  return apiFetch<Launchpad>(`/launchpads/${id}`);
}

// Fetch all past launches with only fields needed for charts
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
