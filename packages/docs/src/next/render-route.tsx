import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  LayoutMain,
} from 'blackwork/rsc'
import { DefaultContentShell } from '../theme/components/content-shell'
import { DefaultDocsShell } from '../theme/components/docs-shell'
import { DefaultHomeShell } from '../theme/components/home-shell'
import { DefaultDocsLink } from '../theme/components/link'
import { getEntrySectionConfig } from '../theme/components/shell-shared'
import { loadDocContent } from './load-doc-content'
import type { NormalizedDocsConfig } from '../config/types'
import type { DocsRouteResolution } from '../routing/resolve-docs-route'
import type { DocsSource } from '../source/types'
import type { ReactNode } from 'react'

export interface DocsPageAdapterHooks {
  onNotFound?: () => ReactNode | Promise<ReactNode>
  onRedirect?: (href: string) => ReactNode | Promise<ReactNode>
}

const RedirectPage = ({ href }: { href: string }) => {
  return (
    <LayoutMain className="items-center justify-center py-20">
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <Empty data-docs-region="redirect" className="max-w-xl border-border/60">
        <EmptyHeader>
          <EmptyTitle>Redirecting to the canonical URL</EmptyTitle>
          <EmptyDescription>
            The requested path is an alias. You will be sent to the canonical
            page automatically.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <DefaultDocsLink href={href}>Continue now</DefaultDocsLink>
          </Button>
        </EmptyContent>
      </Empty>
    </LayoutMain>
  )
}

export const renderResolvedDocsRoute = async ({
  config,
  onNotFound,
  onRedirect,
  resolution,
  source,
}: {
  config: NormalizedDocsConfig
  resolution: DocsRouteResolution
  source: DocsSource
} & DocsPageAdapterHooks): Promise<ReactNode> => {
  if (resolution.kind === 'notFound') {
    return onNotFound ? await onNotFound() : null
  }

  if (resolution.kind === 'redirect') {
    return onRedirect ? (
      await onRedirect(resolution.entry.href)
    ) : (
      <RedirectPage href={resolution.entry.href} />
    )
  }

  if (resolution.slugSegments.length === 0) {
    return (
      <DefaultHomeShell
        config={config}
        locale={resolution.locale}
        source={source}
      />
    )
  }

  const compiled = await loadDocContent({
    config,
    entry: resolution.entry,
  })

  const sectionConfig = getEntrySectionConfig(config, resolution.entry)

  if (sectionConfig.layout === 'content') {
    return (
      <DefaultContentShell
        config={config}
        entry={resolution.entry}
        headings={compiled.headings}
        source={source}
      >
        {compiled.jsxElement}
      </DefaultContentShell>
    )
  }

  return (
    <DefaultDocsShell
      config={config}
      entry={resolution.entry}
      headings={compiled.headings}
      source={source}
    >
      {compiled.jsxElement}
    </DefaultDocsShell>
  )
}
