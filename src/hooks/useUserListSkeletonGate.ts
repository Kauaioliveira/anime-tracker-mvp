/* eslint-disable react-hooks/set-state-in-effect -- sync reset when `hasItems` changes; hide timeout is async */
import { useEffect, useState } from 'react'

/**
 * When the list has items, shows skeleton briefly (navigation or list became
 * non-empty). Empty lists never show the skeleton.
 */
export function useUserListSkeletonGate(hasItems: boolean): boolean {
  const [showSkeleton, setShowSkeleton] = useState(hasItems)

  useEffect(() => {
    if (!hasItems) {
      setShowSkeleton(false)
      return
    }
    setShowSkeleton(true)
    const t = window.setTimeout(() => setShowSkeleton(false), 170)
    return () => window.clearTimeout(t)
  }, [hasItems])

  return hasItems && showSkeleton
}
