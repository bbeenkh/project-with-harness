# Storybook Setup MCP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** React 19 + Vite 6 프로젝트에 Storybook 8을 자동으로 설치·설정해주는 전역 stdio MCP 서버 구현

**Architecture:** `@modelcontextprotocol/sdk` 기반 stdio MCP 서버. `install.ts`(설치 로직)와 `configure.ts`(파일 생성 로직)로 책임을 분리한다. 각 tool은 validate → execute → respond 패턴으로 동작한다.

**Tech Stack:** TypeScript 5.7, @modelcontextprotocol/sdk ^1.0, zod ^3, Node.js fs/child_process, Vitest ^2

---

## 파일 구조

```
~/.claude/mcps/storybook-setup/
├── src/
│   ├── index.ts            ← MCP 서버 진입점, tool 등록
│   └── tools/
│       ├── install.ts      ← installStorybook()
│       └── configure.ts    ← configureStorybook(), addStorybookScripts()
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
- Create: `~/.claude/mcps/storybook-setup/package.json`
- Create: `~/.claude/mcps/storybook-setup/tsconfig.json`
- Create: `~/.claude/mcps/storybook-setup/vitest.config.ts`

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p ~/.claude/mcps/storybook-setup/src/tools
mkdir -p ~/.claude/mcps/storybook-setup/tests
```

- [ ] **Step 2: package.json 생성**

`~/.claude/mcps/storybook-setup/package.json`:
```json
{
  "name": "storybook-setup",
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

`~/.claude/mcps/storybook-setup/tsconfig.json`:
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

`~/.claude/mcps/storybook-setup/vitest.config.ts`:
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
cd ~/.claude/mcps/storybook-setup && npm install
```

Expected: `node_modules` 생성

- [ ] **Step 6: 커밋**

```bash
cd ~/.claude/mcps/storybook-setup
git init && git add .
git commit -m "chore: storybook-setup MCP 프로젝트 초기화"
```

---

### Task 2: installStorybook tool (TDD)

**Files:**
- Create: `~/.claude/mcps/storybook-setup/tests/install.test.ts`
- Create: `~/.claude/mcps/storybook-setup/src/tools/install.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`~/.claude/mcps/storybook-setup/tests/install.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fs from 'node:fs'
import * as childProcess from 'node:child_process'

vi.mock('node:fs')
vi.mock('node:child_process')

import { installStorybook } from '../src/tools/install.js'

describe('installStorybook', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await installStorybook('/invalid/path')

    expect(result.success).toBe(false)
    expect(result.message).toContain('package.json')
  })

  it('storybook이 이미 설치되어 있으면 skip 메시지를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ devDependencies: { storybook: '^8.0.0' } })
    )

    const result = await installStorybook('/project')

    expect(result.success).toBe(true)
    expect(result.message).toContain('이미 설치')
    expect(childProcess.execSync).not.toHaveBeenCalled()
  })

  it('pnpm add -D로 storybook 패키지를 설치한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({}))
    vi.mocked(childProcess.execSync).mockReturnValue(Buffer.from(''))

    const result = await installStorybook('/project')

    expect(childProcess.execSync).toHaveBeenCalledWith(
      expect.stringContaining('pnpm add -D'),
      expect.objectContaining({ cwd: '/project' })
    )
    expect(result.success).toBe(true)
  })

  it('pnpm 명령 실패 시 에러 메시지를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({}))
    vi.mocked(childProcess.execSync).mockImplementation(() => {
      throw new Error('pnpm: command not found')
    })

    const result = await installStorybook('/project')

    expect(result.success).toBe(false)
    expect(result.message).toContain('pnpm: command not found')
  })
})
```

- [ ] **Step 2: 테스트 실행하여 실패 확인**

```bash
cd ~/.claude/mcps/storybook-setup && npm test
```

Expected: `Cannot find module '../src/tools/install.js'`

- [ ] **Step 3: install.ts 구현**

`~/.claude/mcps/storybook-setup/src/tools/install.ts`:
```ts
import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

/**
 * # InstallResult
 * - 간단설명: tool 실행 결과
 */
export interface InstallResult {
  success: boolean
  message: string
}

const STORYBOOK_PACKAGES = [
  'storybook@^8',
  '@storybook/react-vite@^8',
  '@storybook/react@^8',
  '@storybook/addon-essentials@^8',
]

/**
 * # installStorybook
 * ---
 * - 간단설명: 지정된 프로젝트에 Storybook 8 의존성을 pnpm으로 설치한다
 * - 제약사항: projectPath에 package.json이 존재해야 함
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 * ---
 * @example
 * const result = await installStorybook('/Users/foo/my-app/apps/frontend')
 */
