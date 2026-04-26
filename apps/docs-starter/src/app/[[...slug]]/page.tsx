import {
  DocsPage,
  generateMetadata as generateDocsMetadata,
  generateStaticParams as generateDocsStaticParams,
} from '@blackwork/docs'
import { notFound, redirect } from 'next/navigation'
import { docsConfig } from '../../../docs.config'
import { LegacyRedirectPage } from './redirects/legacy-redirect-page'

export const dynamicParams = false

const isStaticExport = process.env.NEXT_OUTPUT === 'export'
const rootDir = '.'

export async function generateStaticParams() {
  const params = await generateDocsStaticParams({
    config: docsConfig,
    rootDir,
  })

  return params.map((item) => ({
    slug: item.slug ?? [],
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<import('next').Metadata> {
  return generateDocsMetadata({
    config: docsConfig,
    params,
    rootDir,
  })
}

export default function DocsRoutePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return DocsPage({
    config: docsConfig,
    onNotFound: () => notFound(),
    onRedirect: (href) =>
      isStaticExport ? <LegacyRedirectPage href={href} /> : redirect(href),
    params,
    rootDir,
  })
}
