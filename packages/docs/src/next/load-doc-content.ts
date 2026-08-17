import { readFileSync } from 'node:fs'
import { compile } from '@blackwork/machine/server'
import { mergeDocsComponents } from '../mdx/merge-docs-components'
import type { NormalizedDocsConfig } from '../config/types'
import type { DocEntry } from '../source/types'

const getCompileFormat = (entry: DocEntry) => {
  return entry.format === 'mdx' ? 'mdx' : 'markdown'
}

export const loadDocContent = async ({
  config,
  entry,
}: {
  config: NormalizedDocsConfig
  entry: DocEntry
}) => {
  const source = entry.loadSource
    ? await entry.loadSource()
    : readFileSync(entry.sourcePath, 'utf8')

  return compile(source, {
    format: getCompileFormat(entry),
    // Client MDX islands such as CodeBlock cannot be invoked during compile.
    includeHtml: false,
    components: mergeDocsComponents(config.mdx.components),
  })
}