export async function installStorybook(projectPath: string): Promise<InstallResult> {
  const pkgPath = path.join(projectPath, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    return { success: false, message: `package.json을 찾을 수 없습니다: ${pkgPath}` }
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8') as string)
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }

  if (allDeps['storybook']) {
    return { success: true, message: 'Storybook이 이미 설치되어 있습니다. skip합니다.' }
  }

  try {
    execSync(`pnpm add -D ${STORYBOOK_PACKAGES.join(' ')}`, {
      cwd: projectPath,
      stdio: 'pipe',
    })
    return {
      success: true,
      message: `Storybook 8 설치 완료:\n${STORYBOOK_PACKAGES.join('\n')}`,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { success: false, message: `설치 실패: ${msg}` }
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd ~/.claude/mcps/storybook-setup && npm test
```

Expected: 4개 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
cd ~/.claude/mcps/storybook-setup
git add tests/install.test.ts src/tools/install.ts
git commit -m "feat: installStorybook tool 구현 (TDD)"
```

---

### Task 3: configureStorybook & addStorybookScripts tool (TDD)

**Files:**
- Create: `~/.claude/mcps/storybook-setup/tests/configure.test.ts`
- Create: `~/.claude/mcps/storybook-setup/src/tools/configure.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`~/.claude/mcps/storybook-setup/tests/configure.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fs from 'node:fs'

vi.mock('node:fs')

import { configureStorybook, addStorybookScripts } from '../src/tools/configure.js'

describe('configureStorybook', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json이 없으면 에러를 반환한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const result = await configureStorybook('/invalid/path')

    expect(result.success).toBe(false)
    expect(result.message).toContain('package.json')
  })

  it('.storybook/main.ts와 .storybook/preview.tsx를 생성한다', async () => {
    vi.mocked(fs.existsSync).mockImplementation((p) =>
      String(p).endsWith('package.json')
    )
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined)
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined)

    const result = await configureStorybook('/project')

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
    expect(result.success).toBe(true)
  })

  it('overwrite=false이고 파일이 존재하면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const result = await configureStorybook('/project', false)

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(result.message).toContain('skip')
  })

  it('overwrite=true이면 기존 파일을 덮어쓴다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined)
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined)

    const result = await configureStorybook('/project', true)

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
    expect(result.success).toBe(true)
  })
})

describe('addStorybookScripts', () => {
  beforeEach(() => vi.resetAllMocks())

  it('package.json에 storybook 스크립트를 추가한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ scripts: {} }))
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined)

    const result = await addStorybookScripts('/project')

    const written = JSON.parse(vi.mocked(fs.writeFileSync).mock.calls[0][1] as string)
    expect(written.scripts.storybook).toBe('storybook dev -p 6006')
    expect(written.scripts['build-storybook']).toBe('storybook build')
    expect(result.success).toBe(true)
  })

  it('스크립트가 이미 존재하면 skip한다', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ scripts: { storybook: 'storybook dev -p 6006' } })
    )

    const result = await addStorybookScripts('/project')

    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(result.message).toContain('이미 존재')
  })
})
```

- [ ] **Step 2: 테스트 실행하여 실패 확인**

```bash
cd ~/.claude/mcps/storybook-setup && npm test
```

Expected: `Cannot find module '../src/tools/configure.js'`

- [ ] **Step 3: configure.ts 구현**

`~/.claude/mcps/storybook-setup/src/tools/configure.ts`:
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

const MAIN_TS = `import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
`

const PREVIEW_TSX = `import type { Preview } from '@storybook/react'

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
`

/**
 * # configureStorybook
 * ---
 * - 간단설명: .storybook/main.ts와 .storybook/preview.tsx 설정 파일을 생성한다
 * - 제약사항: projectPath에 package.json이 존재해야 함
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 * @param overwrite - 기존 파일 덮어쓰기 여부 (기본값: false)
 */
export async function configureStorybook(
  projectPath: string,
  overwrite = false
): Promise<ConfigureResult> {
  const pkgPath = path.join(projectPath, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    return { success: false, message: `package.json을 찾을 수 없습니다: ${pkgPath}` }
  }

  const storybookDir = path.join(projectPath, '.storybook')
  const mainPath = path.join(storybookDir, 'main.ts')
  const previewPath = path.join(storybookDir, 'preview.tsx')

  if (!overwrite && (fs.existsSync(mainPath) || fs.existsSync(previewPath))) {
    return {
      success: true,
      message: '설정 파일이 이미 존재합니다. skip합니다. (overwrite: true로 덮어쓸 수 있습니다)',
    }
  }

  fs.mkdirSync(storybookDir, { recursive: true })
  fs.writeFileSync(mainPath, MAIN_TS, 'utf-8')
  fs.writeFileSync(previewPath, PREVIEW_TSX, 'utf-8')

  return {
    success: true,
    message: '생성 완료:\n- .storybook/main.ts\n- .storybook/preview.tsx',
  }
}

/**
 * # addStorybookScripts
 * ---
 * - 간단설명: package.json의 scripts에 storybook, build-storybook 명령을 추가한다
 * ---
 * @param projectPath - package.json이 있는 프로젝트 루트 경로
 */
export async function addStorybookScripts(projectPath: string): Promise<ConfigureResult> {
  const pkgPath = path.join(projectPath, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    return { success: false, message: `package.json을 찾을 수 없습니다: ${pkgPath}` }
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8') as string)
  if (!pkg.scripts) pkg.scripts = {}

  if (pkg.scripts['storybook']) {
    return { success: true, message: 'storybook 스크립트가 이미 존재합니다.' }
  }

  pkg.scripts['storybook'] = 'storybook dev -p 6006'
  pkg.scripts['build-storybook'] = 'storybook build'
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')

  return {
    success: true,
    message: 'scripts 추가 완료:\n- "storybook": "storybook dev -p 6006"\n- "build-storybook": "storybook build"',
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd ~/.claude/mcps/storybook-setup && npm test
```

