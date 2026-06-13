# 기본 UI 컴포넌트 제작 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 여행 예약 앱 3개 스크린에 필요한 9개 기본 UI 컴포넌트를 `shared/ui/primitive/`에 추가하고 Vibrant Horizon 디자인 시스템 스타일을 적용한다.

**Architecture:** component-installer MCP로 headless 컴포넌트를 `shared/ui/primitive/` 각 폴더에 설치한 뒤, 설치된 파일의 className을 Vibrant Horizon 토큰(Tailwind 클래스)으로 override한다. Chip은 직접 제작한다. Spinner는 SVGR + SVG assets 방식을 사용한다.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS 3, Vitest, @testing-library/react, vite-plugin-svgr, component-installer MCP

---

## 파일 구조

```
apps/frontend/
├── vite.config.ts                          (수정 — svgr 플러그인 추가)
├── src/
│   ├── vite-env.d.ts                       (수정 — SVG 타입 선언 추가)
│   └── shared/
│       ├── assets/
│       │   └── icons/
│       │       └── spinner.svg             (신규)
│       └── ui/
│           ├── Button/ → 삭제
│           └── primitive/
│               ├── Button/
│               │   ├── Button.tsx          (MCP 설치 후 스타일 override)
│               │   └── Button.test.tsx     (신규)
│               ├── Card/
│               │   ├── Card.tsx            (MCP 설치 후 스타일 override)
│               │   └── Card.test.tsx       (신규)
│               ├── Input/
│               │   ├── Input.tsx           (MCP 설치 후 스타일 override)
│               │   └── Input.test.tsx      (신규)
│               ├── Modal/
│               │   ├── Modal.tsx           (MCP 설치 후 스타일 override)
│               │   └── Modal.test.tsx      (신규)
│               ├── Skeleton/
│               │   ├── Skeleton.tsx        (MCP 설치 후 스타일 override)
│               │   └── Skeleton.test.tsx   (신규)
│               ├── Spinner/
│               │   ├── Spinner.tsx         (MCP 설치 후 SVG 경로 + 스타일 수정)
│               │   └── Spinner.test.tsx    (신규)
│               ├── Toast/
│               │   ├── Toast.tsx           (MCP 설치 후 스타일 override)
│               │   └── Toast.test.tsx      (신규)
│               ├── Separator/
│               │   ├── Separator.tsx       (MCP 설치 후 스타일 override)
│               │   └── Separator.test.tsx  (신규)
│               ├── Chip/
│               │   ├── Chip.tsx            (직접 제작)
│               │   └── Chip.test.tsx       (신규)
│               └── index.ts                (신규 — 전체 export)
```

---

## Task 1: SVGR 환경 설정

**Files:**
- Modify: `apps/frontend/package.json`
- Modify: `apps/frontend/vite.config.ts`
- Modify: `apps/frontend/src/vite-env.d.ts`

- [ ] **Step 1: vite-plugin-svgr 설치**

```bash
cd apps/frontend
pnpm add -D vite-plugin-svgr
```

Expected: `vite-plugin-svgr` devDependency 추가됨

- [ ] **Step 2: vite.config.ts에 SVGR 플러그인 추가**

`apps/frontend/vite.config.ts`를 다음으로 교체:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
})
```

- [ ] **Step 3: SVG 타입 선언 추가**

`apps/frontend/src/vite-env.d.ts`에 다음 추가 (기존 내용 아래):

```ts
declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'
  const ReactComponent: FC<SVGProps<SVGSVGElement>>
  export default ReactComponent
}
```

- [ ] **Step 4: 빌드 확인**

```bash
cd apps/frontend
pnpm build
```

Expected: 빌드 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/vite.config.ts apps/frontend/src/vite-env.d.ts apps/frontend/package.json pnpm-lock.yaml
git commit -m "feat: SVGR 플러그인 설정 추가 (LWPW-33)"
```

---

## Task 2: 기존 Button 삭제 및 primitive 폴더 생성

**Files:**
- Delete: `apps/frontend/src/shared/ui/Button/`
- Create: `apps/frontend/src/shared/ui/primitive/` (디렉터리)
- Create: `apps/frontend/src/shared/assets/icons/` (디렉터리)

- [ ] **Step 1: 기존 Button 디렉터리 삭제**

```bash
rm -rf apps/frontend/src/shared/ui/Button
```

