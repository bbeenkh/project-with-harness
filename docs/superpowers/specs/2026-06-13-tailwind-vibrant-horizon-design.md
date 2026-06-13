# Tailwind CSS 설치 및 Vibrant Horizon 디자인 토큰 설정 (LWPW-8)

## 개요

React 19 + Vite 6 프론트엔드에 Tailwind CSS v3를 설치하고, Vibrant Horizon 디자인 시스템의 토큰을 `tailwind.config.js`에 전체 반영한다.

---

## 범위

- `tailwindcss@3`, `postcss`, `autoprefixer` 설치
- `postcss.config.js` 생성
- `tailwind.config.js` 생성 (디자인 토큰 전체 반영)
- `src/index.css` 생성 (Google Fonts + Tailwind directives)
- `src/main.tsx` 수정 (index.css import)

---

## 파일 목록

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `apps/frontend/postcss.config.js` | 생성 | PostCSS 플러그인 등록 |
| `apps/frontend/tailwind.config.js` | 생성 | 디자인 토큰 전체 정의 |
| `apps/frontend/src/index.css` | 생성 | Google Fonts + Tailwind directives |
| `apps/frontend/src/main.tsx` | 수정 | `index.css` import 추가 |

---

## 의존성

```bash
pnpm -F frontend add -D tailwindcss@3 postcss autoprefixer
```

---

## 설계 상세

### postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### tailwind.config.js

#### content

```js
content: ['./index.html', './src/**/*.{ts,tsx}']
```

#### 컬러 토큰 (Vibrant Horizon 전체 팔레트)

Stitch 디자인 시스템 기준. `theme.extend.colors`에 추가.

```
primary
  DEFAULT: #006a62
  container: #00a699   (Sky Blue — 브랜드 메인 컬러)
  fixed: #7af7e8
  fixed-dim: #5bdacc
  on: #ffffff
  on-container: #00332f
  on-fixed: #00201d
  on-fixed-variant: #005049
  inverse: #5bdacc

secondary
  DEFAULT: #b52330
  container: #ff5a5f   (Coral — CTA/Urgent 컬러)
  fixed: #ffdad8
  fixed-dim: #ffb3b0
  on: #ffffff
  on-container: #60000e
  on-fixed: #410007
  on-fixed-variant: #92001b

tertiary
  DEFAULT: #006874
  container: #44a1ae
  fixed: #97f0ff
  fixed-dim: #7ad4e2
  on: #ffffff
  on-container: #003339
  on-fixed: #001f24
  on-fixed-variant: #004f57

error
  DEFAULT: #ba1a1a
  container: #ffdad6
  on: #ffffff
  on-container: #93000a

surface
  DEFAULT: #fbf9f8
  dim: #dbd9d9
  bright: #fbf9f8
  container-lowest: #ffffff
  container-low: #f5f3f3
  container: #f0eded
  container-high: #eae8e7
  container-highest: #e4e2e2
  variant: #e4e2e2
  tint: #006a62
  on: #1b1c1c
  on-variant: #3c4947
  inverse: #303030
  inverse-on: #f2f0f0

outline
  DEFAULT: #6c7a77
  variant: #bbc9c6

background
  DEFAULT: #fbf9f8
  on: #1b1c1c
```

#### 타이포그래피

```
fontFamily:
  plus-jakarta: ["Plus Jakarta Sans", "sans-serif"]
  inter: ["Inter", "sans-serif"]
```

| 토큰 | fontFamily | fontSize | fontWeight | lineHeight | letterSpacing |
|------|-----------|----------|------------|------------|---------------|
| display-lg | Plus Jakarta Sans | 36px | 700 | 1.2 | -0.02em |
| headline-lg | Plus Jakarta Sans | 28px | 700 | 1.3 | — |
| headline-lg-mobile | Plus Jakarta Sans | 24px | 700 | 1.3 | — |
| headline-md | Plus Jakarta Sans | 20px | 600 | 1.4 | — |
| body-lg | Inter | 18px | 400 | 1.6 | — |
| body-md | Inter | 16px | 400 | 1.6 | — |
| body-sm | Inter | 14px | 400 | 1.5 | — |
| label-md | Inter | 14px | 600 | 1.2 | 0.01em |
| label-sm | Inter | 12px | 500 | 1.2 | — |

> fontSize / lineHeight 값은 Tailwind 기본값과 중복되지 않도록 네임스페이스 처리.

#### 스페이싱 (8px 그리드)

`theme.extend.spacing`에 추가.

| 토큰 | 값 |
|------|-----|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| gutter | 16px |
| margin-mobile | 20px |

#### Border Radius

`theme.extend.borderRadius`에 추가 (Tailwind 기본값 대체).

| 토큰 | 값 |
|------|-----|
| sm | 4px |
| DEFAULT | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| full | 9999px |

---

### src/index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/main.tsx 변경

```tsx
import './index.css'   // 추가
```

---

## 완료 기준

- `tailwind.config.js`에 Vibrant Horizon 디자인 토큰 전체 반영
- `pnpm -F frontend dev` 실행 시 Tailwind 클래스 적용 확인 가능
- 색상 토큰이 브라우저에서 올바르게 렌더링됨
