import { defineDocsConfig } from '@blackwork/docs'
import { Callout } from './src/mdx/components/callout'
import { DocsCodeBlock } from './src/mdx/components/code-block'
import { DocsFadePreview } from './src/mdx/components/fade-preview'
import { DocsHeaderSearchAction } from './src/search/docs-search'

export const docsConfig = defineDocsConfig({
  site: {
    title: 'Blackwork Docs Starter',
    description:
      'A static-first docs starter built on blackwork and @blackwork/docs.',
  },
  home: {
    badge: false,
    eyebrow: false,
    title: 'Blackwork Docs Starter',
    description:
      'A static-first docs starter built on blackwork and @blackwork/docs.',
    primaryAction: {
      href: '/guide/getting-started',
      label: 'Getting Started',
    },
    secondaryAction: {
      href: '/guide/mdx-playground',
      label: 'MDX Playground',
    },
    highlights: false,
  },
  mdx: {
    components: {
      Callout,
      FadePreview: DocsFadePreview,
      pre: DocsCodeBlock,
    },
  },
  slots: {
    headerActions: DocsHeaderSearchAction,
  },
})
