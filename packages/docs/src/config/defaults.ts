import type { NormalizedDocsConfig } from './types'

export const defaultDocsConfig: NormalizedDocsConfig = {
  site: {},
  content: {
    root: 'contents',
    enableDefaultLocaleRedirect: true,
  },
  theme: {},
  docs: {},
  home: {},
  mdx: {},
  slots: {},
}
