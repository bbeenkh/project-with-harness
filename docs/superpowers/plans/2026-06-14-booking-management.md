# 예약 확인 & 관리 화면 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 예약 번호 입력으로 예약 조회·취소가 가능한 `/my-bookings` 페이지를 TDD로 구현하고, 각 UI 컴포넌트를 Storybook에 문서화한다.

**Architecture:** 단일 페이지 상태 기반(Approach A). `useBookingSearch`로 예약 조회 상태를 관리하고, `useBookingCancel`로 취소 Mutation을 처리한다. BottomNav를 App.tsx 공통 레이아웃에 삽입해 전 페이지에 적용한다.

**Tech Stack:** React 19, TypeScript, @tanstack/react-query, react-router-dom, MSW(vitest), Storybook 8, Tailwind CSS (Vibrant Horizon 토큰)

---

## 파일 맵

### 생성
- `apps/frontend/src/entities/booking/model/useBookingSearch.ts`
- `apps/frontend/src/entities/booking/model/useBookingSearch.test.ts`
- `apps/frontend/src/entities/booking/model/useBookingCancel.ts`
- `apps/frontend/src/entities/booking/model/useBookingCancel.test.ts`
- `apps/frontend/src/widgets/bottom-nav/ui/BottomNav.tsx`
- `apps/frontend/src/widgets/bottom-nav/ui/BottomNav.test.tsx`
- `apps/frontend/src/widgets/bottom-nav/ui/BottomNav.stories.tsx`
- `apps/frontend/src/widgets/bottom-nav/index.ts`
- `apps/frontend/src/features/booking-management/ui/BookingSearchSection.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingSearchSection.test.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingSearchSection.stories.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingDetailCard.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingDetailCard.test.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingDetailCard.stories.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingInfoNote.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingInfoNote.test.tsx`
- `apps/frontend/src/features/booking-management/ui/BookingInfoNote.stories.tsx`
- `apps/frontend/src/features/booking-management/index.ts`
- `apps/frontend/src/pages/my-bookings/ui/MyBookingsPage.tsx`
- `apps/frontend/src/pages/my-bookings/ui/MyBookingsPage.test.tsx`
- `apps/frontend/src/pages/my-bookings/index.ts`

### 수정
- `apps/frontend/src/entities/booking/api/bookingApi.ts` — `cancelBooking` 추가
- `apps/frontend/src/entities/booking/api/bookingApi.test.ts` — `cancelBooking` + `fetchBooking` 테스트 추가
- `apps/frontend/src/entities/booking/index.ts` — `cancelBooking` export 추가
- `apps/frontend/src/mocks/handlers.ts` — GET/PATCH booking 핸들러 추가
- `apps/frontend/src/App.tsx` — `/my-bookings` 라우트 + BottomNav 공통 레이아웃 삽입
- `apps/frontend/src/pages/home/ui/HomePage.tsx` — 인라인 nav 제거 (BottomNav로 대체)
- `apps/frontend/src/pages/accommodation-detail/ui/BookingBottomBar.tsx` — `bottom-0` → `bottom-16` (BottomNav 위에 위치)

---

## Task 1: cancelBooking API 함수 + 테스트

**Files:**
- Modify: `apps/frontend/src/entities/booking/api/bookingApi.ts`
- Modify: `apps/frontend/src/entities/booking/api/bookingApi.test.ts`
- Modify: `apps/frontend/src/entities/booking/index.ts`

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/entities/booking/api/bookingApi.test.ts`에 아래 두 describe 블록을 추가한다 (기존 `createBooking` describe 아래):

```typescript
describe('fetchBooking', () => {
  const server = setupServer(
    http.get('http://localhost:3000/bookings/:bookingNumber', ({ params }) => {
      const { bookingNumber } = params as { bookingNumber: string }
      if (bookingNumber === 'V-K3F2-9ZAB') {
        return HttpResponse.json({
          id: 1,
          bookingNumber: 'V-K3F2-9ZAB',
          accommodationId: 1,
          guestName: '홍길동',
          checkIn: '2026-07-10',
          checkOut: '2026-07-13',
          status: 'confirmed',
          totalPrice: 750000,
        })
      }
      return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
    })
  )
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('예약 번호로 예약을 조회하면 Booking 객체를 반환한다', async () => {
    const booking = await fetchBooking('V-K3F2-9ZAB')
    expect(booking.bookingNumber).toBe('V-K3F2-9ZAB')
    expect(booking.guestName).toBe('홍길동')
    expect(booking.status).toBe('confirmed')
  })

  it('존재하지 않는 예약 번호로 조회하면 에러가 발생한다', async () => {
    await expect(fetchBooking('V-NONE-0000')).rejects.toThrow()
  })
})

describe('cancelBooking', () => {
  const server = setupServer(
    http.patch('http://localhost:3000/bookings/:id/cancel', ({ params }) => {
      const id = Number(params.id)
      if (id === 1) {
        return HttpResponse.json({
          id: 1,
          bookingNumber: 'V-K3F2-9ZAB',
          accommodationId: 1,
          guestName: '홍길동',
          checkIn: '2026-07-10',
          checkOut: '2026-07-13',
          status: 'cancelled',
          totalPrice: 750000,
        })
      }
      return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
    })
  )
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('예약 ID로 취소하면 status가 cancelled인 Booking을 반환한다', async () => {
    const booking = await cancelBooking(1)
    expect(booking.status).toBe('cancelled')
    expect(booking.bookingNumber).toBe('V-K3F2-9ZAB')
  })

  it('존재하지 않는 예약 ID로 취소하면 에러가 발생한다', async () => {
    await expect(cancelBooking(9999)).rejects.toThrow()
  })
})
```

파일 상단 import에 `fetchBooking`과 `cancelBooking`을 추가한다:
```typescript
import { createBooking, fetchBooking, cancelBooking } from './bookingApi'
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/entities/booking/api/bookingApi.test.ts
```

Expected: `cancelBooking` 관련 테스트 FAIL (함수 미존재)

- [ ] **Step 3: cancelBooking 구현**

`apps/frontend/src/entities/booking/api/bookingApi.ts` 파일 끝에 추가:

```typescript
/**
 * # cancelBooking
 * ---
 * - 간단설명: 예약 ID로 예약 취소
 * - 제약사항: 이미 취소된 예약이면 400 에러 반환
 * ---
 * @param id - 예약 고유 ID
 * @example
 * const cancelled = await cancelBooking(1)
 */
