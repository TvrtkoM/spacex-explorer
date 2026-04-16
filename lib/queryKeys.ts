import type { LaunchFilters } from "./types";

export const queryKeys = {
  launches: (filters: LaunchFilters) =>
    ["launches", filters] as const,
  launch: (id: string) => ["launch", id] as const,
  rocket: (id: string) => ["rocket", id] as const,
  launchpad: (id: string) => ["launchpad", id] as const,
} as const;
