# Tailwind CSS + Vibrant Horizon 디자인 토큰 구현 계획 (LWPW-8)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** React 19 + Vite 6 프론트엔드에 Tailwind CSS v3를 설치하고 Vibrant Horizon 디자인 토큰을 `tailwind.config.js`에 전체 반영한다.

**Architecture:** Tailwind CSS v3를 PostCSS 플러그인으로 연동. `tailwind.config.js`에서 `theme.extend`로 Vibrant Horizon 토큰(컬러, 폰트, 스페이싱, border-radius)을 선언. Google Fonts를 `index.css`에서 import하여 Plus Jakarta Sans / Inter 폰트를 전역 적용.

**Tech Stack:** Tailwind CSS v3, PostCSS, Autoprefixer, Google Fonts (Plus Jakarta Sans, Inter)

---

## 파일 구조

| 파일 | 변경 유형 | 역할 |
|------|----------|------|
| `apps/frontend/postcss.config.js` | 생성 | PostCSS 플러그인(tailwindcss, autoprefixer) 등록 |
| `apps/frontend/tailwind.config.js` | 생성 | Vibrant Horizon 디자인 토큰 전체 정의 |
| `apps/frontend/src/index.css` | 생성 | Google Fonts import + Tailwind directives |
| `apps/frontend/src/main.tsx` | 수정 | index.css import 추가 |

---

### Task 1: 의존성 설치

**Files:**
- Modify: `apps/frontend/package.json` (자동)
- Modify: `pnpm-lock.yaml` (자동)

- [ ] **Step 1: tailwindcss v3, postcss, autoprefixer 설치**

```bash
pnpm -F frontend add -D tailwindcss@3 postcss autoprefixer
```

Expected output: 패키지가 `apps/frontend/node_modules`에 설치되고 `package.json` devDependencies에 추가됨.

- [ ] **Step 2: 설치 확인**

```bash
pnpm -F frontend exec tailwindcss --version
```

Expected output: `3.x.x` 형태의 버전 출력.

---

### Task 2: PostCSS 설정

**Files:**
- Create: `apps/frontend/postcss.config.js`

- [ ] **Step 1: postcss.config.js 생성**

`apps/frontend/postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/postcss.config.js
git commit -m "chore: PostCSS 설정 추가 (tailwindcss, autoprefixer)"
```

---

### Task 3: tailwind.config.js — content + 컬러 토큰

**Files:**
- Create: `apps/frontend/tailwind.config.js`

- [ ] **Step 1: tailwind.config.js 생성 — content + 전체 컬러 토큰**

`apps/frontend/tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006a62',
          container: '#00a699',
          fixed: '#7af7e8',
          'fixed-dim': '#5bdacc',
          on: '#ffffff',
          'on-container': '#00332f',
          'on-fixed': '#00201d',
          'on-fixed-variant': '#005049',
          inverse: '#5bdacc',
        },
        secondary: {
          DEFAULT: '#b52330',
          container: '#ff5a5f',
          fixed: '#ffdad8',
          'fixed-dim': '#ffb3b0',
          on: '#ffffff',
          'on-container': '#60000e',
          'on-fixed': '#410007',
          'on-fixed-variant': '#92001b',
        },
        tertiary: {
          DEFAULT: '#006874',
          container: '#44a1ae',
          fixed: '#97f0ff',
          'fixed-dim': '#7ad4e2',
          on: '#ffffff',
          'on-container': '#003339',
          'on-fixed': '#001f24',
          'on-fixed-variant': '#004f57',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          on: '#ffffff',
          'on-container': '#93000a',
        },
        surface: {
          DEFAULT: '#fbf9f8',
          dim: '#dbd9d9',
          bright: '#fbf9f8',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3f3',
          container: '#f0eded',
          'container-high': '#eae8e7',
          'container-highest': '#e4e2e2',
          variant: '#e4e2e2',
          tint: '#006a62',
          on: '#1b1c1c',
          'on-variant': '#3c4947',
          inverse: '#303030',
          'inverse-on': '#f2f0f0',
        },
        outline: {
          DEFAULT: '#6c7a77',
          variant: '#bbc9c6',
        },
        background: {
          DEFAULT: '#fbf9f8',
          on: '#1b1c1c',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: lint 확인**

```bash
pnpm lint
```

Expected output: 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/tailwind.config.js
git commit -m "feat: tailwind.config.js 생성 및 Vibrant Horizon 컬러 토큰 반영"
```

---

### Task 4: tailwind.config.js — 타이포그래피, 스페이싱, Border Radius 추가

**Files:**
- Modify: `apps/frontend/tailwind.config.js`

- [ ] **Step 1: theme.extend에 fontFamily, spacing, borderRadius 추가**

