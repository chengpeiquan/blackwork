import { BundleFormat, createBaseConfig } from '@bassist/build-config/tsdown'
import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  ...createBaseConfig({
    pkg,
    entry: {
      index: 'src/index.ts',
      next: 'src/next-plugin/index.ts',
      runtime: 'src/runtime.ts',
      theme: 'src/theme/index.ts',
    },
    format: [BundleFormat.CJS, BundleFormat.ESM],
  }),
  root: 'src',
  unbundle: true,
})