- [ ] **Step 2: primitive 및 assets 폴더 생성**

```bash
mkdir -p apps/frontend/src/shared/ui/primitive
mkdir -p apps/frontend/src/shared/assets/icons
```

- [ ] **Step 3: Spinner SVG 파일 추가**

`apps/frontend/src/shared/assets/icons/spinner.svg` 생성:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="10"/>
</svg>
```

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/src/shared/assets/icons/spinner.svg
git commit -m "feat: primitive 폴더 구성 및 spinner SVG 추가 (LWPW-33)"
```

---

## Task 3: component-installer로 컴포넌트 설치

component-installer MCP의 `add_component` 도구를 사용해 아래 8개 컴포넌트를 순서대로 설치한다.
`target_dir`: `/Users/gobobin/projects/project-with-harness/apps/frontend/src/shared/ui/primitive`

설치 순서:
1. `Button`
2. `CardUI`
3. `Input`
4. `Modal`
5. `Skeleton`
6. `Spinner`
7. `Toast`
8. `Separator`

- [ ] **Step 1: 8개 컴포넌트 설치 (MCP 순차 호출)**

각 컴포넌트를 `add_component` 도구로 설치한다.

- [ ] **Step 2: 설치된 파일 구조 확인**

```bash
find apps/frontend/src/shared/ui/primitive -type f | sort
```

Expected: 각 컴포넌트 폴더 및 `.tsx` 파일들이 존재함

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive
git commit -m "feat: component-installer로 기본 UI 컴포넌트 설치 (LWPW-33)"
```

---

## Task 4: Button 스타일 override + 테스트

**Vibrant Horizon Button 스펙:**
- `primary`: bg `#00A699`, text white, rounded-xl (12px), hover `#006A62`
- `action`: bg `#FF5A5F`, text white, rounded-xl, hover opacity-90
- `ghost`: border `#00A699`, text `#00A699`, bg transparent, hover bg `#E0F4F2`
- 폰트: Inter, font-weight 600 (label-md)

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/Button/Button.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Button/Button.test.tsx`

- [ ] **Step 1: 테스트 작성**

`apps/frontend/src/shared/ui/primitive/Button/Button.test.tsx` 생성:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button 컴포넌트', () => {
  it('children 텍스트가 렌더링된다', () => {
    render(<Button>확인</Button>)
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
  })

  it('variant=primary일 때 primary 스타일이 적용된다', () => {
    render(<Button variant="primary">확인</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[#00A699]')
  })

  it('variant=action일 때 action 스타일이 적용된다', () => {
    render(<Button variant="action">예약</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[#FF5A5F]')
  })

  it('variant=ghost일 때 ghost 스타일이 적용된다', () => {
    render(<Button variant="ghost">취소</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-[#00A699]')
  })

  it('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>클릭</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('variant 미지정 시 primary가 기본값이다', () => {
    render(<Button>기본</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[#00A699]')
  })

  it('disabled 상태에서 클릭해도 onClick이 호출되지 않는다', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>비활성</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
cd apps/frontend
pnpm vitest run src/shared/ui/primitive/Button/Button.test.tsx
```

Expected: FAIL (설치된 Button이 Vibrant Horizon 클래스를 아직 갖지 않음)

- [ ] **Step 3: Button.tsx 스타일 override**

설치된 `Button.tsx`를 읽은 뒤, variant prop과 Vibrant Horizon className을 적용하도록 수정한다.
설치된 파일 구조와 무관하게, 최종 파일은 아래 스펙을 만족해야 한다:

```tsx
import type { ReactNode, ButtonHTMLAttributes } from 'react'

/**
 * # ButtonVariant
 * - primary = 메인 액션 버튼 (스카이블루)
 * - action = 긴급/예약 버튼 (코랄)
 * - ghost = 보조 버튼 (투명 배경)
 */
export type ButtonVariant = 'primary' | 'action' | 'ghost'

/**
 * # Button
 * ---
 * - 간단설명: Vibrant Horizon 디자인 시스템 기반 버튼 컴포넌트
 * - 제약사항: variant 미지정 시 primary 적용
 * ---
 * @param children - 버튼 내부 콘텐츠
 * @param variant - 버튼 스타일 (primary | action | ghost)
 * @param onClick - 클릭 핸들러
 * ---
 * @example
 * <Button variant="action" onClick={handleBook}>지금 예약</Button>
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base =
    'px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed'
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#00A699] text-white hover:bg-[#006A62]',
    action: 'bg-[#FF5A5F] text-white hover:opacity-90',
    ghost: 'border border-[#00A699] text-[#00A699] bg-transparent hover:bg-[#E0F4F2]',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Button/Button.test.tsx
```

