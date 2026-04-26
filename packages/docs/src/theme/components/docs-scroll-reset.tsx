'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

type DocsInstantScrollToOptions = Omit<ScrollToOptions, 'behavior'> & {
  behavior?: ScrollBehavior | 'instant'
}

export const shouldResetDocsScroll = (
  previousPathname: string | null,
  pathname: string,
) => previousPathname !== null && previousPathname !== pathname

export const resetDocsScroll = (scrollable: Pick<Window, 'scrollTo'>) => {
  ;(scrollable.scrollTo as (options: DocsInstantScrollToOptions) => void)({
    left: 0,
    top: 0,
    behavior: 'instant',
  })
}

export const DocsScrollReset = () => {
  const pathname = usePathname()
  const previousPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof pathname === 'string' &&
      shouldResetDocsScroll(previousPathnameRef.current, pathname)
    ) {
      resetDocsScroll(window)
    }

    previousPathnameRef.current = typeof pathname === 'string' ? pathname : null
  }, [pathname])

  return null
}
