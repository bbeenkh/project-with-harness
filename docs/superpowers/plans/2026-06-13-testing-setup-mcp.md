# Testing Setup MCP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프론트엔드 프로젝트에 Vitest + MSW + Playwright를 자동으로 설치·설정해주는 전역 stdio MCP 서버 구현

**Architecture:** `@modelcontextprotocol/sdk` 기반 stdio MCP 서버. `install.ts`(3개 install tool)와 `configure.ts`(3개 configure tool)로 책임을 분리한다. 각 tool은 validate → execute → respond 패턴으로 동작한다.

**Tech Stack:** TypeScript 5.7, @modelcontextprotocol/sdk ^1.0, zod ^3, Node.js fs/child_process, Vitest ^2 (unit tests)

---

## 파일 구조

```
~/.claude/mcps/testing-setup/
├── src/
│   ├── index.ts            ← MCP 서버 진입점, tool 등록
│   └── tools/
│       ├── install.ts      ← installVitest(), installMsw(), installPlaywright()
│       └── configure.ts    ← configureVitest(), configureMsw(), configurePlaywright()
├── tests/
│   ├── install.test.ts
│   └── configure.test.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

### Task 1: 프로젝트 초기화

**Files:**
- Create: `~/.claude/mcps/testing-setup/package.json`
- Create: `~/.claude/mcps/testing-setup/tsconfig.json`
- Create: `~/.claude/mcps/testing-setup/vitest.config.ts`

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p ~/.claude/mcps/testing-setup/src/tools
mkdir -p ~/.claude/mcps/testing-setup/tests
```

- [ ] **Step 2: package.json 생성**

`~/.claude/mcps/testing-setup/package.json`:
```json
{
  "name": "testing-setup",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.7.2",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: tsconfig.json 생성**

`~/.claude/mcps/testing-setup/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: vitest.config.ts 생성**

`~/.claude/mcps/testing-setup/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 5: 의존성 설치**

```bash
cd ~/.claude/mcps/testing-setup && npm install
```

Expected: `node_modules` 생성

- [ ] **Step 6: 커밋**

```bash
cd ~/.claude/mcps/testing-setup
git init && git add .
git commit -m "chore: testing-setup MCP 프로젝트 초기화"
```

---

### Task 2: install tools 구현 (TDD)

**Files:**
- Create: `~/.claude/mcps/testing-setup/tests/install.test.ts`
- Create: `~/.claude/mcps/testing-setup/src/tools/install.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`~/.claude/mcps/testing-setup/tests/install.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fs from 'node:fs'
import * as childProcess from 'node:child_process'

vi.mock('node:fs')
vi.mock('node:child_process')

import { installVitest, installMsw, installPlaywright } from '../src/tools/install.js'

describe('installVitest', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await installVitest('/invalid/path')

    expect(result.success).toBe(false)
    expect(result.message).toContain('package.json')
  })

  it('vitest가 이미 설치되어 있으면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ devDependencies: { vitest: '^4.0.0' } })
    )

    const result = await installVitest('/project')

    expect(result.success).toBe(true)
    expect(result.message).toContain('이미 설치')
    expect(childProcess.execSync).not.toHaveBeenCalled()
  })

  it('pnpm add -D로 vitest 패키지들을 설치한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({}))
    vi.mocked(childProcess.execSync).mockReturnValue(Buffer.from(''))

    const result = await installVitest('/project')

    expect(childProcess.execSync).toHaveBeenCalledWith(
      expect.stringContaining('vitest'),
      expect.objectContaining({ cwd: '/project' })
    )
    expect(result.success).toBe(true)
  })
})

describe('installMsw', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await installMsw('/invalid/path')

    expect(result.success).toBe(false)
  })

  it('msw가 이미 설치되어 있으면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ devDependencies: { msw: '^2.0.0' } })
    )

    const result = await installMsw('/project')

    expect(result.success).toBe(true)
    expect(result.message).toContain('이미 설치')
  })

  it('pnpm add -D msw를 실행한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({}))
    vi.mocked(childProcess.execSync).mockReturnValue(Buffer.from(''))

    await installMsw('/project')

    expect(childProcess.execSync).toHaveBeenCalledWith(
      expect.stringContaining('msw'),
      expect.objectContaining({ cwd: '/project' })
    )
  })
})

describe('installPlaywright', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await installPlaywright('/invalid/path')

    expect(result.success).toBe(false)
  })

  it('@playwright/test가 이미 설치되어 있으면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ devDependencies: { '@playwright/test': '^1.0.0' } })
    )

    const result = await installPlaywright('/project')

    expect(result.success).toBe(true)
    expect(result.message).toContain('이미 설치')
  })

  it('pnpm add -D @playwright/test 후 playwright install을 실행한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({}))
    vi.mocked(childProcess.execSync).mockReturnValue(Buffer.from(''))

    await installPlaywright('/project')

    const calls = vi.mocked(childProcess.execSync).mock.calls
    expect(calls[0][0]).toContain('@playwright/test')
    expect(calls[1][0]).toContain('playwright install')
  })
})
```

