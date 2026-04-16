import type { LaunchFilters } from "./types";

/**
 * Centralised TanStack Query key factory.
 *
 * Using a single object ensures that cache invalidations and query lookups
 * always reference the same key shapes, preventing stale-data bugs caused by
 * key mismatches.
 */
export const queryKeys = {
  /**
   * Key for the paginated launch list, scoped to the active filter set.
   *
   * @param filters - The currently applied launch filters.
   * @returns A readonly tuple used as the React Query cache key.
   */
  launches: (filters: LaunchFilters) =>
    ["launches", filters] as const,

  /**
   * Key for a single launch detail record.
   *
   * @param id - The launch ID.
   * @returns A readonly tuple used as the React Query cache key.
   */
  launch: (id: string) => ["launch", id] as const,

  /**
   * Key for a single rocket detail record.
   *
   * @param id - The rocket ID.
   * @returns A readonly tuple used as the React Query cache key.
   */
  rocket: (id: string) => ["rocket", id] as const,

  /**
   * Key for a single launchpad detail record.
   *
   * @param id - The launchpad ID.
   * @returns A readonly tuple used as the React Query cache key.
   */
  launchpad: (id: string) => ["launchpad", id] as const,
} as const;
