import { BundleFormat, createBaseConfig } from '@bassist/build-config/tsup'
import { defineConfig } from 'tsup'
import autoImport from 'unplugin-auto-import/esbuild'
import pkg from './package.json'

const baseConfig = createBaseConfig({
  pkg,
  entry: {
    index: 'src/index.ts',
    icons: 'src/icons/index.ts',
    form: 'src/form/index.ts',
    'tailwind-config': 'src/tailwind-config.ts',
  },
  globalName: 'Blackwork',
  format: [BundleFormat.CJS, BundleFormat.ESM, BundleFormat.IIFE],
})

export default defineConfig({
  ...baseConfig,
  esbuildPlugins: [
    autoImport({
      imports: ['react', { react: ['createContext'] }, 'react-router-dom'],
      dts: './src/types/declaration-files/auto-imports.d.ts',
    }),
  ],
})
