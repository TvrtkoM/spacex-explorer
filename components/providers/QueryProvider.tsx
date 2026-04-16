"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import type { ReactNode } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // useState ensures each request gets its own QueryClient when using SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors except 429
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
            retryDelay: (attempt) =>
              Math.min(500 * Math.pow(2, attempt), 30_000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
