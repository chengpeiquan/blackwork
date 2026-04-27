import { BundleFormat, createBaseConfig } from '@bassist/build-config/tsdown'
import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig(
  createBaseConfig({
    pkg,
    entry: {
      browser: 'src/browser.ts',
      index: 'src/index.ts',
    },
    format: [BundleFormat.CJS, BundleFormat.ESM],
  }),
)
