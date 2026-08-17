import { LayoutFooter } from 'blackwork/rsc'
import React from 'react'
import type { DocsThemeFooterSlotProps, DocsThemeLinkComponent } from '../types'

export interface DefaultDocsFooterProps extends DocsThemeFooterSlotProps {
  LinkComponent?: DocsThemeLinkComponent
}

export const DefaultDocsFooter: React.FC<DefaultDocsFooterProps> = ({
  siteTitle,
}) => {
  const year = new Date().getFullYear()

  return (
    <LayoutFooter
      data-docs-region="footer"
      className="h-auto min-h-16 border-t border-border/60 bg-background py-6"
    >
      <p className="text-sm text-muted-foreground">
        © {year} {siteTitle}
      </p>
    </LayoutFooter>
  )
}
