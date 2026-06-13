# MCP Dev Setup — 설계 문서

**작성일**: 2026-06-13
**상태**: 승인 대기

---

## 개요

전역에서 사용 가능한 두 개의 독립 MCP 서버를 작성한다.
각 MCP는 Claude Code에 등록되어 프론트엔드 프로젝트의 개발 환경 세팅을 자동화한다.

| MCP | 역할 |
|-----|------|
| `storybook-setup` | Storybook 8 의존성 설치 + 설정 파일 생성 |
| `testing-setup` | Vitest + MSW + Playwright 설치 + 설정 파일 생성 |

---

## 기술 스택

- **런타임**: Node.js (LTS)
- **언어**: TypeScript 5.x
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **전송 방식**: stdio
- **빌드**: `tsc` → `dist/index.js`
- **실행**: `node dist/index.js`

---

## 위치 및 구조

```
~/.claude/mcps/
├── storybook-setup/
│   ├── src/
│   │   ├── index.ts
│   │   └── tools/
│   │       ├── install.ts
│   │       └── configure.ts
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json
│
└── testing-setup/
    ├── src/
    │   ├── index.ts
    │   └── tools/
    │       ├── install.ts
    │       └── configure.ts
    ├── dist/
    ├── package.json
    └── tsconfig.json
```

---

## Claude Code 등록 방법

`~/.claude/settings.json`의 `mcpServers`에 추가:

```json
{
  "mcpServers": {
    "storybook-setup": {
      "command": "node",
      "args": ["/Users/<username>/.claude/mcps/storybook-setup/dist/index.js"]
    },
    "testing-setup": {
      "command": "node",
      "args": ["/Users/<username>/.claude/mcps/testing-setup/dist/index.js"]
    }
  }
}
```

---

## MCP 1: `storybook-setup`

### 대상 프로젝트 스택

현재 프로젝트 기준: React 19, Vite 6, TypeScript 5.7, `@vitejs/plugin-react` 4.x, pnpm

### 설치 패키지

```
devDependencies:
  storybook@^8
  @storybook/react-vite@^8
  @storybook/react@^8
  @storybook/addon-essentials@^8
```

### 노출 Tools

#### `install_storybook`
- **설명**: 프론트엔드 패키지에 Storybook 8 의존성 설치
- **입력**: `{ projectPath: string }` — `package.json`이 있는 디렉토리 경로
- **동작**: `pnpm add -D storybook @storybook/react-vite @storybook/react @storybook/addon-essentials`
- **검증**: `projectPath`에 `package.json` 존재 확인, 이미 설치 여부 체크

#### `configure_storybook`
- **설명**: `.storybook/main.ts`, `.storybook/preview.tsx` 생성
- **입력**: `{ projectPath: string, overwrite?: boolean }` (기본값: false)
- **동작**: 두 설정 파일을 `projectPath/.storybook/`에 생성

#### `add_storybook_scripts`
- **설명**: `package.json`의 `scripts`에 storybook 명령 추가
- **입력**: `{ projectPath: string }`
- **추가 스크립트**:
  - `"storybook": "storybook dev -p 6006"`
  - `"build-storybook": "storybook build"`

### 생성 파일 내용

**`.storybook/main.ts`**:
```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

**`.storybook/preview.tsx`**:
```tsx
import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

---

## MCP 2: `testing-setup`

### 대상 프로젝트 스택

현재 프로젝트 기준: React 19, Vite 6, TypeScript 5.7, pnpm (프론트엔드만 적용)

### 설치 패키지

```
devDependencies:
  vitest@^4
  @testing-library/react@^16
  @testing-library/user-event@^14
  @testing-library/jest-dom@^6
  jsdom@^26
  msw@^2
  @playwright/test@^1
```

### 노출 Tools

#### `install_vitest`
- **설명**: Vitest + @testing-library 설치
- **입력**: `{ projectPath: string }`
- **동작**: `pnpm add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`

#### `install_msw`
- **설명**: MSW 2.x 설치
- **입력**: `{ projectPath: string }`
- **동작**: `pnpm add -D msw`

#### `install_playwright`
- **설명**: Playwright 설치
- **입력**: `{ projectPath: string }`
- **동작**: `pnpm add -D @playwright/test` 후 `pnpm exec playwright install --with-deps chromium`

#### `configure_vitest`
- **설명**: `vitest.config.ts` 및 `src/test/setup.ts` 생성
- **입력**: `{ projectPath: string, overwrite?: boolean }` (기본값: false)

#### `configure_msw`
- **설명**: `src/mocks/handlers.ts`, `src/mocks/browser.ts` 생성
- **입력**: `{ projectPath: string, overwrite?: boolean }` (기본값: false)

#### `configure_playwright`
- **설명**: `playwright.config.ts` 생성
- **입력**: `{ projectPath: string, overwrite?: boolean }` (기본값: false)

### 생성 파일 내용

**`vitest.config.ts`**:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
```

**`src/test/setup.ts`**:
```ts
import '@testing-library/jest-dom'
```

**`src/mocks/handlers.ts`**:
```ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // 예시: http.get('/api/items', () => HttpResponse.json([]))
]
```

**`src/mocks/browser.ts`**:
```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

**`playwright.config.ts`**:
```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 공통 내부 동작 패턴

모든 tool은 아래 3단계로 동작한다:

```
1. 검증 (Validate)
   ├─ projectPath 디렉토리 존재 확인
   ├─ package.json 파싱
   └─ 대상 패키지 이미 설치 여부 확인

2. 실행 (Execute)
   ├─ install tools: child_process.execSync으로 pnpm 명령 실행
   └─ configure tools: fs.writeFileSync로 설정 파일 생성

3. 응답 (Respond)
   ├─ 성공: 생성/설치된 항목 목록 + 다음 단계 안내
   └─ 실패: 에러 메시지 반환 (프로세스 종료 없음)
```

### 에러 처리

| 상황 | 처리 |
|------|------|
| `projectPath`에 `package.json` 없음 | 에러 반환, 실행 중단 |
| 패키지 이미 설치됨 | 경고 메시지 후 skip |
| pnpm 명령 실패 | stderr 내용을 에러 메시지로 반환 |
| 파일 이미 존재 | 덮어쓰기 여부 `overwrite?: boolean` 파라미터로 제어 (기본값: false) |
