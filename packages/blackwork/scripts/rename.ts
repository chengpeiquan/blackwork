import { access, rename } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pickStyleFile = async (outDir: string) => {
  const candidates = ['style.css', 'index.css']

  for (const fileName of candidates) {
    const filePath = resolve(outDir, fileName)

    try {
      await access(filePath)
      return filePath
    } catch {}
  }

  throw new Error('No CSS entry file found in dist directory.')
}

const run = async () => {
  const outDir = resolve(__dirname, '../dist')
  const entryFile = await pickStyleFile(outDir)
  const outFile = resolve(outDir, './ui-globals.css')
  await rename(entryFile, outFile)
}

run().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
