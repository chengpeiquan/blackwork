import { BundleFormat, createBaseConfig } from '@bassist/build-config/tsdown'
import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig(
  createBaseConfig({
    pkg,
    entry: {
      index: 'src/index.ts',
      runtime: 'src/runtime.ts',
      server: 'src/server.ts',
      'next-adapter': 'src/next-adapter.tsx',
    },
    format: [BundleFormat.CJS, BundleFormat.ESM],
  }),
)
