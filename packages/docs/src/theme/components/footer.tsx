import { LayoutFooter } from 'blackwork/rsc'
import React from 'react'
import { DefaultDocsLink } from './link'
import type { DocsThemeFooterSlotProps, DocsThemeLinkComponent } from '../types'

export interface DefaultDocsFooterProps extends DocsThemeFooterSlotProps {
  LinkComponent?: DocsThemeLinkComponent
}

export const DefaultDocsFooter: React.FC<DefaultDocsFooterProps> = ({
  description,
  homeHref,
  LinkComponent = DefaultDocsLink,
  navigation,
  siteTitle,
}) => {
  return (
    <LayoutFooter
      data-docs-region="footer"
      className="h-auto min-h-32 border-t border-border/60 bg-background py-8"
    >
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4">
        <div className="space-y-2">
          <LinkComponent
            href={homeHref}
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            {siteTitle}
          </LinkComponent>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {navigation.length > 0 ? (
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {navigation.map((item) => (
              <LinkComponent
                key={item.href}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="text-muted-foreground"
              >
                {item.label}
              </LinkComponent>
            ))}
          </nav>
        ) : null}
      </div>
    </LayoutFooter>
  )
}
