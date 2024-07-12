import { resolve } from 'node:path'
import { fs } from '@bassist/node-utils'

async function run() {
  const outDir = resolve(__dirname, '../dist')
  const entryFile = resolve(outDir, './index.css')
  const outFile = resolve(outDir, './ui-globals.css')
  await fs.rename(entryFile, outFile)
}
run().catch((e) => {
  console.log(e)
})
