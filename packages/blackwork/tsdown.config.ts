import { BundleFormat, createBaseConfig } from '@bassist/build-config/tsdown'
import { defineConfig } from 'tsdown'
import autoImport from 'unplugin-auto-import/rollup'
import pkg from './package.json' with { type: 'json' }

const baseConfig = createBaseConfig({
  pkg,
  entry: {
    index: 'src/index.ts',
    icons: 'src/icons/index.ts',
    form: 'src/form/index.ts',
    'tailwind-config': 'src/tailwind-config.ts',
  },
  format: [BundleFormat.CJS, BundleFormat.ESM],
})

export default defineConfig({
  ...baseConfig,
  plugins: [
    autoImport({
      imports: ['react', { react: ['createContext'] }, 'react-router-dom'],
      dts: './src/types/declaration-files/auto-imports.d.ts',
    }),
  ],
})
