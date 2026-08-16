import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@blackwork/docs/theme',
        replacement: fileURLToPath(
          new URL('./src/theme/index.ts', import.meta.url),
        ),
      },
      {
        find: 'blackwork/rsc',
        replacement: fileURLToPath(
          new URL('../blackwork/dist/rsc.mjs', import.meta.url),
        ),
      },
      {
        find: /^blackwork$/u,
        replacement: fileURLToPath(
          new URL('../blackwork/dist/index.mjs', import.meta.url),
        ),
      },
      {
        find: '@blackwork/docs/runtime',
        replacement: fileURLToPath(
          new URL('./src/runtime.ts', import.meta.url),
        ),
      },
      {
        find: '@blackwork/docs/next',
        replacement: fileURLToPath(
          new URL('./src/next-plugin/index.ts', import.meta.url),
        ),
      },
      {
        find: '@blackwork/docs',
        replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'node',
    exclude: [...configDefaults.exclude, 'dist/**'],
  },
})
