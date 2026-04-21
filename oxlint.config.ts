import { defineOxlintConfig, oxlintPresets } from '@bassist/oxc-integration'

export default defineOxlintConfig(
  oxlintPresets.react(),
  oxlintPresets.vitest(),
  {
    ignorePatterns: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.git/**',
      '**/.next/**',
      '**/out/**',
      '**/docs/plans/**',
      '**/*.d.ts',
    ],
    rules: {
      'jsx-a11y/heading-has-content': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/no-redundant-roles': 'off',
      'jsx-a11y/prefer-tag-over-role': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
    },
  },
)
