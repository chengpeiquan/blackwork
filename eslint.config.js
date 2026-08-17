// @ts-check
import { fixupConfigRules } from '@eslint/compat'
import { createGetConfigNameFactory } from '@bassist/eslint-config'
import { defineEslintConfig, eslintPresets } from '@bassist/oxc-integration'

const getConfigName = createGetConfigNameFactory('blackwork-workspace')

/**
 * @param {import('@bassist/eslint-config').FlatESLintConfig[]} configs
 * @param {string[]} files
 */
const scopeConfigs = (configs, files) => {
  return configs.map((config) => ({
    ...config,
    files,
  }))
}

const workspaceFiles = [
  'packages/**/*.{js,jsx,ts,tsx}',
  'apps/**/*.{js,jsx,ts,tsx}',
  'docs/**/*.{js,jsx,ts,tsx}',
]
const blackworkFiles = ['packages/blackwork/src/**/*.{js,jsx,ts,tsx}']
const machineTestFiles = ['packages/machine/test/**/*.{js,jsx,ts,tsx}']
const docsStarterFiles = [
  'apps/docs-starter/**/*.{js,jsx,ts,tsx}',
  'docs/**/*.{js,jsx,ts,tsx}',
]
const reactConfigs = eslintPresets
  .react()
  .filter((config) => config.name !== 'bassist/imports')

export default defineEslintConfig(
  ...scopeConfigs(eslintPresets.imports(), workspaceFiles),
  ...scopeConfigs(fixupConfigRules(reactConfigs), workspaceFiles),
  ...scopeConfigs(
    eslintPresets.tailwindcss({
      entryPoint: 'packages/blackwork/src/styles/tailwind.css',
    }),
    blackworkFiles,
  ),
  ...scopeConfigs(eslintPresets.vitest(), machineTestFiles),
  ...scopeConfigs(eslintPresets.vitest(), [
    'apps/docs-starter/src/**/*.test.ts',
    'docs/src/**/*.test.ts',
  ]),

  {
    name: getConfigName('react-runtime'),
    files: workspaceFiles,
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    name: getConfigName('blackwork-override'),
    files: [
      'packages/blackwork/src/components/ui/*.tsx',
      'packages/blackwork/src/form/*.tsx',
    ],
    rules: {
      'react/prop-types': [
        2,
        {
          ignore: [
            'align',
            'autoFocus',
            'checked',
            'className',
            'decorative',
            'orientation',
            'sideOffset',
            'shouldScaleBackground',
            'value',
          ],
        },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },

  {
    name: getConfigName('blackwork-tailwind'),
    files: blackworkFiles,
    rules: {
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unknown-classes': 'off',
    },
  },

  {
    name: getConfigName('docs-starter-tailwind'),
    files: docsStarterFiles,
    rules: {
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/enforce-shorthand-classes': 'off',
      'better-tailwindcss/no-unknown-classes': 'off',
    },
  },

  {
    name: getConfigName('ignore'),
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/lib/**',
      '**/out/**',
      '**/types/**',
      'docs/plans/**',
    ],
  },
)
