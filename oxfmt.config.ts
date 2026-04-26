import { defineConfig } from 'oxfmt'
import { getOxfmtConfig } from '@bassist/oxc-integration'

export default defineConfig(
  getOxfmtConfig({
    ignorePatterns: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.git/**',
      '**/.next/**',
      '**/out/**',
      '**/CHANGELOG.md',
      '**/docs/plans/**',
      '**/*.d.ts',
    ],
    overrides: [
      {
        files: ['packages/blackwork/src/**/*.{js,jsx,ts,tsx}'],
        options: {
          sortTailwindcss: {
            config: 'packages/blackwork/tailwind.config.ts',
            functions: ['cn', 'clsx', 'cva'],
          },
        },
      },
      {
        files: ['apps/docs-starter/**/*.{js,jsx,ts,tsx,mdx}'],
        options: {
          sortTailwindcss: {
            config: 'apps/docs-starter/tailwind.config.ts',
            functions: ['cn', 'clsx', 'cva'],
          },
        },
      },
    ],
    sortPackageJson: false,
  }),
)
