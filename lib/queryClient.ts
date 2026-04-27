import { environmentManager, QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

function makeQueryClient() {
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

let browserQueryClient: QueryClient | null = null;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}