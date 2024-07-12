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
    files: ['**/components/ui/*.tsx'],
    rules: {
      'react/prop-types': [
        2,
        { ignore: ['className', 'sideOffset', 'checked'] },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    ignores: ['dist', 'lib', 'types', 'test'],
  },
])