- [ ] **Step 2: 테스트 실행하여 실패 확인**

```bash
cd ~/.claude/mcps/testing-setup && npm test
```

Expected: `Cannot find module '../src/tools/install.js'`

- [ ] **Step 3: install.ts 구현**

`~/.claude/mcps/testing-setup/src/tools/install.ts`:
```ts
import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

/**
 * # InstallResult
 * - 간단설명: 설치 tool 실행 결과
 */
export interface InstallResult {
  success: boolean
  message: string
}

function checkPkg(projectPath: string): { pkg: Record<string, unknown>; error?: string } {
  const pkgPath = path.join(projectPath, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    return { pkg: {}, error: `package.json을 찾을 수 없습니다: ${pkgPath}` }
  }
  return { pkg: JSON.parse(fs.readFileSync(pkgPath, 'utf-8') as string) }
}

function runPnpm(cmd: string, cwd: string): InstallResult {
  try {
    execSync(cmd, { cwd, stdio: 'pipe' })
    return { success: true, message: `실행 완료: ${cmd}` }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { success: false, message: `실행 실패: ${msg}` }
  }
}

const VITEST_PACKAGES = [
  'vitest@^4',
  '@testing-library/react@^16',
  '@testing-library/user-event@^14',
  '@testing-library/jest-dom@^6',
  'jsdom@^26',
]

/**
 * # installVitest
 * ---
 * - 간단설명: Vitest + @testing-library 패키지를 pnpm으로 설치한다
 * - 제약사항: projectPath에 package.json이 존재해야 함, pnpm 환경 필요
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 */
export async function installVitest(projectPath: string): Promise<InstallResult> {
  const { pkg, error } = checkPkg(projectPath)
  if (error) return { success: false, message: error }

  const allDeps = { ...(pkg.dependencies as object), ...(pkg.devDependencies as object) }
  if ('vitest' in allDeps) {
    return { success: true, message: 'Vitest가 이미 설치되어 있습니다. skip합니다.' }
  }

  const result = runPnpm(`pnpm add -D ${VITEST_PACKAGES.join(' ')}`, projectPath)
  if (result.success) {
    return { success: true, message: `Vitest 설치 완료:\n${VITEST_PACKAGES.join('\n')}` }
  }
  return result
}

/**
 * # installMsw
 * ---
 * - 간단설명: MSW 2.x를 pnpm으로 설치한다
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 */
export async function installMsw(projectPath: string): Promise<InstallResult> {
  const { pkg, error } = checkPkg(projectPath)
  if (error) return { success: false, message: error }

  const allDeps = { ...(pkg.dependencies as object), ...(pkg.devDependencies as object) }
  if ('msw' in allDeps) {
    return { success: true, message: 'MSW가 이미 설치되어 있습니다. skip합니다.' }
  }

  const result = runPnpm('pnpm add -D msw@^2', projectPath)
  if (result.success) {
    return { success: true, message: 'MSW 2.x 설치 완료' }
  }
  return result
}

/**
 * # installPlaywright
 * ---
 * - 간단설명: @playwright/test를 설치하고 Chromium 브라우저를 다운로드한다
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 */
export async function installPlaywright(projectPath: string): Promise<InstallResult> {
  const { pkg, error } = checkPkg(projectPath)
  if (error) return { success: false, message: error }

  const allDeps = { ...(pkg.dependencies as object), ...(pkg.devDependencies as object) }
  if ('@playwright/test' in allDeps) {
    return { success: true, message: 'Playwright가 이미 설치되어 있습니다. skip합니다.' }
  }

  const r1 = runPnpm('pnpm add -D @playwright/test@^1', projectPath)
  if (!r1.success) return r1

  const r2 = runPnpm('pnpm exec playwright install --with-deps chromium', projectPath)
  if (!r2.success) return r2

  return { success: true, message: 'Playwright 설치 완료 (Chromium 포함)' }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd ~/.claude/mcps/testing-setup && npm test
```

