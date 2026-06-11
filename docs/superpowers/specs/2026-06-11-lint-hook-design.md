# Pre-commit Lint Hook — Design Spec

**Date:** 2026-06-11
**Status:** Approved

## Overview

Add a pre-commit git hook that runs ESLint on staged TypeScript/TSX files using husky + lint-staged.

## Components

| File | Responsibility |
|------|---------------|
| `eslint.config.js` | ESLint flat config — TS rules for all, React rules for frontend |
| `.husky/pre-commit` | Runs `pnpm lint-staged` on commit |
| `package.json` (root) | lint-staged config, `prepare` script, devDependencies |

## ESLint Config

Flat config (`eslint.config.js`) at repo root:
- `@eslint/js` recommended rules
- `typescript-eslint` strict rules for all `apps/**/*.{ts,tsx}`
- `eslint-plugin-react-hooks` rules for `apps/frontend/**/*.tsx`

## lint-staged Config (in package.json)

```json
"lint-staged": {
  "apps/**/*.{ts,tsx}": "eslint --fix"
}
```

Only staged files are linted — fast, non-blocking for unrelated files.

## husky

- `pnpm prepare` installs husky automatically after `pnpm install`
- `.husky/pre-commit` contains a single `pnpm lint-staged` call
- Hook is committed to the repo so all team members get it

## Dependencies (root devDependencies)

- `eslint` ^9
- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-react-hooks`
- `husky`
- `lint-staged`
