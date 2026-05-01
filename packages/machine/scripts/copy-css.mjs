import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(__dirname, '..')
const outFile = resolve(packageRoot, 'dist/tailwind.css')

await mkdir(dirname(outFile), { recursive: true })
await copyFile(resolve(packageRoot, 'src/styles/tailwind.css'), outFile)