export const cancelBooking = async (id: number): Promise<Booking> => {
  const { data } = await axiosInstance.patch<Booking>(`/bookings/${id}/cancel`)
  return data
}
```

- [ ] **Step 4: index.ts export 추가**

`apps/frontend/src/entities/booking/index.ts`:

```typescript
export type { Booking, CreateBookingInput } from './types/booking'
export { createBooking, fetchBooking, cancelBooking } from './api/bookingApi'
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/entities/booking/api/bookingApi.test.ts
```

Expected: 모든 테스트 PASS

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/entities/booking/api/bookingApi.ts \
        apps/frontend/src/entities/booking/api/bookingApi.test.ts \
        apps/frontend/src/entities/booking/index.ts
git commit -m "feat: cancelBooking API 함수 추가 및 테스트 작성"
```

---

## Task 2: useBookingSearch 훅 + 테스트

**Files:**
- Create: `apps/frontend/src/entities/booking/model/useBookingSearch.ts`
- Create: `apps/frontend/src/entities/booking/model/useBookingSearch.test.ts`

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/entities/booking/model/useBookingSearch.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useBookingSearch } from './useBookingSearch'
import { createQueryWrapper } from '../../../test/queryWrapper'

const mockBooking = {
  id: 1,
  bookingNumber: 'V-K3F2-9ZAB',
  accommodationId: 1,
  guestName: '홍길동',
  checkIn: '2026-07-10',
  checkOut: '2026-07-13',
  status: 'confirmed',
  totalPrice: 750000,
}

