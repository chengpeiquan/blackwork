import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const distPath = resolve(process.cwd(), 'dist')
const declarationFiles = (await readdir(distPath))
  .filter((fileName) => fileName.endsWith('.d.ts'))
  .sort()
const declarations = await Promise.all(
  declarationFiles.map((fileName) =>
    readFile(resolve(distPath, fileName), 'utf8'),
  ),
)
const declaration = declarations.join('\n')
const browserDeclaration = await readFile(
  resolve(distPath, 'browser.d.ts'),
  'utf8',
)

assert.match(
  declaration,
  /interface SearchResultItem extends SearchFilterableDocument/u,
)
assert.match(declaration, /locale\?: string;/u)
assert.match(declaration, /type SearchResultItem/u)
assert.doesNotMatch(declaration, /SearchFilterKey/u)

assert.match(browserDeclaration, /createSearchClient/u)
assert.match(browserDeclaration, /type SearchClient/u)
