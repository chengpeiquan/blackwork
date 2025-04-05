// @ts-check
import {
  createGetConfigNameFactory,
  defineFlatConfig,
  imports,
  javascript,
  jsx,
  react,
  typescript,
} from '@bassist/eslint-config'

const getConfigName = createGetConfigNameFactory('blackwork')

export default defineFlatConfig(
  [
    ...javascript,
    ...jsx,
    ...react,
    ...imports,
    ...typescript,

    {
      name: getConfigName('override'),
      files: ['src/components/ui/*.tsx', 'src/form/*.tsx'],
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
      name: getConfigName('tailwindcss'),
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
      name: getConfigName('ignore'),
      ignores: ['dist', 'lib', 'types', 'test'],
    },
  ],

  {
    tailwindcssSettings: {
      config: 'tailwind.config.ts',
    },
  },
)
