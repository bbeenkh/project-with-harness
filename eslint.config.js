import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  js.configs.recommended,
  {
    files: ['apps/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
  },
  {
    files: ['apps/frontend/**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
)
