// @ts-check
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
]
const blackworkFiles = ['packages/blackwork/src/**/*.{js,jsx,ts,tsx}']
const machineTestFiles = ['packages/machine/test/**/*.{js,jsx,ts,tsx}']
const docsStarterFiles = ['apps/docs-starter/**/*.{js,jsx,ts,tsx}']

export default defineEslintConfig(
  ...scopeConfigs(eslintPresets.imports(), workspaceFiles),
  ...scopeConfigs(eslintPresets.react(), workspaceFiles),
  ...scopeConfigs(
    eslintPresets.tailwindcss({
      config: 'packages/blackwork/tailwind.config.ts',
      whitelist: ['toaster'],
    }),
    blackworkFiles,
  ),
  ...scopeConfigs(eslintPresets.vitest(), machineTestFiles),
  ...scopeConfigs(eslintPresets.vitest(), [
    'apps/docs-starter/src/**/*.test.ts',
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
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: ['toaster'],
        },
      ],
    },
  },

  {
    name: getConfigName('docs-starter-tailwind'),
    files: docsStarterFiles,
    rules: {
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/enforces-shorthand': 'off',
      'tailwindcss/no-custom-classname': 'off',
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
