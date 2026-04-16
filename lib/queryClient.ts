import { QueryClient } from "@tanstack/react-query";

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