Expected: 9개 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
cd ~/.claude/mcps/testing-setup
git add tests/install.test.ts src/tools/install.ts
git commit -m "feat: install tools 구현 (installVitest, installMsw, installPlaywright) TDD"
```

---

### Task 3: configure tools 구현 (TDD)

**Files:**
- Create: `~/.claude/mcps/testing-setup/tests/configure.test.ts`
- Create: `~/.claude/mcps/testing-setup/src/tools/configure.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`~/.claude/mcps/testing-setup/tests/configure.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fs from 'node:fs'

vi.mock('node:fs')

import {
  configureVitest,
  configureMsw,
  configurePlaywright,
} from '../src/tools/configure.js'

describe('configureVitest', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await configureVitest('/invalid/path')

    expect(result.success).toBe(false)
    expect(result.message).toContain('package.json')
  })

  it('vitest.config.ts와 src/test/setup.ts를 생성한다', async () => {
    vi.mocked(fs.existsSync).mockImplementation((p) =>
      String(p).endsWith('package.json')
    )
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined)
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined)

    const result = await configureVitest('/project')

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
    expect(result.success).toBe(true)
  })

  it('overwrite=false이고 파일이 존재하면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const result = await configureVitest('/project', false)

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(result.message).toContain('skip')
  })
})

describe('configureMsw', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await configureMsw('/invalid/path')

    expect(result.success).toBe(false)
  })

  it('src/mocks/handlers.ts와 src/mocks/browser.ts를 생성한다', async () => {
    vi.mocked(fs.existsSync).mockImplementation((p) =>
      String(p).endsWith('package.json')
    )
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined)
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined)

    const result = await configureMsw('/project')

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
    expect(result.success).toBe(true)
  })

  it('overwrite=false이고 파일이 존재하면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const result = await configureMsw('/project', false)

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(result.message).toContain('skip')
  })
})

describe('configurePlaywright', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await configurePlaywright('/invalid/path')

    expect(result.success).toBe(false)
  })

  it('playwright.config.ts를 생성한다', async () => {
    vi.mocked(fs.existsSync).mockImplementation((p) =>
      String(p).endsWith('package.json')
    )
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined)

    const result = await configurePlaywright('/project')

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    expect(result.success).toBe(true)
  })

  it('overwrite=false이고 파일이 존재하면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const result = await configurePlaywright('/project', false)

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(result.message).toContain('skip')
  })
})
```

- [ ] **Step 2: 테스트 실행하여 실패 확인**

```bash
cd ~/.claude/mcps/testing-setup && npm test
```

Expected: `Cannot find module '../src/tools/configure.js'`

- [ ] **Step 3: configure.ts 구현**

`~/.claude/mcps/testing-setup/src/tools/configure.ts`:
```ts
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * # ConfigureResult
 * - 간단설명: 설정 파일 생성 결과
 */
export interface ConfigureResult {
  success: boolean
  message: string
}

// ── 파일 내용 상수 ──────────────────────────────────────────────

const VITEST_CONFIG = `import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
`

const VITEST_SETUP = `import '@testing-library/jest-dom'
`

const MSW_HANDLERS = `import { http, HttpResponse } from 'msw'