const server = setupServer(
  http.get('http://localhost:3000/bookings/:bookingNumber', ({ params }) => {
    const { bookingNumber } = params as { bookingNumber: string }
    if (bookingNumber === 'V-K3F2-9ZAB') {
      return HttpResponse.json(mockBooking)
    }
    return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useBookingSearch', () => {
  it('초기 상태에서 데이터는 undefined이고 로딩 중이 아니다', () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingSearch(), { wrapper })
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('search() 호출 시 예약 번호로 조회해 데이터를 반환한다', async () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingSearch(), { wrapper })

    act(() => {
      result.current.setInputValue('V-K3F2-9ZAB')
    })
    act(() => {
      result.current.search()
    })

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.bookingNumber).toBe('V-K3F2-9ZAB')
    expect(result.current.data?.guestName).toBe('홍길동')
  })

  it('존재하지 않는 예약 번호로 조회하면 isError가 true가 된다', async () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingSearch(), { wrapper })

    act(() => {
      result.current.setInputValue('V-NONE-0000')
    })
    act(() => {
      result.current.search()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('빈 문자열로 search() 호출 시 쿼리가 실행되지 않는다', () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingSearch(), { wrapper })

    act(() => {
      result.current.search()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/entities/booking/model/useBookingSearch.test.ts
```

Expected: FAIL (모듈 없음)

- [ ] **Step 3: useBookingSearch 구현**

`apps/frontend/src/entities/booking/model/useBookingSearch.ts`:

```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBooking } from '../api/bookingApi'

/**
 * # useBookingSearch
 * ---
 * - 간단설명: 예약 번호 입력 상태 + 조회 React Query 훅
 * - 제약사항: search() 호출 시 inputValue가 비어있으면 쿼리 실행 안 함, retry: false
 * ---
 * @example
 * const { inputValue, setInputValue, search, data, isLoading, isError } = useBookingSearch()
 */
export const useBookingSearch = () => {
  const [inputValue, setInputValue] = useState('')
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['booking', submittedNumber],
    queryFn: () => fetchBooking(submittedNumber!),
    enabled: submittedNumber !== null,
    retry: false,
  })

  const search = () => {
    const trimmed = inputValue.trim()
    if (trimmed) setSubmittedNumber(trimmed)
  }

  return {
    inputValue,
    setInputValue,
    search,
    submittedNumber,
    ...query,
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/entities/booking/model/useBookingSearch.test.ts
```

Expected: 4개 테스트 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/entities/booking/model/useBookingSearch.ts \
        apps/frontend/src/entities/booking/model/useBookingSearch.test.ts
git commit -m "feat: useBookingSearch 훅 구현 및 테스트 작성"
```

---

## Task 3: useBookingCancel 훅 + 테스트

**Files:**
- Create: `apps/frontend/src/entities/booking/model/useBookingCancel.ts`
- Create: `apps/frontend/src/entities/booking/model/useBookingCancel.test.ts`

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/entities/booking/model/useBookingCancel.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useBookingCancel } from './useBookingCancel'
import { createQueryWrapper } from '../../../test/queryWrapper'

const server = setupServer(
  http.patch('http://localhost:3000/bookings/:id/cancel', ({ params }) => {
    const id = Number(params.id)
    if (id === 1) {
      return HttpResponse.json({
        id: 1,
        bookingNumber: 'V-K3F2-9ZAB',
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-10',
        checkOut: '2026-07-13',
        status: 'cancelled',
        totalPrice: 750000,
      })
    }
    return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useBookingCancel', () => {
  it('mutate(id) 호출 시 취소된 예약을 반환한다', async () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingCancel('V-K3F2-9ZAB'), { wrapper })

    let cancelled: unknown
    act(() => {
      result.current.mutate(1, {
        onSuccess: (data) => { cancelled = data },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect((cancelled as { status: string }).status).toBe('cancelled')
  })

  it('존재하지 않는 id로 취소하면 isError가 true가 된다', async () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingCancel('V-K3F2-9ZAB'), { wrapper })

    act(() => {
      result.current.mutate(9999)
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/entities/booking/model/useBookingCancel.test.ts
```

Expected: FAIL (모듈 없음)

- [ ] **Step 3: useBookingCancel 구현**

`apps/frontend/src/entities/booking/model/useBookingCancel.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBooking } from '../api/bookingApi'

/**
 * # useBookingCancel
 * ---
 * - 간단설명: 예약 취소 Mutation 훅 — 성공 시 해당 예약 쿼리를 무효화해 자동 갱신
 * - 제약사항: bookingNumber가 없으면 invalidateQueries 미실행
 * ---
 * @param bookingNumber - 현재 조회된 예약 번호 (쿼리 무효화 키로 사용)
 * @example
 * const { mutate, isPending } = useBookingCancel('V-K3F2-9ZAB')
 * mutate(1)
 */
export const useBookingCancel = (bookingNumber: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingNumber] })
    },
  })
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/entities/booking/model/useBookingCancel.test.ts
```

Expected: 2개 테스트 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/entities/booking/model/useBookingCancel.ts \
        apps/frontend/src/entities/booking/model/useBookingCancel.test.ts
git commit -m "feat: useBookingCancel 훅 구현 및 테스트 작성"
```

---

## Task 4: MSW handlers 업데이트 (개발 모드 mock)

**Files:**
- Modify: `apps/frontend/src/mocks/handlers.ts`

- [ ] **Step 1: 핸들러 추가**

`apps/frontend/src/mocks/handlers.ts`에 아래 두 핸들러를 `handlers` 배열에 추가한다. 파일 상단 `mockBookings` 배열을 활용한다:

```typescript
// 기존 handlers 배열 끝에 추가
  http.get('http://localhost:3000/bookings/:bookingNumber', ({ params }) => {
    const { bookingNumber } = params as { bookingNumber: string }
    const booking = mockBookings.find((b) => b.bookingNumber === bookingNumber)
    if (!booking) return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
    return HttpResponse.json(booking)
  }),

  http.patch('http://localhost:3000/bookings/:id/cancel', ({ params }) => {
    const id = Number(params.id)
    const booking = mockBookings.find((b) => b.id === id)
    if (!booking) return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
    if (booking.status === 'cancelled') {
      return HttpResponse.json({ error: '이미 취소된 예약입니다' }, { status: 400 })
    }
    booking.status = 'cancelled'
    return HttpResponse.json(booking)
  }),
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/src/mocks/handlers.ts
git commit -m "feat: MSW handlers에 예약 조회·취소 핸들러 추가"
```

---

## Task 5: BottomNav 위젯 + 테스트 + 스토리

**Files:**
- Create: `apps/frontend/src/widgets/bottom-nav/ui/BottomNav.tsx`
- Create: `apps/frontend/src/widgets/bottom-nav/ui/BottomNav.test.tsx`
- Create: `apps/frontend/src/widgets/bottom-nav/ui/BottomNav.stories.tsx`
- Create: `apps/frontend/src/widgets/bottom-nav/index.ts`

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/widgets/bottom-nav/ui/BottomNav.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from './BottomNav'

const renderWithRouter = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <BottomNav />
    </MemoryRouter>
  )

describe('BottomNav', () => {
  it('홈, 내 예약, 프로필 탭을 렌더링한다', () => {
    renderWithRouter('/')
    expect(screen.getByText('홈')).toBeInTheDocument()
    expect(screen.getByText('내 예약')).toBeInTheDocument()
    expect(screen.getByText('프로필')).toBeInTheDocument()
  })

  it('현재 경로가 /일 때 홈 탭이 활성화된다', () => {
    renderWithRouter('/')
    const homeLink = screen.getByRole('link', { name: /홈/ })
    expect(homeLink).toHaveClass('text-primary')
  })

  it('현재 경로가 /my-bookings일 때 내 예약 탭이 활성화된다', () => {
    renderWithRouter('/my-bookings')
    const bookingsLink = screen.getByRole('link', { name: /내 예약/ })
    expect(bookingsLink).toHaveClass('text-primary')
  })

  it('각 탭은 올바른 경로로 링크된다', () => {
    renderWithRouter('/')
    expect(screen.getByRole('link', { name: /홈/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /내 예약/ })).toHaveAttribute('href', '/my-bookings')
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/widgets/bottom-nav/ui/BottomNav.test.tsx
```

Expected: FAIL (모듈 없음)

- [ ] **Step 3: BottomNav 구현**

`apps/frontend/src/widgets/bottom-nav/ui/BottomNav.tsx`:

```tsx
import { Link, useLocation } from 'react-router-dom'

/**
 * # BottomNav
 * ---
 * - 간단설명: 하단 고정 내비게이션 바 — 홈/내 예약/프로필 탭, 현재 경로에 따라 활성 탭 강조
 * - 제약사항: BrowserRouter 내부에서 사용해야 함
 * ---
 * @example
 * <BottomNav />
 */
const NAV_ITEMS = [
  { label: '홈', icon: 'home', path: '/' },
  { label: '내 예약', icon: 'calendar_month', path: '/my-bookings' },
  { label: '프로필', icon: 'person', path: '/profile' },
] as const

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant">
      <div className="flex justify-around items-center h-16 max-w-[1200px] mx-auto px-margin-mobile">
        {NAV_ITEMS.map(({ label, icon, path }) => {
          const isActive = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-surface-on-variant'}`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="font-inter text-label-sm">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: index.ts 생성**

`apps/frontend/src/widgets/bottom-nav/index.ts`:

```typescript
export { default as BottomNav } from './ui/BottomNav'
```

- [ ] **Step 5: Storybook 스토리 작성**

`apps/frontend/src/widgets/bottom-nav/ui/BottomNav.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from './BottomNav'

const meta: Meta<typeof BottomNav> = {
  title: 'Widgets/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '200px' }}>
        <MemoryRouter initialEntries={['/']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BottomNav>

/** 홈 탭 활성화 상태 */
export const HomeActive: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '200px' }}>
        <MemoryRouter initialEntries={['/']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
}

/** 내 예약 탭 활성화 상태 */
export const BookingsActive: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '200px' }}>
        <MemoryRouter initialEntries={['/my-bookings']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
}
```

- [ ] **Step 6: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/widgets/bottom-nav/ui/BottomNav.test.tsx
```

Expected: 4개 테스트 모두 PASS

- [ ] **Step 7: 커밋**

```bash
git add apps/frontend/src/widgets/
git commit -m "feat: BottomNav 위젯 구현, 테스트 및 Storybook 스토리 작성"
```

---

## Task 6: BookingSearchSection + 테스트 + 스토리

**Files:**
- Create: `apps/frontend/src/features/booking-management/ui/BookingSearchSection.tsx`
- Create: `apps/frontend/src/features/booking-management/ui/BookingSearchSection.test.tsx`
- Create: `apps/frontend/src/features/booking-management/ui/BookingSearchSection.stories.tsx`

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/features/booking-management/ui/BookingSearchSection.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookingSearchSection from './BookingSearchSection'

const defaultProps = {
  inputValue: '',
  onChange: vi.fn(),
  onSearch: vi.fn(),
  isLoading: false,
}

describe('BookingSearchSection', () => {
  it('헤드라인과 안내 텍스트를 렌더링한다', () => {
    render(<BookingSearchSection {...defaultProps} />)
    expect(screen.getByText('나의 예약 확인')).toBeInTheDocument()
    expect(screen.getByText('예약 번호를 입력해 내역을 확인하세요')).toBeInTheDocument()
  })

  it('placeholder가 V-1234-5678인 입력 필드를 렌더링한다', () => {
    render(<BookingSearchSection {...defaultProps} />)
    expect(screen.getByPlaceholderText('V-1234-5678')).toBeInTheDocument()
  })

  it('입력 값 변경 시 onChange 콜백이 호출된다', () => {
    const onChange = vi.fn()
    render(<BookingSearchSection {...defaultProps} onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('V-1234-5678'), {
      target: { value: 'V-K3F2-9ZAB' },
    })
    expect(onChange).toHaveBeenCalledWith('V-K3F2-9ZAB')
  })

  it('조회 버튼 클릭 시 onSearch 콜백이 호출된다', () => {
    const onSearch = vi.fn()
    render(
      <BookingSearchSection {...defaultProps} inputValue="V-K3F2-9ZAB" onSearch={onSearch} />
    )
    fireEvent.click(screen.getByRole('button', { name: /조회/ }))
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('inputValue가 비어있으면 조회 버튼이 비활성화된다', () => {
    render(<BookingSearchSection {...defaultProps} inputValue="" />)
    expect(screen.getByRole('button', { name: /조회/ })).toBeDisabled()
  })

  it('isLoading이 true이면 조회 버튼이 비활성화된다', () => {
    render(
      <BookingSearchSection {...defaultProps} inputValue="V-K3F2-9ZAB" isLoading={true} />
    )
    expect(screen.getByRole('button', { name: /조회/ })).toBeDisabled()
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/features/booking-management/ui/BookingSearchSection.test.tsx
```

Expected: FAIL (모듈 없음)

- [ ] **Step 3: BookingSearchSection 구현**

`apps/frontend/src/features/booking-management/ui/BookingSearchSection.tsx`:

```tsx
import Input from '../../../shared/ui/primitive/Input'
import Button from '../../../shared/ui/primitive/Button'

interface Props {
  inputValue: string
  onChange: (value: string) => void
  onSearch: () => void
  isLoading: boolean
}

/**
 * # BookingSearchSection
 * ---
 * - 간단설명: 예약 번호 입력 필드 + 조회 버튼으로 구성된 검색 영역
 * - 제약사항: inputValue가 비어있거나 isLoading이면 버튼 비활성화
 * ---
 * @param inputValue - 현재 입력값
 * @param onChange - 입력값 변경 콜백
 * @param onSearch - 조회 버튼 클릭 콜백
 * @param isLoading - 조회 중 여부
 * @example
 * <BookingSearchSection inputValue={v} onChange={setV} onSearch={search} isLoading={false} />
 */
export default function BookingSearchSection({ inputValue, onChange, onSearch, isLoading }: Props) {
  return (
    <section className="px-margin-mobile py-lg">
      <h1 className="font-plus-jakarta text-headline-lg-mobile text-surface-on mb-xs">
        나의 예약 확인
      </h1>
      <p className="font-inter text-body-sm text-surface-on-variant mb-md">
        예약 번호를 입력해 내역을 확인하세요
      </p>
      <div className="flex gap-sm">
        <Input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="V-1234-5678"
          onEnter={onSearch}
          styleClass={{ root: 'flex-1' }}
        />
        <Button
          variant="primary"
          onClick={onSearch}
          disabled={isLoading || !inputValue.trim()}
        >
          🔍 조회
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Storybook 스토리 작성**

`apps/frontend/src/features/booking-management/ui/BookingSearchSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import BookingSearchSection from './BookingSearchSection'

const meta: Meta<typeof BookingSearchSection> = {
  title: 'Features/BookingManagement/BookingSearchSection',
  component: BookingSearchSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookingSearchSection>

/** 초기 빈 상태 */
export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <BookingSearchSection
        inputValue={value}
        onChange={setValue}
        onSearch={() => alert(`조회: ${value}`)}
        isLoading={false}
      />
    )
  },
}

/** 예약 번호 입력 상태 */
export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('V-K3F2-9ZAB')
    return (
      <BookingSearchSection
        inputValue={value}
        onChange={setValue}
        onSearch={() => alert(`조회: ${value}`)}
        isLoading={false}
      />
    )
  },
}

/** 로딩 중 상태 */
export const Loading: Story = {
  args: {
    inputValue: 'V-K3F2-9ZAB',
    onChange: () => {},
    onSearch: () => {},
    isLoading: true,
  },
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/features/booking-management/ui/BookingSearchSection.test.tsx
```

Expected: 6개 테스트 모두 PASS

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/features/booking-management/ui/BookingSearchSection.tsx \
        apps/frontend/src/features/booking-management/ui/BookingSearchSection.test.tsx \
        apps/frontend/src/features/booking-management/ui/BookingSearchSection.stories.tsx
git commit -m "feat: BookingSearchSection 컴포넌트 구현, 테스트 및 Storybook 스토리 작성"
```

---

## Task 7: BookingDetailCard + 테스트 + 스토리

**Files:**
- Create: `apps/frontend/src/features/booking-management/ui/BookingDetailCard.tsx`
- Create: `apps/frontend/src/features/booking-management/ui/BookingDetailCard.test.tsx`
- Create: `apps/frontend/src/features/booking-management/ui/BookingDetailCard.stories.tsx`

아래 mock data를 테스트와 스토리에서 공통으로 사용한다:

```typescript
// 두 파일에서 동일하게 정의해서 사용 (중복 허용, 외부 파일 불필요)
const mockConfirmedBooking = {
  id: 1,
  bookingNumber: 'V-K3F2-9ZAB',
  accommodationId: 1,
  guestName: '홍길동',
  checkIn: '2026-07-10',
  checkOut: '2026-07-13',
  status: 'confirmed' as const,
  totalPrice: 750000,
}

const mockCancelledBooking = {
  id: 2,
  bookingNumber: 'V-TEST-ABCD',
  accommodationId: 2,
  guestName: '김철수',
  checkIn: '2026-08-01',
  checkOut: '2026-08-03',
  status: 'cancelled' as const,
  totalPrice: 360000,
}
```

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/features/booking-management/ui/BookingDetailCard.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookingDetailCard from './BookingDetailCard'
import type { Booking } from '../../../entities/booking'

const mockConfirmedBooking: Booking = {
  id: 1,
  bookingNumber: 'V-K3F2-9ZAB',
  accommodationId: 1,
  guestName: '홍길동',
  checkIn: '2026-07-10',
  checkOut: '2026-07-13',
  status: 'confirmed',
  totalPrice: 750000,
}

const mockCancelledBooking: Booking = {
  id: 2,
  bookingNumber: 'V-TEST-ABCD',
  accommodationId: 2,
  guestName: '김철수',
  checkIn: '2026-08-01',
  checkOut: '2026-08-03',
  status: 'cancelled',
  totalPrice: 360000,
}

const defaultProps = {
  booking: mockConfirmedBooking,
  onCancel: vi.fn(),
  onPrintReceipt: vi.fn(),
  isCancelling: false,
}

describe('BookingDetailCard', () => {
  it('예약 번호, 예약자명, 체크인/아웃 날짜를 렌더링한다', () => {
    render(<BookingDetailCard {...defaultProps} />)
    expect(screen.getByText('V-K3F2-9ZAB')).toBeInTheDocument()
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('2026-07-10')).toBeInTheDocument()
    expect(screen.getByText('2026-07-13')).toBeInTheDocument()
  })

  it('confirmed 상태이면 "확정됨" 배지를 표시한다', () => {
    render(<BookingDetailCard {...defaultProps} />)
    expect(screen.getByText('확정됨')).toBeInTheDocument()
  })

  it('cancelled 상태이면 "취소됨" 배지를 표시한다', () => {
    render(<BookingDetailCard {...defaultProps} booking={mockCancelledBooking} />)
    expect(screen.getByText('취소됨')).toBeInTheDocument()
  })

  it('confirmed 상태이면 예약 취소 버튼이 표시된다', () => {
    render(<BookingDetailCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /예약 취소/ })).toBeInTheDocument()
  })

  it('cancelled 상태이면 예약 취소 버튼이 표시되지 않는다', () => {
    render(<BookingDetailCard {...defaultProps} booking={mockCancelledBooking} />)
    expect(screen.queryByRole('button', { name: /예약 취소/ })).not.toBeInTheDocument()
  })

  it('예약 취소 버튼 클릭 시 onCancel 콜백이 호출된다', () => {
    const onCancel = vi.fn()
    render(<BookingDetailCard {...defaultProps} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /예약 취소/ }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('isCancelling이 true이면 취소 버튼이 비활성화된다', () => {
    render(<BookingDetailCard {...defaultProps} isCancelling={true} />)
    expect(screen.getByRole('button', { name: /취소 중/ })).toBeDisabled()
  })

  it('영수증 출력 버튼 클릭 시 onPrintReceipt 콜백이 호출된다', () => {
    const onPrintReceipt = vi.fn()
    render(<BookingDetailCard {...defaultProps} onPrintReceipt={onPrintReceipt} />)
    fireEvent.click(screen.getByRole('button', { name: /영수증 출력/ }))
    expect(onPrintReceipt).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/features/booking-management/ui/BookingDetailCard.test.tsx
```

Expected: FAIL (모듈 없음)

- [ ] **Step 3: BookingDetailCard 구현**

`apps/frontend/src/features/booking-management/ui/BookingDetailCard.tsx`:

```tsx
import type { Booking } from '../../../entities/booking'
import Button from '../../../shared/ui/primitive/Button'

interface Props {
  booking: Booking
  onCancel: () => void
  onPrintReceipt: () => void
  isCancelling: boolean
}

const ACCOMMODATION_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  3: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
}
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'

const ACCOMMODATION_NAMES: Record<number, string> = {
  1: '제주 신라호텔',
  2: '부산 파라다이스 호텔',
  3: '서울 롯데호텔',
}

/**
 * # BookingDetailCard
 * ---
 * - 간단설명: 조회된 예약의 상세 정보를 카드 형태로 표시 — 숙소 이미지, 상태 배지, 2x2 그리드, 액션 버튼
 * - 제약사항: confirmed 상태일 때만 예약 취소 버튼 노출
 * ---
 * @param booking - 조회된 예약 데이터
 * @param onCancel - 예약 취소 버튼 클릭 콜백
 * @param onPrintReceipt - 영수증 출력 버튼 클릭 콜백
 * @param isCancelling - 취소 API 호출 중 여부
 * @example
 * <BookingDetailCard booking={booking} onCancel={handleCancel} onPrintReceipt={handlePrint} isCancelling={false} />
 */
export default function BookingDetailCard({ booking, onCancel, onPrintReceipt, isCancelling }: Props) {
  const imageUrl = ACCOMMODATION_IMAGES[booking.accommodationId] ?? FALLBACK_IMAGE
  const accommodationName = ACCOMMODATION_NAMES[booking.accommodationId] ?? '숙소'
  const isConfirmed = booking.status === 'confirmed'

  return (
    <article className="mx-margin-mobile rounded-xl overflow-hidden shadow-sm border border-outline-variant">
      <div className="relative">
        <img src={imageUrl} alt="숙소 이미지" className="w-full h-48 object-cover" />
        <span
          className={`absolute top-3 left-3 font-inter text-label-sm px-3 py-1 rounded-full ${
            isConfirmed
              ? 'bg-primary-container text-primary-on'
              : 'bg-surface-container-high text-surface-on-variant'
          }`}
        >
          {isConfirmed ? '확정됨' : '취소됨'}
        </span>
      </div>
      <div className="p-md">
        <p className="font-plus-jakarta text-headline-md text-surface-on">{accommodationName}</p>
        <p className="font-inter text-label-sm text-surface-on-variant mb-md">{booking.bookingNumber}</p>
        <div className="grid grid-cols-2 gap-sm mb-md">
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">체크인</p>
            <p className="font-inter text-body-sm text-surface-on">{booking.checkIn}</p>
          </div>
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">체크아웃</p>
            <p className="font-inter text-body-sm text-surface-on">{booking.checkOut}</p>
          </div>
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">예약자</p>
            <p className="font-inter text-body-sm text-surface-on">{booking.guestName}</p>
          </div>
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">결제 상태</p>
            <p className="font-inter text-body-sm text-surface-on">결제 완료</p>
          </div>
        </div>
        <div className="flex gap-sm">
          <Button variant="ghost" className="flex-1" onClick={onPrintReceipt}>
            영수증 출력
          </Button>
          {isConfirmed && (
            <Button
              variant="action"
              className="flex-1"
              onClick={onCancel}
              disabled={isCancelling}
            >
              {isCancelling ? '취소 중...' : '예약 취소'}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Storybook 스토리 작성**

`apps/frontend/src/features/booking-management/ui/BookingDetailCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import BookingDetailCard from './BookingDetailCard'
import type { Booking } from '../../../entities/booking'

const mockConfirmedBooking: Booking = {
  id: 1,
  bookingNumber: 'V-K3F2-9ZAB',
  accommodationId: 1,
  guestName: '홍길동',
  checkIn: '2026-07-10',
  checkOut: '2026-07-13',
  status: 'confirmed',
  totalPrice: 750000,
}

const mockCancelledBooking: Booking = {
  id: 2,
  bookingNumber: 'V-TEST-ABCD',
  accommodationId: 2,
  guestName: '김철수',
  checkIn: '2026-08-01',
  checkOut: '2026-08-03',
  status: 'cancelled',
  totalPrice: 360000,
}

const meta: Meta<typeof BookingDetailCard> = {
  title: 'Features/BookingManagement/BookingDetailCard',
  component: BookingDetailCard,
  tags: ['autodocs'],
  args: {
    onCancel: () => {},
    onPrintReceipt: () => {},
    isCancelling: false,
  },
}

export default meta
type Story = StoryObj<typeof BookingDetailCard>

/** 확정된 예약 — 예약 취소 버튼 노출 */
export const Confirmed: Story = {
  args: { booking: mockConfirmedBooking },
}

/** 취소된 예약 — 취소 버튼 미노출 */
export const Cancelled: Story = {
  args: { booking: mockCancelledBooking },
}

/** 취소 API 호출 중 — 버튼 비활성화 */
export const Cancelling: Story = {
  args: { booking: mockConfirmedBooking, isCancelling: true },
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/features/booking-management/ui/BookingDetailCard.test.tsx
```

Expected: 8개 테스트 모두 PASS

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/features/booking-management/ui/BookingDetailCard.tsx \
        apps/frontend/src/features/booking-management/ui/BookingDetailCard.test.tsx \
        apps/frontend/src/features/booking-management/ui/BookingDetailCard.stories.tsx
git commit -m "feat: BookingDetailCard 컴포넌트 구현, 테스트 및 Storybook 스토리 작성"
```

---

## Task 8: BookingInfoNote + 테스트 + 스토리 + feature index

**Files:**
- Create: `apps/frontend/src/features/booking-management/ui/BookingInfoNote.tsx`
- Create: `apps/frontend/src/features/booking-management/ui/BookingInfoNote.test.tsx`
- Create: `apps/frontend/src/features/booking-management/ui/BookingInfoNote.stories.tsx`
- Create: `apps/frontend/src/features/booking-management/index.ts`

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/features/booking-management/ui/BookingInfoNote.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BookingInfoNote from './BookingInfoNote'

describe('BookingInfoNote', () => {
  it('무료 취소 안내 제목을 렌더링한다', () => {
    render(<BookingInfoNote />)
    expect(screen.getByText('무료 취소 안내')).toBeInTheDocument()
  })

  it('취소 규정 안내 텍스트를 렌더링한다', () => {
    render(<BookingInfoNote />)
    expect(
      screen.getByText(/체크인 7일 전까지 무료 취소/)
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/features/booking-management/ui/BookingInfoNote.test.tsx
```

Expected: FAIL (모듈 없음)

- [ ] **Step 3: BookingInfoNote 구현**

`apps/frontend/src/features/booking-management/ui/BookingInfoNote.tsx`:

```tsx
/**
 * # BookingInfoNote
 * ---
 * - 간단설명: 무료 취소 규정 및 환불 정책 안내 카드
 * ---
 * @example
 * <BookingInfoNote />
 */
export default function BookingInfoNote() {
  return (
    <div className="mx-margin-mobile mt-md p-md bg-surface-container-low rounded-xl flex gap-sm">
      <span
        className="material-symbols-outlined text-primary"
        style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
      >
        verified_user
      </span>
      <div>
        <p className="font-inter text-label-md text-surface-on mb-xs">무료 취소 안내</p>
        <p className="font-inter text-body-sm text-surface-on-variant leading-relaxed">
          체크인 7일 전까지 무료 취소가 가능합니다. 이후 취소 시 환불 정책에 따라 위약금이 발생할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Storybook 스토리 작성**

`apps/frontend/src/features/booking-management/ui/BookingInfoNote.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import BookingInfoNote from './BookingInfoNote'

const meta: Meta<typeof BookingInfoNote> = {
  title: 'Features/BookingManagement/BookingInfoNote',
  component: BookingInfoNote,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookingInfoNote>

/** 무료 취소 안내 카드 */
export const Default: Story = {}
```

- [ ] **Step 5: feature index.ts 생성**

`apps/frontend/src/features/booking-management/index.ts`:

```typescript
export { default as BookingSearchSection } from './ui/BookingSearchSection'
export { default as BookingDetailCard } from './ui/BookingDetailCard'
export { default as BookingInfoNote } from './ui/BookingInfoNote'
```

- [ ] **Step 6: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/features/booking-management/ui/BookingInfoNote.test.tsx
```

Expected: 2개 테스트 모두 PASS

- [ ] **Step 7: 커밋**

```bash
git add apps/frontend/src/features/booking-management/
git commit -m "feat: BookingInfoNote 컴포넌트 구현, 테스트 및 Storybook 스토리 작성"
```

---

## Task 9: MyBookingsPage + 테스트 + page index

**Files:**
- Create: `apps/frontend/src/pages/my-bookings/ui/MyBookingsPage.tsx`
- Create: `apps/frontend/src/pages/my-bookings/ui/MyBookingsPage.test.tsx`
- Create: `apps/frontend/src/pages/my-bookings/index.ts`

- [ ] **Step 1: 테스트 작성 (Red)**

`apps/frontend/src/pages/my-bookings/ui/MyBookingsPage.test.tsx`:

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createQueryWrapper } from '../../../test/queryWrapper'
import MyBookingsPage from './MyBookingsPage'

const mockBooking = {
  id: 1,
  bookingNumber: 'V-K3F2-9ZAB',
  accommodationId: 1,
  guestName: '홍길동',
  checkIn: '2026-07-10',
  checkOut: '2026-07-13',
  status: 'confirmed',
  totalPrice: 750000,
}

const server = setupServer(
  http.get('http://localhost:3000/bookings/:bookingNumber', ({ params }) => {
    const { bookingNumber } = params as { bookingNumber: string }
    if (bookingNumber === 'V-K3F2-9ZAB') {
      return HttpResponse.json(mockBooking)
    }
    return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
  }),
  http.patch('http://localhost:3000/bookings/:id/cancel', ({ params }) => {
    const id = Number(params.id)
    if (id === 1) {
      return HttpResponse.json({ ...mockBooking, status: 'cancelled' })
    }
    return HttpResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderPage = () => {
  const Wrapper = createQueryWrapper()
  return render(
    <Wrapper>
      <MemoryRouter initialEntries={['/my-bookings']}>
        <MyBookingsPage />
      </MemoryRouter>
    </Wrapper>
  )
}

describe('MyBookingsPage', () => {
  it('Voyage 앱바와 검색 영역을 렌더링한다', () => {
    renderPage()
    expect(screen.getByText('Voyage')).toBeInTheDocument()
    expect(screen.getByText('나의 예약 확인')).toBeInTheDocument()
  })

  it('예약 번호 입력 후 조회하면 예약 카드가 표시된다', async () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText('V-1234-5678'), {
      target: { value: 'V-K3F2-9ZAB' },
    })
    fireEvent.click(screen.getByRole('button', { name: /조회/ }))
    await waitFor(() => expect(screen.getByText('홍길동')).toBeInTheDocument())
    expect(screen.getByText('V-K3F2-9ZAB')).toBeInTheDocument()
    expect(screen.getByText('확정됨')).toBeInTheDocument()
  })

  it('존재하지 않는 예약 번호 조회 시 에러 메시지를 표시한다', async () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText('V-1234-5678'), {
      target: { value: 'V-NONE-0000' },
    })
    fireEvent.click(screen.getByRole('button', { name: /조회/ }))
    await waitFor(() =>
      expect(screen.getByText('예약을 찾을 수 없습니다')).toBeInTheDocument()
    )
  })

  it('예약 취소 버튼 클릭 시 배지가 취소됨으로 변경된다', async () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText('V-1234-5678'), {
      target: { value: 'V-K3F2-9ZAB' },
    })
    fireEvent.click(screen.getByRole('button', { name: /조회/ }))
    await waitFor(() => expect(screen.getByText('확정됨')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /예약 취소/ }))
    await waitFor(() => expect(screen.getByText('취소됨')).toBeInTheDocument())
  })

  it('영수증 출력 버튼 클릭 시 토스트 메시지가 표시된다', async () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText('V-1234-5678'), {
      target: { value: 'V-K3F2-9ZAB' },
    })
    fireEvent.click(screen.getByRole('button', { name: /조회/ }))
    await waitFor(() => expect(screen.getByText('영수증 출력')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /영수증 출력/ }))
    await waitFor(() =>
      expect(screen.getByText('영수증 출력 기능은 준비 중입니다')).toBeInTheDocument()
    )
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
cd apps/frontend && pnpm vitest run src/pages/my-bookings/ui/MyBookingsPage.test.tsx
```

Expected: FAIL (모듈 없음)

- [ ] **Step 3: MyBookingsPage 구현**

`apps/frontend/src/pages/my-bookings/ui/MyBookingsPage.tsx`:

```tsx
import { useState } from 'react'
import Toast from '../../../shared/ui/primitive/Toast'
import { useBookingSearch } from '../../../entities/booking/model/useBookingSearch'
import { useBookingCancel } from '../../../entities/booking/model/useBookingCancel'
import BookingSearchSection from '../../../features/booking-management/ui/BookingSearchSection'
import BookingDetailCard from '../../../features/booking-management/ui/BookingDetailCard'
import BookingInfoNote from '../../../features/booking-management/ui/BookingInfoNote'

/**
 * # MyBookingsPage
 * ---
 * - 간단설명: 예약 번호 입력 조회 → 예약 상세 카드 + 취소 + 영수증 출력이 가능한 예약 관리 페이지
 * - 제약사항: /my-bookings 라우트에서 사용, BottomNav는 App.tsx 공통 레이아웃에서 주입
 * ---
 * @example
 * <Route path="/my-bookings" element={<MyBookingsPage />} />
 */
export default function MyBookingsPage() {
  const {
    inputValue,
    setInputValue,
    search,
    submittedNumber,
    data: booking,
    isLoading,
    isError,
  } = useBookingSearch()

  const { mutate: cancel, isPending: isCancelling } = useBookingCancel(submittedNumber)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setToastOpen(true)
  }

  const handleCancel = () => {
    if (!booking) return
    cancel(booking.id, {
      onSuccess: () => showToast('예약이 취소되었습니다'),
      onError: () => showToast('취소에 실패했습니다'),
    })
  }

  return (
    <Toast.Provider
      open={toastOpen}
      onOpenChange={setToastOpen}
      message={toastMessage}
      styleClass={{
        root: 'bg-surface-inverse text-surface-inverse-on rounded-xl px-md py-sm font-inter text-body-sm',
        viewport: 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs',
      }}
    >
      <div className="pt-16 pb-16">
        {/* 앱바 */}
        <header className="fixed top-0 w-full z-50 bg-surface shadow-sm flex justify-between items-center px-margin-mobile h-16">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
              travel_explore
            </span>
            <span className="font-plus-jakarta text-headline-lg-mobile text-primary">Voyage</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary-container" />
        </header>

        <BookingSearchSection
          inputValue={inputValue}
          onChange={setInputValue}
          onSearch={search}
          isLoading={isLoading}
        />

        {isLoading && (
          <p className="text-center font-inter text-body-sm text-surface-on-variant py-lg">
            조회 중...
          </p>
        )}

        {isError && (
          <p
            className="text-center font-inter text-body-sm text-error py-lg"
            role="alert"
          >
            예약을 찾을 수 없습니다
          </p>
        )}

        {booking && (
          <>
            <BookingDetailCard
              booking={booking}
              onCancel={handleCancel}
              onPrintReceipt={() => showToast('영수증 출력 기능은 준비 중입니다')}
              isCancelling={isCancelling}
            />
            <BookingInfoNote />
          </>
        )}
      </div>
    </Toast.Provider>
  )
}
```

- [ ] **Step 4: page index.ts 생성**

`apps/frontend/src/pages/my-bookings/index.ts`:

```typescript
export { default as MyBookingsPage } from './ui/MyBookingsPage'
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run src/pages/my-bookings/ui/MyBookingsPage.test.tsx
```

Expected: 5개 테스트 모두 PASS

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/pages/my-bookings/
git commit -m "feat: MyBookingsPage 구현 및 통합 테스트 작성"
```

---

## Task 10: App.tsx 공통 레이아웃 적용 + 기존 nav 정리

**Files:**
- Modify: `apps/frontend/src/App.tsx`
- Modify: `apps/frontend/src/pages/home/ui/HomePage.tsx`
- Modify: `apps/frontend/src/pages/accommodation-detail/ui/BookingBottomBar.tsx`

- [ ] **Step 1: App.tsx 수정**

`apps/frontend/src/App.tsx`를 아래로 교체한다:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/home'
import { AccommodationDetailPage } from './pages/accommodation-detail'
import { MyBookingsPage } from './pages/my-bookings'
import { BottomNav } from './widgets/bottom-nav'

const queryClient = new QueryClient()

/**
 * # App
 * ---
 * - 간단설명: 라우터 + QueryClient 설정, 공통 BottomNav 레이아웃 적용
 * ---
 * @example
 * <App />
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

- [ ] **Step 2: HomePage 인라인 nav 제거**

`apps/frontend/src/pages/home/ui/HomePage.tsx`에서 하단 `<nav>...</nav>` 블록 전체를 삭제한다. 아래 블록을 제거:

```tsx
      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant">
        <div className="flex justify-around items-center h-16 max-w-[1200px] mx-auto px-margin-mobile">
          <button className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              home
            </span>
            <span className="font-inter text-label-sm">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-surface-on-variant">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="font-inter text-label-sm">내 예약</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-surface-on-variant">
            <span className="material-symbols-outlined">person</span>
            <span className="font-inter text-label-sm">프로필</span>
          </button>
        </div>
      </nav>
```

- [ ] **Step 3: BookingBottomBar 위치 조정**

`apps/frontend/src/pages/accommodation-detail/ui/BookingBottomBar.tsx`에서 `bottom-0`을 `bottom-16`으로 변경한다 (BottomNav 위에 위치하도록). 두 곳 모두 변경:

변경 전:
```tsx
<div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t ...
```

변경 후:
```tsx
<div className="fixed bottom-16 left-0 right-0 z-50 bg-white border-t ...
```

두 개의 `<div className="fixed bottom-0 ...` (confirmedBooking 케이스와 폼 케이스) 모두 `bottom-16`으로 바꾼다.

- [ ] **Step 4: 전체 테스트 실행**

```bash
cd apps/frontend && pnpm vitest run
```

Expected: 모든 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/App.tsx \
        apps/frontend/src/pages/home/ui/HomePage.tsx \
        apps/frontend/src/pages/accommodation-detail/ui/BookingBottomBar.tsx
git commit -m "feat: App.tsx 공통 BottomNav 레이아웃 적용 및 기존 인라인 nav 제거"
```

---

## 최종 검증

- [ ] **전체 테스트 통과 확인**

```bash
cd apps/frontend && pnpm vitest run
```

Expected: 전체 PASS, 실패 0

- [ ] **개발 서버 동작 확인**

```bash
pnpm dev
```

브라우저에서 확인:
- `http://localhost:5173/` — 홈 (하단 BottomNav, 홈 탭 활성화)
- `http://localhost:5173/my-bookings` — 예약 확인 페이지 (내 예약 탭 활성화)
- `http://localhost:5173/accommodations/1` — 숙소 상세 (BookingBottomBar가 BottomNav 위에 위치)
