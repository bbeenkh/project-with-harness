# Storybook 연동 및 환경 세팅 (LWPW-34)

**날짜:** 2026-06-13
**티켓:** LWPW-34

## 목표

`apps/frontend/` (React 19 + Vite 6 + Tailwind CSS) 에 Storybook 8을 설치하고, FSD 구조와 연동되도록 환경을 구성한다.

## 방법

storybook-setup MCP tool 3개를 순서대로 실행한 뒤, preview.tsx에 Tailwind import를 수동으로 추가한다.

## 실행 단계

| 단계 | 방법 | 결과 |
|------|------|------|
| 1. 패키지 설치 | `install_storybook` MCP tool | `storybook`, `@storybook/react-vite`, `@storybook/react`, `@storybook/addon-essentials` devDependency 추가 |
| 2. 설정 파일 생성 | `configure_storybook` MCP tool | `.storybook/main.ts`, `.storybook/preview.tsx` 생성 |
| 3. 스크립트 추가 | `add_storybook_scripts` MCP tool | `package.json` scripts에 `storybook`, `build-storybook` 추가 |
| 4. Tailwind 연동 | `preview.tsx` 수동 Edit | `import '../src/index.css'` 추가 |

## 설정 파일 스펙

**`.storybook/main.ts`**
- story glob: `../src/**/*.stories.@(ts|tsx)` — FSD 모든 레이어 커버
- framework: `@storybook/react-vite`
- addons: `@storybook/addon-essentials`

**`.storybook/preview.tsx`**
- `import '../src/index.css'` (Tailwind directives 포함)
- 기본 controls 설정

## 스토리 파일 컨벤션

컴포넌트 파일 옆에 배치:
```
src/shared/ui/Button/
├── Button.tsx
└── Button.stories.tsx
```

## 완료 기준

- `pnpm -F frontend storybook` 실행 시 localhost:6006 정상 동작
- Tailwind 클래스가 Story 내에서 적용됨
- FSD 구조 내 `*.stories.tsx` 파일 자동 인식
