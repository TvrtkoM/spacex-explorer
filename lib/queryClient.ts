import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a new TanStack `QueryClient` with application-wide default options.
 *
 * **Defaults:**
 * - `staleTime` — 60 seconds. Data is considered fresh for one minute,
 *   preventing redundant refetches on window focus or component mount.
 * - `gcTime` — 5 minutes. Inactive query data is kept in the cache for five
 *   minutes before being garbage collected.
 * - `retry` — Up to 3 attempts. 4xx errors (except 429 Too Many Requests) are
 *   not retried because they indicate a client-side problem that will not
 *   resolve on its own.
 * - `retryDelay` — Exponential backoff starting at 500 ms, capped at 30 s.
 *
 * A new instance must be created per request in SSR environments to prevent
 * cross-request state leaking between users.
 *
 * @returns A configured `QueryClient` instance.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof Error) {
            const status = parseInt(
              error.message.match(/HTTP (\d+)/)?.[1] ?? "0"
            );
            if (status >= 400 && status < 500 && status !== 429) {
              return false;
            }
          }
          return failureCount < 3;
        },
        retryDelay: (attempt) => Math.min(500 * Math.pow(2, attempt), 30_000),
      },
    },
  });
}