`apps/frontend/tailwind.config.js` 전체 파일을 아래로 교체:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006a62',
          container: '#00a699',
          fixed: '#7af7e8',
          'fixed-dim': '#5bdacc',
          on: '#ffffff',
          'on-container': '#00332f',
          'on-fixed': '#00201d',
          'on-fixed-variant': '#005049',
          inverse: '#5bdacc',
        },
        secondary: {
          DEFAULT: '#b52330',
          container: '#ff5a5f',
          fixed: '#ffdad8',
          'fixed-dim': '#ffb3b0',
          on: '#ffffff',
          'on-container': '#60000e',
          'on-fixed': '#410007',
          'on-fixed-variant': '#92001b',
        },
        tertiary: {
          DEFAULT: '#006874',
          container: '#44a1ae',
          fixed: '#97f0ff',
          'fixed-dim': '#7ad4e2',
          on: '#ffffff',
          'on-container': '#003339',
          'on-fixed': '#001f24',
          'on-fixed-variant': '#004f57',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          on: '#ffffff',
          'on-container': '#93000a',
        },
        surface: {
          DEFAULT: '#fbf9f8',
          dim: '#dbd9d9',
          bright: '#fbf9f8',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3f3',
          container: '#f0eded',
          'container-high': '#eae8e7',
          'container-highest': '#e4e2e2',
          variant: '#e4e2e2',
          tint: '#006a62',
          on: '#1b1c1c',
          'on-variant': '#3c4947',
          inverse: '#303030',
          'inverse-on': '#f2f0f0',
        },
        outline: {
          DEFAULT: '#6c7a77',
          variant: '#bbc9c6',
        },
        background: {
          DEFAULT: '#fbf9f8',
          on: '#1b1c1c',
        },
      },
      fontFamily: {
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        gutter: '16px',
        'margin-mobile': '20px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: lint 확인**

```bash
pnpm lint
```

Expected output: 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/tailwind.config.js
git commit -m "feat: Vibrant Horizon 타이포그래피·스페이싱·border-radius 토큰 반영"
```

---

### Task 5: index.css 생성 및 main.tsx 수정

**Files:**
- Create: `apps/frontend/src/index.css`
- Modify: `apps/frontend/src/main.tsx`

- [ ] **Step 1: index.css 생성**

`apps/frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: main.tsx에 index.css import 추가**

`apps/frontend/src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: lint 확인**

```bash
pnpm lint
```

Expected output: 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/src/index.css apps/frontend/src/main.tsx
git commit -m "feat: Google Fonts import 및 Tailwind directives 적용"
```

---

### Task 6: 동작 검증

**Files:**
- Modify: `apps/frontend/src/App.tsx` (임시 검증용 — 커밋하지 않음)

- [ ] **Step 1: 개발 서버 실행**

```bash
pnpm -F frontend dev
```

Expected output: `Local: http://localhost:5173/` 출력, 에러 없음.

- [ ] **Step 2: App.tsx를 임시로 수정하여 토큰 적용 확인**

`apps/frontend/src/App.tsx`를 아래로 교체:
```tsx
export default function App() {
  return (
    <div className="p-md bg-surface font-inter">
      <h1 className="text-2xl font-bold font-plus-jakarta text-primary-container">
        Vibrant Horizon
      </h1>
      <p className="mt-sm text-surface-on text-body-md">
        Primary container: #00a699 (Sky Blue)
      </p>
      <button className="mt-md px-md py-sm bg-secondary-container text-secondary-on rounded-md font-inter font-semibold">
        Book Now (Coral)
      </button>
    </div>
  )
}
```

- [ ] **Step 3: 브라우저에서 확인**

`http://localhost:5173` 접속 후 아래 항목 확인:
- 제목이 Sky Blue (`#00a699`) 색으로 표시됨
- 버튼이 Coral (`#ff5a5f`) 배경으로 표시됨
- Plus Jakarta Sans 폰트가 제목에 적용됨 (브라우저 DevTools → Computed → font-family 확인)
- 버튼에 `border-radius: 12px`이 적용됨 (DevTools → Computed → border-radius 확인)

- [ ] **Step 4: App.tsx 원복**

```tsx
export default function App() {
  return <h1>Hello from React + Vite</h1>
}
```

- [ ] **Step 5: 최종 커밋**

```bash
git add apps/frontend/src/App.tsx
git commit -m "chore: 검증용 임시 코드 원복"
```

---

### Task 7: Jira 티켓 상태 업데이트

- [ ] **Step 1: LWPW-8 티켓 상태를 "검토중"으로 변경**

Jira MCP를 사용하여 LWPW-8 티켓 상태를 "In Review" 또는 "검토중"으로 전환.
