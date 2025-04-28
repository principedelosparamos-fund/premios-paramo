const { FlatCompat } = require('@eslint/eslintrc')
const compat = new FlatCompat({ baseDirectory: __dirname })

module.exports = [
  { ignores: ['dist/**', 'node_modules/**', 'public/**'] },
  ...compat.extends(
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    files: ['*.astro'],
    languageOptions: {
      parser: 'astro-eslint-parser',
      parserOptions: { project: './tsconfig.json', extraFileExtensions: ['.astro'] }
    },
    rules: {}
  }
]
