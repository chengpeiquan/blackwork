import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { collectDocsManifest } from '../source/collect-docs-manifest'
import type { CreateDocsSourceOptions, DocEntry } from '../source/types'

export interface GenerateDocsManifestFilesOptions extends CreateDocsSourceOptions {
  outDir?: string
}

export interface GeneratedDocsManifestFiles {
  manifestPath: string
  contentModulesDir: string
}

const DEFAULT_OUT_DIR = '.blackwork/docs'

const createModuleBaseName = (entry: DocEntry, rootDir: string) => {
  const hash = createHash('sha1')
    .update(relative(resolve(rootDir), entry.sourcePath))
    .digest('hex')
    .slice(0, 12)

  return `${entry.locale}-${hash}`
}

const toJsString = (value: unknown) => JSON.stringify(value, null, 2)

export const generateDocsManifestFiles = ({
  rootDir = '.',
  config,
  outDir = DEFAULT_OUT_DIR,
}: GenerateDocsManifestFilesOptions = {}): GeneratedDocsManifestFiles => {
  const manifest = collectDocsManifest({
    rootDir,
    config,
  })
  const absoluteRootDir = resolve(rootDir)
  const absoluteOutDir = resolve(absoluteRootDir, outDir)
  const contentModulesDir = join(absoluteOutDir, 'content')
  const manifestPath = join(absoluteOutDir, 'manifest.mjs')
  const manifestEntries: string[] = []

  rmSync(absoluteOutDir, { recursive: true, force: true })
  mkdirSync(contentModulesDir, { recursive: true })

  for (const entry of manifest.entries) {
    const moduleBaseName = createModuleBaseName(entry, absoluteRootDir)
    const moduleFileName = `${moduleBaseName}.mjs`
    const moduleRelativePath = `./content/${moduleFileName}`
    const modulePath = join(contentModulesDir, moduleFileName)
    const source = readFileSync(entry.sourcePath, 'utf8')

    writeFileSync(
      modulePath,
      `const source = ${JSON.stringify(source)}\n\nexport default source\n`,
    )

    manifestEntries.push(`{
  locale: ${toJsString(entry.locale)},
  slugSegments: ${toJsString(entry.slugSegments)},
  href: ${toJsString(entry.href)},
  legacyHref: ${toJsString(entry.legacyHref)},
  sourcePath: ${toJsString(entry.sourcePath)},
  format: ${toJsString(entry.format)},
  title: ${toJsString(entry.title)},
  description: ${toJsString(entry.description)},
  order: ${toJsString(entry.order)},
  frontmatter: ${toJsString(entry.frontmatter)},
  loadSource: async () => (await import(${toJsString(moduleRelativePath)})).default,
}`)
  }

  writeFileSync(
    manifestPath,
    `export const docsManifest = {
  defaultLocale: ${toJsString(manifest.defaultLocale)},
  enableDefaultLocaleRedirect: ${toJsString(manifest.enableDefaultLocaleRedirect)},
  localeCodes: ${toJsString(manifest.localeCodes)},
  entries: [
${manifestEntries.map((entry) => `    ${entry}`).join(',\n')}
  ],
}

export default docsManifest
`,
  )

  return {
    contentModulesDir,
    manifestPath,
  }
}
