import { BundleFormat, createBaseConfig } from '@bassist/build-config/tsdown'
import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const baseConfig = createBaseConfig({
  pkg,
  entry: {
    index: 'src/index.ts',
    form: 'src/form/index.ts',
    rsc: 'src/rsc.ts',
  },
  format: [BundleFormat.CJS, BundleFormat.ESM],
})

export default defineConfig(baseConfig)
