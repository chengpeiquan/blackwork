import { rename } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const run = async () => {
  const outDir = resolve(__dirname, '../dist')
  const entryFile = resolve(outDir, './index.css')
  const outFile = resolve(outDir, './ui-globals.css')
  await rename(entryFile, outFile)
}

run().catch((e) => {
  console.log(e)
})
