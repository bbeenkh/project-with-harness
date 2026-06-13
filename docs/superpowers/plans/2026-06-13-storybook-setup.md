# Storybook 연동 및 환경 세팅 (LWPW-34) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `apps/frontend/` (React 19 + Vite 6 + Tailwind CSS)에 Storybook 8을 설치·구성하여 FSD 구조의 컴포넌트 스토리를 작성할 수 있는 환경을 만든다.

**Architecture:** storybook-setup MCP tool 3개(install → configure → add_scripts)를 순서대로 실행하고, `preview.tsx`에 Tailwind CSS import를 수동으로 추가한다. 스토리 파일은 FSD 컴포넌트 옆에 `*.stories.tsx`로 배치한다.

**Tech Stack:** Storybook 8, @storybook/react-vite, @storybook/addon-essentials, React 19, Vite 6, Tailwind CSS 3

---

## 파일 구조

```
apps/frontend/
├── .storybook/
│   ├── main.ts          ← MCP configure_storybook 생성 (story glob, framework, addons)
│   └── preview.tsx      ← MCP configure_storybook 생성 → Tailwind import 수동 추가
├── src/
│   └── shared/ui/
│       └── Button/
│           ├── Button.tsx           ← 샘플 컴포넌트
│           └── Button.stories.tsx   ← 샘플 스토리
└── package.json         ← storybook, build-storybook 스크립트 추가
```

---

### Task 1: Storybook 의존성 설치

**Files:**
- Modify: `apps/frontend/package.json` (devDependencies 자동 추가됨)

- [ ] **Step 1: install_storybook MCP tool 실행**

`install_storybook` tool 호출:
- `projectPath`: `/Users/gobobin/projects/project-with-harness/apps/frontend`

Expected: `Storybook 8 설치 완료` 메시지, 아래 패키지가 devDependencies에 추가됨:
- `storybook@^8`
- `@storybook/react-vite@^8`
- `@storybook/react@^8`
- `@storybook/addon-essentials@^8`

- [ ] **Step 2: 설치 확인**

```bash
cat apps/frontend/package.json | grep -E "storybook|@storybook"
```

Expected: 4개 패키지가 devDependencies에 존재

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/package.json apps/frontend/package-lock.json
git commit -m "chore: Storybook 8 의존성 설치"
```

---

### Task 2: Storybook 설정 파일 생성

**Files:**
- Create: `apps/frontend/.storybook/main.ts`
- Create: `apps/frontend/.storybook/preview.tsx`

- [ ] **Step 1: configure_storybook MCP tool 실행**

`configure_storybook` tool 호출:
- `projectPath`: `/Users/gobobin/projects/project-with-harness/apps/frontend`
- `overwrite`: `false`

Expected: `생성 완료: .storybook/main.ts, .storybook/preview.tsx` 메시지

- [ ] **Step 2: 생성된 main.ts 확인**

```bash
cat apps/frontend/.storybook/main.ts
```

Expected: 아래 내용 포함
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

- [ ] **Step 3: preview.tsx에 Tailwind import 추가**

`apps/frontend/.storybook/preview.tsx`를 읽어서 파일 상단에 `import '../src/index.css'`를 추가한다.

최종 파일 내용:
```tsx
import '../src/index.css'
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

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/.storybook/
git commit -m "feat: Storybook 설정 파일 생성 및 Tailwind 연동"
```

---

### Task 3: package.json 스크립트 추가

**Files:**
- Modify: `apps/frontend/package.json`

- [ ] **Step 1: add_storybook_scripts MCP tool 실행**

`add_storybook_scripts` tool 호출:
- `projectPath`: `/Users/gobobin/projects/project-with-harness/apps/frontend`

Expected: `scripts 추가 완료` 메시지

- [ ] **Step 2: 스크립트 확인**

```bash
cat apps/frontend/package.json | grep -E "storybook|build-storybook"
```

Expected:
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/package.json
git commit -m "chore: Storybook 스크립트 추가"
```

---

### Task 4: 샘플 스토리 작성 및 동작 확인

**Files:**
- Create: `apps/frontend/src/shared/ui/Button/Button.tsx`
- Create: `apps/frontend/src/shared/ui/Button/Button.stories.tsx`

- [ ] **Step 1: Button 컴포넌트 생성**

`apps/frontend/src/shared/ui/Button/Button.tsx`:
```tsx
/**
 * # Button
 * ---
 * - 간단설명: 기본 버튼 컴포넌트
 * ---
 * @param children - 버튼 내부 텍스트
 * @param onClick - 클릭 핸들러
 * @param variant - 버튼 스타일 변형
 * ---
 * @example
 * <Button variant="primary" onClick={() => {}}>확인</Button>
 */
export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const base = 'px-4 py-2 rounded font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  }
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Button 스토리 생성**

`apps/frontend/src/shared/ui/Button/Button.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: '확인',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: '취소',
    variant: 'secondary',
  },
}
```

- [ ] **Step 3: Storybook 실행 확인**

```bash
pnpm -F frontend storybook
```

Expected: `http://localhost:6006` 에서 Storybook UI 열림, "Shared/UI/Button" 스토리 표시, Tailwind 스타일 적용됨

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/src/shared/ui/Button/
git commit -m "feat: Button 샘플 컴포넌트 및 스토리 추가"
```

---

### Task 5: 루트 스크립트 통합 (선택)

**Files:**
- Modify: `package.json` (루트)

- [ ] **Step 1: 루트 package.json에 storybook 스크립트 추가 여부 확인**

```bash
cat package.json | grep storybook
```

- [ ] **Step 2: 없으면 루트에 추가**

루트 `package.json`의 `scripts`에 추가:
```json
"storybook": "pnpm -F frontend storybook"
```

- [ ] **Step 3: 커밋**

```bash
git add package.json
git commit -m "chore: 루트에 storybook 스크립트 통합"
```