Expected: 6개 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
cd ~/.claude/mcps/storybook-setup
git add tests/configure.test.ts src/tools/configure.ts
git commit -m "feat: configureStorybook, addStorybookScripts tool 구현 (TDD)"
```

---

### Task 4: MCP 서버 진입점 구현 및 빌드

**Files:**
- Create: `~/.claude/mcps/storybook-setup/src/index.ts`

- [ ] **Step 1: index.ts 작성**

`~/.claude/mcps/storybook-setup/src/index.ts`:
```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { installStorybook } from './tools/install.js'
import { configureStorybook, addStorybookScripts } from './tools/configure.js'

const server = new McpServer({
  name: 'storybook-setup',
  version: '1.0.0',
})

server.tool(
  'install_storybook',
  '프론트엔드 프로젝트에 Storybook 8 의존성을 설치한다 (pnpm 사용)',
  { projectPath: z.string().describe('package.json이 있는 프로젝트 루트 경로') },
  async ({ projectPath }) => {
    const result = await installStorybook(projectPath)
    return { content: [{ type: 'text' as const, text: result.message }] }
  }
)

server.tool(
  'configure_storybook',
  '.storybook/main.ts와 .storybook/preview.tsx 설정 파일을 생성한다',
  {
    projectPath: z.string().describe('package.json이 있는 프로젝트 루트 경로'),
    overwrite: z.boolean().optional().describe('기존 파일 덮어쓰기 여부 (기본값: false)'),
  },
  async ({ projectPath, overwrite }) => {
    const result = await configureStorybook(projectPath, overwrite)
    return { content: [{ type: 'text' as const, text: result.message }] }
  }
)

server.tool(
  'add_storybook_scripts',
  'package.json의 scripts에 storybook, build-storybook 명령을 추가한다',
  { projectPath: z.string().describe('package.json이 있는 프로젝트 루트 경로') },
  async ({ projectPath }) => {
    const result = await addStorybookScripts(projectPath)
    return { content: [{ type: 'text' as const, text: result.message }] }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
```

- [ ] **Step 2: 빌드**

```bash
cd ~/.claude/mcps/storybook-setup && npm run build
```

Expected: `dist/index.js` 생성, 에러 없음

- [ ] **Step 3: tool 목록 동작 확인**

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node ~/.claude/mcps/storybook-setup/dist/index.js
```

Expected: `install_storybook`, `configure_storybook`, `add_storybook_scripts` 포함된 JSON 응답

- [ ] **Step 4: Claude Code에 MCP 등록**

`~/.claude/settings.json`에 `mcpServers` 항목 추가 (기존 내용 유지하며 병합):
```json
{
  "mcpServers": {
    "storybook-setup": {
      "command": "node",
      "args": ["/Users/gobobin/.claude/mcps/storybook-setup/dist/index.js"]
    }
  }
}
```

- [ ] **Step 5: 커밋**

```bash
cd ~/.claude/mcps/storybook-setup
git add src/index.ts dist/
git commit -m "feat: MCP 서버 진입점 구현 및 빌드"
```
