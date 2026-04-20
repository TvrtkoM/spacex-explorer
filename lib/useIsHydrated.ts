import { useSyncExternalStore } from "react"

export const useIsHydrated = () => {
  return useSyncExternalStore(() => () => {}, () => true, () => false)
}