export const handlers = [
  // 예시: http.get('/api/items', () => HttpResponse.json([]))
]
`

const MSW_BROWSER = `import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
`

const PLAYWRIGHT_CONFIG = `import { defineConfig, devices } from '@playwright/test'

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
`

// ── 헬퍼 ──────────────────────────────────────────────────────

function hasPkgJson(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'package.json'))
}

function writeIfAllowed(
  files: Array<{ filePath: string; content: string }>,
  overwrite: boolean,
  label: string
): ConfigureResult {
  const firstExists = files.some(({ filePath }) => fs.existsSync(filePath))
  if (!overwrite && firstExists) {
    return {
      success: true,
      message: `${label} 파일이 이미 존재합니다. skip합니다. (overwrite: true로 덮어쓸 수 있습니다)`,
    }
  }
  for (const { filePath, content } of files) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, content, 'utf-8')
  }
  return {
    success: true,
    message: `생성 완료:\n${files.map((f) => `- ${f.filePath}`).join('\n')}`,
  }
}

// ── Tools ─────────────────────────────────────────────────────

/**
 * # configureVitest
 * ---
 * - 간단설명: vitest.config.ts와 src/test/setup.ts를 생성한다
 * - 제약사항: projectPath에 package.json이 존재해야 함
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 * @param overwrite - 기존 파일 덮어쓰기 여부 (기본값: false)
 */
export async function configureVitest(
  projectPath: string,
  overwrite = false
): Promise<ConfigureResult> {
  if (!hasPkgJson(projectPath)) {
    return { success: false, message: `package.json을 찾을 수 없습니다: ${projectPath}` }
  }
  return writeIfAllowed(
    [
      { filePath: path.join(projectPath, 'vitest.config.ts'), content: VITEST_CONFIG },
      { filePath: path.join(projectPath, 'src/test/setup.ts'), content: VITEST_SETUP },
    ],
    overwrite,
    'vitest.config.ts'
  )
}

/**
 * # configureMsw
 * ---
 * - 간단설명: src/mocks/handlers.ts와 src/mocks/browser.ts를 생성한다
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 * @param overwrite - 기존 파일 덮어쓰기 여부 (기본값: false)
 */
export async function configureMsw(
  projectPath: string,
  overwrite = false
): Promise<ConfigureResult> {
  if (!hasPkgJson(projectPath)) {
    return { success: false, message: `package.json을 찾을 수 없습니다: ${projectPath}` }
  }
  return writeIfAllowed(
    [
      { filePath: path.join(projectPath, 'src/mocks/handlers.ts'), content: MSW_HANDLERS },
      { filePath: path.join(projectPath, 'src/mocks/browser.ts'), content: MSW_BROWSER },
    ],
    overwrite,
    'src/mocks/handlers.ts'
  )
}

/**
 * # configurePlaywright
 * ---
 * - 간단설명: playwright.config.ts를 생성한다 (baseURL: http://localhost:5173, Chromium)
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 * @param overwrite - 기존 파일 덮어쓰기 여부 (기본값: false)
 */
export async function configurePlaywright(
  projectPath: string,
  overwrite = false
): Promise<ConfigureResult> {
  if (!hasPkgJson(projectPath)) {
    return { success: false, message: `package.json을 찾을 수 없습니다: ${projectPath}` }
  }
  return writeIfAllowed(
    [{ filePath: path.join(projectPath, 'playwright.config.ts'), content: PLAYWRIGHT_CONFIG }],
    overwrite,
    'playwright.config.ts'
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd ~/.claude/mcps/testing-setup && npm test
```

