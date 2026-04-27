'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { resolveDocumentLang } from './resolve-document-lang'
import type { NormalizedDocsContentConfig } from '../config/types'

export interface DocsDocumentLangSyncProps {
  content: NormalizedDocsContentConfig
}

export const DocsDocumentLangSync = ({
  content,
}: DocsDocumentLangSyncProps) => {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const nextLang = resolveDocumentLang({
      config: {
        content,
      },
      pathname,
    })

    if (
      typeof nextLang === 'string' &&
      document.documentElement.lang !== nextLang
    ) {
      document.documentElement.lang = nextLang
    }
  }, [content, pathname])

  return null
}
