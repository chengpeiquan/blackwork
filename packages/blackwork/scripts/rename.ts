import { access, copyFile, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(__dirname, '..')

const pickStyleFile = async (outDir: string) => {
  const candidates = ['ui-globals.css', 'style.css', 'index.css']

  for (const fileName of candidates) {
    const filePath = resolve(outDir, fileName)

    try {
      await access(filePath)
      return filePath
    } catch {}
  }

  throw new Error('No CSS entry file found in dist directory.')
}

const copyCommonJsDeclarationFiles = async (outDir: string) => {
  const entries = await readdir(outDir, { withFileTypes: true })

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.d.ts'))
      .map((entry) => {
        const sourceFile = resolve(outDir, entry.name)
        const outFile = resolve(
          outDir,
          entry.name.replace(/\.d\.ts$/, '.d.cts'),
        )

        return copyFile(sourceFile, outFile)
      }),
  )
}

const ensureStableCssEntry = async (outDir: string) => {
  const outFile = resolve(outDir, './ui-globals.css')
  const entryFile = await pickStyleFile(outDir)

  // Parallel top-level builds can reach this step concurrently. Reusing or
  // copying the generated stylesheet keeps the publish entry stable.
  if (entryFile !== outFile) {
    await copyFile(entryFile, outFile)
  }
}

const copyThemeCssEntry = async (outDir: string) => {
  await copyFile(
    resolve(packageRoot, 'src/styles/theme.css'),
    resolve(outDir, 'theme.css'),
  )
}

const copyTailwindCssEntry = async (outDir: string) => {
  await copyFile(
    resolve(packageRoot, 'src/styles/tailwind.css'),
    resolve(outDir, 'tailwind.css'),
  )
}

export const normalizeBuildOutput = async (outDir: string) => {
  await Promise.all([
    ensureStableCssEntry(outDir),
    copyThemeCssEntry(outDir),
    copyTailwindCssEntry(outDir),
    copyCommonJsDeclarationFiles(outDir),
  ])
}

const run = async () => {
  await normalizeBuildOutput(resolve(__dirname, '../dist'))
}

run().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
