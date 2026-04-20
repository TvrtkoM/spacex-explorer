import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

/**
 * Creates a new TanStack `QueryClient` with application-wide default options.
 *
 * **Defaults:**
 * - `staleTime` — 60 seconds.
 * - `gcTime` — 5 minutes.
 * - `retry` — Up to 3 attempts. 4xx errors (except 429) are not retried.
 * - `retryDelay` — Exponential backoff starting at 500 ms, capped at 30 s.
 *
 * A new instance must be created per request in SSR environments to prevent
 * cross-request state leaking between users.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attempt) => Math.min(500 * Math.pow(2, attempt), 30_000),
      },
    },
  });
}