Expected: 7개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Button/
git commit -m "feat: Button primitive Vibrant Horizon 스타일 적용 (LWPW-33)"
```

---

## Task 5: Card 스타일 override + 테스트

**Vibrant Horizon Card 스펙:**
- bg white, rounded-2xl (16px), shadow `0px 4px 12px rgba(0,0,0,0.05)`, p-4
- Card.Header / Card.Title / Card.Body / Card.Footer 서브컴포넌트 지원

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/CardUI/CardUI.tsx` (또는 설치된 파일명)
- Create: `apps/frontend/src/shared/ui/primitive/CardUI/Card.test.tsx`

- [ ] **Step 1: 테스트 작성**

설치된 Card 컴포넌트 파일명을 확인한 뒤, `Card.test.tsx` 생성:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './CardUI'

describe('Card 컴포넌트', () => {
  it('children이 렌더링된다', () => {
    render(<Card><p>내용</p></Card>)
    expect(screen.getByText('내용')).toBeInTheDocument()
  })

  it('Card에 Vibrant Horizon 카드 스타일이 적용된다', () => {
    const { container } = render(<Card>카드</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-2xl')
  })

  it('CardHeader가 렌더링된다', () => {
    render(<Card><CardHeader>헤더</CardHeader></Card>)
    expect(screen.getByText('헤더')).toBeInTheDocument()
  })

  it('CardTitle이 렌더링된다', () => {
    render(<Card><CardTitle>제주도 여행</CardTitle></Card>)
    expect(screen.getByText('제주도 여행')).toBeInTheDocument()
  })

  it('CardContent가 렌더링된다', () => {
    render(<Card><CardContent>상세 내용</CardContent></Card>)
    expect(screen.getByText('상세 내용')).toBeInTheDocument()
  })

  it('CardFooter가 렌더링된다', () => {
    render(<Card><CardFooter>₩120,000</CardFooter></Card>)
    expect(screen.getByText('₩120,000')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/CardUI/Card.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Card 스타일 override**

설치된 CardUI 파일을 읽은 뒤, 루트 Card 요소의 className에 아래를 적용:

```
bg-white rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-4
```

JsDoc을 컴포넌트 위에 추가:

```tsx
/**
 * # Card
 * ---
 * - 간단설명: 여행지·숙소 정보를 담는 카드 컨테이너
 * - 제약사항: 이미지는 상단 정렬, top-radius bleed 없음
 * ---
 * @example
 * <Card>
 *   <CardHeader><CardTitle>제주 신라호텔</CardTitle></CardHeader>
 *   <CardContent>해변 뷰 객실</CardContent>
 *   <CardFooter>₩250,000 / 박</CardFooter>
 * </Card>
 */
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/CardUI/Card.test.tsx
```

Expected: 6개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/CardUI/
git commit -m "feat: Card primitive Vibrant Horizon 스타일 적용 (LWPW-33)"
```

---

## Task 6: Input 스타일 override + 테스트

**Vibrant Horizon Input 스펙:**
- 기본: bg `#F7F7F7`, border-transparent, rounded-xl
- 포커스: border-`#00A699`
- prefix/suffix 슬롯 지원

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/Input/Input.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Input/Input.test.tsx`

- [ ] **Step 1: 테스트 작성**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Input from './Input'

describe('Input 컴포넌트', () => {
  it('placeholder가 렌더링된다', () => {
    render(<Input placeholder="여행지 검색" />)
    expect(screen.getByPlaceholderText('여행지 검색')).toBeInTheDocument()
  })

  it('기본 배경 스타일이 적용된다', () => {
    render(<Input placeholder="검색" />)
    const input = screen.getByPlaceholderText('검색')
    expect(input).toHaveClass('bg-[#F7F7F7]')
  })

  it('입력값 변경 시 onChange가 호출된다', () => {
    const handleChange = vi.fn()
    render(<Input placeholder="검색" onChange={handleChange} />)
    fireEvent.change(screen.getByPlaceholderText('검색'), { target: { value: '제주' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('onEnter 콜백이 Enter 키 입력 시 호출된다', () => {
    const handleEnter = vi.fn()
    render(<Input placeholder="검색" onEnter={handleEnter} />)
    fireEvent.keyDown(screen.getByPlaceholderText('검색'), { key: 'Enter' })
    expect(handleEnter).toHaveBeenCalled()
  })

  it('disabled 상태가 적용된다', () => {
    render(<Input placeholder="검색" disabled />)
    expect(screen.getByPlaceholderText('검색')).toBeDisabled()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Input/Input.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Input 스타일 override**

설치된 Input 파일을 읽은 뒤, input 엘리먼트의 className에 다음을 적용:

```
bg-[#F7F7F7] border border-transparent rounded-xl px-4 py-2 text-[#1B1C1C] text-sm
focus:outline-none focus:border-[#00A699] transition-colors
disabled:opacity-50 disabled:cursor-not-allowed
```

JsDoc 추가:

```tsx
/**
 * # Input
 * ---
 * - 간단설명: 검색바 및 예약 폼에 사용하는 텍스트 입력 필드
 * - 제약사항: 포커스 시 #00A699 테두리 표시, 기본 상태는 테두리 없음
 * ---
 * @param placeholder - 플레이스홀더 텍스트
 * @param onEnter - Enter 키 입력 시 호출되는 콜백
 * ---
 * @example
 * <Input placeholder="여행지를 검색하세요" onEnter={handleSearch} />
 */
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Input/Input.test.tsx
```

Expected: 5개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Input/
git commit -m "feat: Input primitive Vibrant Horizon 스타일 적용 (LWPW-33)"
```

---

## Task 7: Modal 스타일 override + 테스트

**Vibrant Horizon Modal/Bottom Sheet 스펙:**
- 모바일: 하단 슬라이드업, top-radius 24px
- 오버레이: `rgba(0,0,0,0.4)`
- 콘텐츠: bg-white, rounded-t-3xl (24px)

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/Modal/Modal.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Modal/Modal.test.tsx`

- [ ] **Step 1: 테스트 작성**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Modal from './Modal'

describe('Modal 컴포넌트', () => {
  it('open=true일 때 children이 렌더링된다', () => {
    render(<Modal open onClose={vi.fn()}>모달 내용</Modal>)
    expect(screen.getByText('모달 내용')).toBeInTheDocument()
  })

  it('open=false일 때 children이 렌더링되지 않는다', () => {
    render(<Modal open={false} onClose={vi.fn()}>모달 내용</Modal>)
    expect(screen.queryByText('모달 내용')).not.toBeInTheDocument()
  })

  it('오버레이 클릭 시 onClose가 호출된다', () => {
    const handleClose = vi.fn()
    render(<Modal open onClose={handleClose}>내용</Modal>)
    const overlay = document.querySelector('[data-testid="modal-overlay"]')
    if (overlay) fireEvent.click(overlay)
    expect(handleClose).toHaveBeenCalled()
  })

  it('title이 있으면 렌더링된다', () => {
    render(<Modal open onClose={vi.fn()} title="날짜 선택">내용</Modal>)
    expect(screen.getByText('날짜 선택')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Modal/Modal.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Modal 스타일 override**

설치된 Modal 파일을 읽은 뒤, 오버레이/콘텐츠 className을 수정한다.
`data-testid="modal-overlay"` 속성을 오버레이 엘리먼트에 추가한다.

오버레이: `fixed inset-0 bg-black/40 flex items-end justify-center z-50`
콘텐츠: `bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto p-6`

JsDoc 추가:

```tsx
/**
 * # Modal
 * ---
 * - 간단설명: 모바일 Bottom Sheet / 데스크탑 다이얼로그 역할의 모달
 * - 제약사항: 모바일에서 하단 슬라이드업, 최대 높이 90vh
 * ---
 * @param open - 모달 열림 여부
 * @param onClose - 닫기 핸들러 (오버레이 클릭 시 호출)
 * @param title - 모달 상단 타이틀 (선택)
 * ---
 * @example
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="날짜 선택">
 *   <DatePicker />
 * </Modal>
 */
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Modal/Modal.test.tsx
```

Expected: 4개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Modal/
git commit -m "feat: Modal primitive Bottom Sheet 스타일 적용 (LWPW-33)"
```

---

## Task 8: Skeleton 스타일 override + 테스트

**Vibrant Horizon Skeleton 스펙:**
- 플레이스홀더 bg: `#E4E2E2` (surface-container-highest), animate-pulse
- Skeleton.Box: 직사각형, Skeleton.Circle: 원형

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/Skeleton/Skeleton.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Skeleton/Skeleton.test.tsx`

- [ ] **Step 1: 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Skeleton from './Skeleton'

describe('Skeleton 컴포넌트', () => {
  it('Skeleton.Box가 렌더링된다', () => {
    const { container } = render(<Skeleton.Box width="100%" height="120px" />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('animate-pulse')
    expect(el).toHaveClass('bg-[#E4E2E2]')
  })

  it('Skeleton.Circle이 렌더링된다', () => {
    const { container } = render(<Skeleton.Circle size="48px" />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('rounded-full')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Skeleton/Skeleton.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Skeleton 스타일 override**

설치된 Skeleton 파일을 읽은 뒤, Box와 Circle의 className에 아래를 적용:

Box: `animate-pulse bg-[#E4E2E2] rounded-lg`
Circle: `animate-pulse bg-[#E4E2E2] rounded-full`

JsDoc 추가:

```tsx
/**
 * # Skeleton
 * ---
 * - 간단설명: 데이터 로딩 중 콘텐츠 위치를 표시하는 플레이스홀더
 * ---
 * @example
 * <Skeleton.Box width="100%" height="120px" />
 * <Skeleton.Circle size="48px" />
 */
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Skeleton/Skeleton.test.tsx
```

Expected: 2개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Skeleton/
git commit -m "feat: Skeleton primitive Vibrant Horizon 스타일 적용 (LWPW-33)"
```

---

## Task 9: Spinner 스타일 override + 테스트

**Vibrant Horizon Spinner 스펙:**
- SVGR로 `shared/assets/icons/spinner.svg` import
- 색상: currentColor (Primary `#006A62` 기본)
- 사이즈: xs(16px) / sm(20px) / md(24px) / lg(32px) / xl(40px)

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/Spinner/Spinner.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Spinner/Spinner.test.tsx`

- [ ] **Step 1: 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Spinner from './Spinner'

describe('Spinner 컴포넌트', () => {
  it('렌더링된다', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('animate-spin 클래스가 적용된다', () => {
    const { container } = render(<Spinner />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('animate-spin')
  })

  it('size=lg일 때 w-8 h-8 클래스가 적용된다', () => {
    const { container } = render(<Spinner size="lg" />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('w-8')
    expect(el).toHaveClass('h-8')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Spinner/Spinner.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Spinner.tsx 교체**

설치된 Spinner 파일을 읽은 뒤, SVGR import 방식으로 교체한다:

```tsx
import SpinnerIcon from '../../assets/icons/spinner.svg?react'

/**
 * # SpinnerSize
 * - xs = 16px / sm = 20px / md = 24px / lg = 32px / xl = 40px
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * # Spinner
 * ---
 * - 간단설명: 로딩 인디케이터 SVG 스피너
 * - 제약사항: SVGR 설정 필요 (vite-plugin-svgr)
 * ---
 * @param size - 스피너 크기 (xs | sm | md | lg | xl), 기본값 md
 * @param color - 색상 (Tailwind text-* 클래스), 기본값 text-[#006A62]
 * ---
 * @example
 * <Spinner size="lg" />
 */
export default function Spinner({
  size = 'md',
  color = 'text-[#006A62]',
}: {
  size?: SpinnerSize
  color?: string
}) {
  const sizes: Record<SpinnerSize, string> = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  }
  return <SpinnerIcon className={`animate-spin ${sizes[size]} ${color}`} />
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Spinner/Spinner.test.tsx
```

Expected: 3개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Spinner/
git commit -m "feat: Spinner primitive SVGR 기반으로 교체 (LWPW-33)"
```

---

## Task 10: Toast 스타일 override + 테스트

**Vibrant Horizon Toast 스펙:**
- success: bg `#006A62`, text white
- error: bg `#BA1A1A` (error 토큰), text white
- 기본: bg `#1B1C1C` (on-surface), text white
- rounded-xl, shadow level-2

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/Toast/Toast.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Toast/Toast.test.tsx`

- [ ] **Step 1: 테스트 작성**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Toast, { useToast } from './Toast'
import { renderHook, act } from '@testing-library/react'

describe('Toast 컴포넌트', () => {
  it('메시지가 렌더링된다', () => {
    render(<Toast.Provider><Toast message="예약 완료!" type="success" /></Toast.Provider>)
    expect(screen.getByText('예약 완료!')).toBeInTheDocument()
  })

  it('type=success일 때 success 스타일이 적용된다', () => {
    const { container } = render(
      <Toast.Provider><Toast message="완료" type="success" /></Toast.Provider>
    )
    expect(container.querySelector('[data-type="success"]')).toBeInTheDocument()
  })

  it('type=error일 때 error 스타일이 적용된다', () => {
    const { container } = render(
      <Toast.Provider><Toast message="오류" type="error" /></Toast.Provider>
    )
    expect(container.querySelector('[data-type="error"]')).toBeInTheDocument()
  })
})
```

> 참고: 설치된 Toast의 실제 API(Provider 구조, props 이름)를 확인한 후 테스트를 조정할 것. 위는 예시 기준임.

- [ ] **Step 2: 설치된 Toast 파일 읽기**

설치된 `Toast.tsx`를 읽어 실제 API 구조를 파악한다.

- [ ] **Step 3: 실제 API에 맞게 테스트 수정**

설치된 Toast의 Provider/hook 구조에 맞게 테스트를 작성한다.

- [ ] **Step 4: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Toast/Toast.test.tsx
```

Expected: FAIL (스타일 미적용)

- [ ] **Step 5: Toast 스타일 override**

설치된 Toast 파일을 읽은 뒤, toast 루트 엘리먼트에 아래를 적용:

기본: `bg-[#1B1C1C] text-white rounded-xl px-4 py-3 shadow-[0px_12px_32px_rgba(0,0,0,0.12)]`
success: `bg-[#006A62] text-white`
error: `bg-[#BA1A1A] text-white`

success/error 타입 엘리먼트에 `data-type` 속성 추가.

JsDoc 추가:

```tsx
/**
 * # Toast
 * ---
 * - 간단설명: 예약 성공/실패 등 짧은 알림을 화면 하단에 표시
 * - 제약사항: Toast.Provider로 앱 루트를 감싸야 사용 가능
 * ---
 * @example
 * // 앱 루트
 * <Toast.Provider>
 *   <App />
 * </Toast.Provider>
 */
```

- [ ] **Step 6: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Toast/Toast.test.tsx
```

Expected: PASS

- [ ] **Step 7: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Toast/
git commit -m "feat: Toast primitive Vibrant Horizon 스타일 적용 (LWPW-33)"
```

---

## Task 11: Separator 스타일 override + 테스트

**Vibrant Horizon Separator 스펙:**
- bg `#BBC9C6` (outline-variant 토큰)
- 수평: h-px w-full / 수직: w-px h-full

**Files:**
- Modify: `apps/frontend/src/shared/ui/primitive/Separator/Separator.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Separator/Separator.test.tsx`

- [ ] **Step 1: 테스트 작성**

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Separator from './Separator'

describe('Separator 컴포넌트', () => {
  it('수평 구분선이 렌더링된다', () => {
    const { container } = render(<Separator />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('bg-[#BBC9C6]')
  })

  it('orientation=horizontal일 때 h-px 클래스가 적용된다', () => {
    const { container } = render(<Separator orientation="horizontal" />)
    expect(container.firstChild).toHaveClass('h-px')
  })

  it('orientation=vertical일 때 w-px 클래스가 적용된다', () => {
    const { container } = render(<Separator orientation="vertical" />)
    expect(container.firstChild).toHaveClass('w-px')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Separator/Separator.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Separator 스타일 override**

설치된 Separator 파일을 읽은 뒤, className에 아래를 적용:

수평: `bg-[#BBC9C6] h-px w-full`
수직: `bg-[#BBC9C6] w-px h-full`

JsDoc 추가:

```tsx
/**
 * # Separator
 * ---
 * - 간단설명: 콘텐츠 구역을 나누는 수평/수직 구분선
 * ---
 * @param orientation - 방향 (horizontal | vertical), 기본값 horizontal
 * ---
 * @example
 * <Separator orientation="horizontal" />
 */
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Separator/Separator.test.tsx
```

Expected: 3개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Separator/
git commit -m "feat: Separator primitive Vibrant Horizon 스타일 적용 (LWPW-33)"
```

---

## Task 12: Chip 직접 제작 + 테스트

**Vibrant Horizon Chip 스펙:**
- bg `#E0F4F2` (primary tint), text `#006A62`, rounded-full (pill)
- px-3 py-1, text-sm, font-medium

**Files:**
- Create: `apps/frontend/src/shared/ui/primitive/Chip/Chip.tsx`
- Create: `apps/frontend/src/shared/ui/primitive/Chip/Chip.test.tsx`

- [ ] **Step 1: 테스트 작성**

`apps/frontend/src/shared/ui/primitive/Chip/Chip.test.tsx` 생성:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Chip from './Chip'

describe('Chip 컴포넌트', () => {
  it('label이 렌더링된다', () => {
    render(<Chip label="무료 WiFi" />)
    expect(screen.getByText('무료 WiFi')).toBeInTheDocument()
  })

  it('pill 스타일이 적용된다', () => {
    const { container } = render(<Chip label="조식 포함" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('Vibrant Horizon teal tint 배경이 적용된다', () => {
    const { container } = render(<Chip label="수영장" />)
    expect(container.firstChild).toHaveClass('bg-[#E0F4F2]')
    expect(container.firstChild).toHaveClass('text-[#006A62]')
  })

  it('active=true일 때 primary 배경이 적용된다', () => {
    const { container } = render(<Chip label="선택됨" active />)
    expect(container.firstChild).toHaveClass('bg-[#006A62]')
    expect(container.firstChild).toHaveClass('text-white')
  })

  it('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = vi.fn()
    render(<Chip label="클릭" onClick={handleClick} />)
    fireEvent.click(screen.getByText('클릭'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Chip/Chip.test.tsx
```

Expected: FAIL (파일 없음)

- [ ] **Step 3: Chip.tsx 구현**

`apps/frontend/src/shared/ui/primitive/Chip/Chip.tsx` 생성:

```tsx
/**
 * # Chip
 * ---
 * - 간단설명: 필터 태그 및 예약 상태 배지에 사용하는 pill 형태 컴포넌트
 * - 제약사항: active 상태에서는 primary 색상으로 전환
 * ---
 * @param label - 칩 텍스트
 * @param active - 선택 활성 상태 여부
 * @param onClick - 클릭 핸들러
 * ---
 * @example
 * <Chip label="무료 WiFi" active={selected} onClick={() => toggleFilter('wifi')} />
 */
export default function Chip({
  label,
  active = false,
  onClick,
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  const base = 'rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer'
  const style = active
    ? 'bg-[#006A62] text-white'
    : 'bg-[#E0F4F2] text-[#006A62]'

  return (
    <span className={`${base} ${style}`} onClick={onClick}>
      {label}
    </span>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm vitest run src/shared/ui/primitive/Chip/Chip.test.tsx
```

Expected: 5개 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/Chip/
git commit -m "feat: Chip primitive 직접 제작 (LWPW-33)"
```

---

## Task 13: index.ts 생성 및 전체 테스트

**Files:**
- Create: `apps/frontend/src/shared/ui/primitive/index.ts`

- [ ] **Step 1: index.ts 생성**

`apps/frontend/src/shared/ui/primitive/index.ts` 생성:

```ts
export { default as Button } from './Button/Button'
export type { ButtonVariant } from './Button/Button'

export { default as Card } from './CardUI/CardUI'
export { CardHeader, CardTitle, CardContent, CardFooter } from './CardUI/CardUI'

export { default as Input } from './Input/Input'

export { default as Modal } from './Modal/Modal'

export { default as Skeleton } from './Skeleton/Skeleton'

export { default as Spinner } from './Spinner/Spinner'
export type { SpinnerSize } from './Spinner/Spinner'

export { default as Toast } from './Toast/Toast'

export { default as Separator } from './Separator/Separator'

export { default as Chip } from './Chip/Chip'
```

> 참고: 설치된 컴포넌트의 실제 export 이름을 확인하여 경로/이름을 조정할 것.

- [ ] **Step 2: 전체 테스트 실행**

```bash
cd apps/frontend
pnpm vitest run src/shared/ui/primitive
```

Expected: 전체 PASS

- [ ] **Step 3: 린트 확인**

```bash
cd /Users/gobobin/projects/project-with-harness
pnpm lint
```

Expected: 오류 없음

- [ ] **Step 4: 최종 커밋**

```bash
git add apps/frontend/src/shared/ui/primitive/index.ts
git commit -m "feat: primitive 컴포넌트 index.ts export 추가 (LWPW-33)"
```
