import { defineConfig } from 'tsup'
import {
  defaultBundleFormatConfig,
  getBundleBanner,
  getBundleExtension,
} from '@bassist/node-utils'
import pkg from './package.json'

export default defineConfig({
  entry: ['src/index.ts', 'src/tailwind-config.ts'],
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
})
