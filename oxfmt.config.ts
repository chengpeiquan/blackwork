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
            stylesheet: 'packages/blackwork/src/styles/tailwind.css',
            functions: ['cn', 'clsx', 'cva'],
          },
        },
      },
    ],
    sortPackageJson: false,
  }),
)