Expected: 9개 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
cd ~/.claude/mcps/testing-setup
git add tests/configure.test.ts src/tools/configure.ts
git commit -m "feat: configure tools 구현 (configureVitest, configureMsw, configurePlaywright) TDD"
```

---

### Task 4: MCP 서버 진입점 구현 및 빌드

**Files:**
- Create: `~/.claude/mcps/testing-setup/src/index.ts`

- [ ] **Step 1: index.ts 작성**

`~/.claude/mcps/testing-setup/src/index.ts`:
```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { installVitest, installMsw, installPlaywright } from './tools/install.js'
import { configureVitest, configureMsw, configurePlaywright } from './tools/configure.js'

const server = new McpServer({
  name: 'testing-setup',
  version: '1.0.0',
})

const projectPathSchema = z.string().describe('package.json이 있는 프로젝트 루트 경로')
const overwriteSchema = z.boolean().optional().describe('기존 파일 덮어쓰기 여부 (기본값: false)')

// ── Install tools ────────────────────────────────────────────

server.tool(
  'install_vitest',
  'Vitest + @testing-library/react + jsdom을 pnpm으로 설치한다',
  { projectPath: projectPathSchema },
  async ({ projectPath }) => {
    const r = await installVitest(projectPath)
    return { content: [{ type: 'text' as const, text: r.message }] }
  }
)

server.tool(
  'install_msw',
  'MSW 2.x를 pnpm으로 설치한다',
  { projectPath: projectPathSchema },
  async ({ projectPath }) => {
    const r = await installMsw(projectPath)
    return { content: [{ type: 'text' as const, text: r.message }] }
  }
)

server.tool(
  'install_playwright',
  '@playwright/test를 설치하고 Chromium 브라우저를 다운로드한다',
  { projectPath: projectPathSchema },
  async ({ projectPath }) => {
    const r = await installPlaywright(projectPath)
    return { content: [{ type: 'text' as const, text: r.message }] }
  }
)

// ── Configure tools ──────────────────────────────────────────

server.tool(
  'configure_vitest',
  'vitest.config.ts와 src/test/setup.ts를 생성한다',
  { projectPath: projectPathSchema, overwrite: overwriteSchema },
  async ({ projectPath, overwrite }) => {
    const r = await configureVitest(projectPath, overwrite)
    return { content: [{ type: 'text' as const, text: r.message }] }
  }
)

server.tool(
  'configure_msw',
  'src/mocks/handlers.ts와 src/mocks/browser.ts를 생성한다',
  { projectPath: projectPathSchema, overwrite: overwriteSchema },
  async ({ projectPath, overwrite }) => {
    const r = await configureMsw(projectPath, overwrite)
    return { content: [{ type: 'text' as const, text: r.message }] }
  }
)

server.tool(
  'configure_playwright',
  'playwright.config.ts를 생성한다 (baseURL: localhost:5173, Chromium)',
  { projectPath: projectPathSchema, overwrite: overwriteSchema },
  async ({ projectPath, overwrite }) => {
    const r = await configurePlaywright(projectPath, overwrite)
    return { content: [{ type: 'text' as const, text: r.message }] }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
```

- [ ] **Step 2: 빌드**

```bash
cd ~/.claude/mcps/testing-setup && npm run build
```

Expected: `dist/index.js` 생성, 에러 없음

- [ ] **Step 3: tool 목록 동작 확인**

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node ~/.claude/mcps/testing-setup/dist/index.js
```

Expected: `install_vitest`, `install_msw`, `install_playwright`, `configure_vitest`, `configure_msw`, `configure_playwright` 포함된 JSON 응답

- [ ] **Step 4: Claude Code에 MCP 등록**

`~/.claude/settings.json`에 `mcpServers` 항목 추가 (기존 내용 유지하며 병합):
```json
{
  "mcpServers": {
    "testing-setup": {
      "command": "node",
      "args": ["/Users/gobobin/.claude/mcps/testing-setup/dist/index.js"]
    }
  }
}
```

- [ ] **Step 5: 커밋**

```bash
cd ~/.claude/mcps/testing-setup
git add src/index.ts dist/
git commit -m "feat: MCP 서버 진입점 구현 및 빌드"
```
