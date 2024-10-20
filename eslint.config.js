// @ts-check
import {
  defineFlatConfig,
  js,
  jsx,
  prettier,
  react,
  typescript,
} from '@bassist/eslint'

export default defineFlatConfig([
  ...js,
  ...jsx,
  ...prettier,
  ...react,
  ...typescript,
  {
    files: ['src/components/ui/*.tsx', 'src/form/*.tsx'],
    rules: {
      'react/prop-types': [
        2,
        {
          ignore: [
            'checked',
            'className',
            'decorative',
            'orientation',
            'sideOffset',
            'shouldScaleBackground',
          ],
        },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    ignores: ['dist', 'lib', 'types', 'test'],
  },
])
