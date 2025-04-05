import {
  defaultBundleFormatConfig,
  getBundleBanner,
  getBundleExtension,
} from '@bassist/node-utils'
import { defineConfig } from 'tsup'
import autoImport from 'unplugin-auto-import/esbuild'
import pkg from './package.json'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    icons: 'src/icons/index.ts',
    form: 'src/form/index.ts',
    'tailwind-config': 'src/tailwind-config.ts',
  },
  target: ['es2020'],
  format: defaultBundleFormatConfig,
  globalName: 'Blackwork',
  outExtension: (ctx) => getBundleExtension(ctx),
  outDir: 'dist',
  dts: true,
  banner: {
    js: getBundleBanner(pkg),
  },
  bundle: true,
  minify: true,
  clean: true,
  esbuildPlugins: [
    autoImport({
      imports: ['react', { react: ['createContext'] }, 'react-router-dom'],
      dts: './src/types/declaration-files/auto-imports.d.ts',
    }),
  ],
})
