# LWPW-5 숙소 상세 & 예약 신청 화면 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 숙소 상세 화면(히어로 이미지·평점·편의시설·지도)과 하단 고정 예약 바에서 예약 폼 모달을 통해 예약을 신청하는 기능을 구현한다.

**Architecture:** FSD(Feature-Sliced Design) 레이어 구조 유지. React Router v6으로 `/accommodations/:id` 라우트 추가. 예약 폼은 기존 Modal 컴포넌트를 활용한 Bottom Sheet 모달로 구현. LWPW-5_API → LWPW-5_UI / LWPW-5_TEST 순서로 3개 worktree에서 병렬 진행, 완료 후 LWPW-5 브랜치에 순서대로 merge.

**Tech Stack:** React 19, React Router v6, @tanstack/react-query, axios, Tailwind CSS, Radix UI (Modal), Vitest + @testing-library/react, MSW

---

## 브랜치 전략

```
LWPW-5
├── LWPW-5_API   (먼저 시작 — 타입 정의·API·라우터 설치)
├── LWPW-5_TEST  (API 타입 완료 후 / API 브랜치와 병렬 가능)
└── LWPW-5_UI    (API 타입 완료 후 시작 — UI 구현)
```

완료 후 LWPW-5에 API → TEST → UI 순서로 merge.

---

## 파일 구조

### 신규 생성
```
apps/frontend/src/
├── entities/
│   ├── accommodation/
│   │   ├── api/accommodationApi.ts          (기존 — fetchAccommodationById 추가)
│   │   ├── model/useAccommodation.ts        (신규 — 단건 조회 훅)
│   │   └── index.ts                         (기존 — useAccommodation export 추가)
│   └── booking/
│       ├── api/bookingApi.ts                (신규)
│       ├── types/booking.ts                 (신규)
│       └── index.ts                         (신규)
├── features/
│   └── booking/
│       ├── model/useBookingForm.ts          (신규)
│       ├── ui/BookingForm.tsx               (신규)
│       ├── ui/BookingConfirmation.tsx       (신규)
│       └── index.ts                         (신규)
├── pages/
│   └── accommodation-detail/
│       ├── ui/AccommodationDetailPage.tsx   (신규)
│       ├── ui/HeroImage.tsx                 (신규)
│       ├── ui/AmenitiesList.tsx             (신규)
│       ├── ui/MapPlaceholder.tsx            (신규)
│       ├── ui/BookingBottomBar.tsx          (신규)
│       └── index.ts                         (신규)
├── mocks/handlers.ts                        (기존 — 핸들러 추가)
└── App.tsx                                  (기존 — React Router 추가)
```

---

## ===== LWPW-5_API 브랜치 =====

### Task 1: LWPW-5_API worktree 생성 및 React Router 설치

**Files:**
- Modify: `apps/frontend/package.json`
- Modify: `apps/frontend/src/App.tsx`

- [ ] **Step 1: worktree 생성**

```bash
git worktree add ../project-with-harness-LWPW-5_API -b LWPW-5_API
cd ../project-with-harness-LWPW-5_API
```

- [ ] **Step 2: React Router 설치**

```bash
pnpm -F frontend add react-router-dom
```

Expected: `package.json`에 `react-router-dom` 추가됨.

- [ ] **Step 3: App.tsx에 라우터 적용**

`apps/frontend/src/App.tsx` 전체를 아래로 교체:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/home'
import { AccommodationDetailPage } from './pages/accommodation-detail'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

- [ ] **Step 4: 빌드 확인**

```bash
pnpm -F frontend build
```

Expected: 에러 없이 빌드 성공 (AccommodationDetailPage 미구현이면 타입 에러 발생하므로 임시 placeholder 생성 필요)

- [ ] **Step 5: placeholder 생성 (빌드 통과용)**

`apps/frontend/src/pages/accommodation-detail/index.ts`:

```ts
export { default as AccommodationDetailPage } from './ui/AccommodationDetailPage'
```

`apps/frontend/src/pages/accommodation-detail/ui/AccommodationDetailPage.tsx`:

```tsx
export default function AccommodationDetailPage() {
  return <div>숙소 상세 (구현 예정)</div>
}
```

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/App.tsx apps/frontend/src/pages/accommodation-detail/
git commit -m "feat: React Router 추가 및 숙소 상세 라우트 등록"
```

---

### Task 2: Booking 타입 및 API 정의

**Files:**
- Create: `apps/frontend/src/entities/booking/types/booking.ts`
- Create: `apps/frontend/src/entities/booking/api/bookingApi.ts`
- Create: `apps/frontend/src/entities/booking/index.ts`

- [ ] **Step 1: Booking 타입 작성**

`apps/frontend/src/entities/booking/types/booking.ts`:

```ts
/**
 * 예약 정보
 * - id: 예약 고유 ID
 * - bookingNumber: V-XXXX-XXXX 형식 예약 번호
 * - accommodationId: 숙소 ID
 * - guestName: 투숙객 이름
 * - checkIn: 체크인 날짜 (YYYY-MM-DD)
 * - checkOut: 체크아웃 날짜 (YYYY-MM-DD)
 * - status: 예약 상태 (confirmed | cancelled)
 * - totalPrice: 총 결제 금액 (원)
 */
export interface Booking {
  /** 예약 고유 ID */
  id: number
  /** V-XXXX-XXXX 형식 예약 번호 */
  bookingNumber: string
  /** 숙소 ID */
  accommodationId: number
  /** 투숙객 이름 */
  guestName: string
  /** 체크인 날짜 (YYYY-MM-DD) */
  checkIn: string
  /** 체크아웃 날짜 (YYYY-MM-DD) */
  checkOut: string
  /** 예약 상태 */
  status: 'confirmed' | 'cancelled'
  /** 총 결제 금액 (원) */
  totalPrice: number
}

/**
 * 예약 생성 요청 입력
 * - accommodationId: 숙소 ID
 * - guestName: 투숙객 이름
 * - checkIn: 체크인 날짜 (YYYY-MM-DD)
 * - checkOut: 체크아웃 날짜 (YYYY-MM-DD)
 */
export interface CreateBookingInput {
  /** 숙소 ID */
  accommodationId: number
  /** 투숙객 이름 */
  guestName: string
  /** 체크인 날짜 (YYYY-MM-DD) */
  checkIn: string
  /** 체크아웃 날짜 (YYYY-MM-DD) */
  checkOut: string
}
```

- [ ] **Step 2: Booking API 함수 작성**

`apps/frontend/src/entities/booking/api/bookingApi.ts`:

```ts
import axiosInstance from '../../../shared/api/axiosInstance'
import type { Booking, CreateBookingInput } from '../types/booking'

/**
 * # createBooking
 * ---
 * - 간단설명: 예약 생성 API 호출
 * - 제약사항: 중복 일정이면 409 에러 반환
 * ---
 * @param input - 예약 생성 입력값
 * @example
 * const booking = await createBooking({ accommodationId: 1, guestName: '홍길동', checkIn: '2026-07-01', checkOut: '2026-07-03' })
 */
export const createBooking = async (input: CreateBookingInput): Promise<Booking> => {
  const { data } = await axiosInstance.post<Booking>('/bookings', input)
  return data
}

/**
 * # fetchBooking
 * ---
 * - 간단설명: 예약 번호로 예약 조회
 * - 제약사항: 없는 번호이면 404 에러 반환
 * ---
 * @param bookingNumber - V-XXXX-XXXX 형식 예약 번호
 * @example
 * const booking = await fetchBooking('V-K3F2-9ZAB')
 */
export const fetchBooking = async (bookingNumber: string): Promise<Booking> => {
  const { data } = await axiosInstance.get<Booking>(`/bookings/${bookingNumber}`)
  return data
}
```

- [ ] **Step 3: entities/booking index 작성**

`apps/frontend/src/entities/booking/index.ts`:

```ts
export type { Booking, CreateBookingInput } from './types/booking'
export { createBooking, fetchBooking } from './api/bookingApi'
```

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/src/entities/booking/
git commit -m "feat: Booking 타입 및 API 함수 정의"
```

---

### Task 3: fetchAccommodationById 및 useAccommodation 훅 추가

**Files:**
- Modify: `apps/frontend/src/entities/accommodation/api/accommodationApi.ts`
- Create: `apps/frontend/src/entities/accommodation/model/useAccommodation.ts`
- Modify: `apps/frontend/src/entities/accommodation/index.ts`

- [ ] **Step 1: fetchAccommodationById 추가**

`apps/frontend/src/entities/accommodation/api/accommodationApi.ts` 하단에 추가:

```ts
/**
 * # fetchAccommodationById
 * ---
 * - 간단설명: 숙소 단건 상세 조회 API 호출
 * - 제약사항: 없는 id이면 404 에러 반환
 * ---
 * @param id - 숙소 ID
 * @example
 * const accommodation = await fetchAccommodationById(1)
 */
export const fetchAccommodationById = async (id: number): Promise<Accommodation> => {
  const { data } = await axiosInstance.get<Accommodation>(`/accommodations/${id}`)
  return data
}
```

- [ ] **Step 2: useAccommodation 훅 작성**

`apps/frontend/src/entities/accommodation/model/useAccommodation.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import { fetchAccommodationById } from '../api/accommodationApi'

/**
 * # useAccommodation
 * ---
 * - 간단설명: 숙소 단건 상세 조회 React Query 훅
 * - 제약사항: id가 undefined이면 쿼리 비활성화
 * ---
 * @param id - 숙소 ID
 * @example
 * const { data, isLoading } = useAccommodation(1)
 */
export const useAccommodation = (id: number | undefined) => {
  return useQuery({
    queryKey: ['accommodation', id],
    queryFn: () => fetchAccommodationById(id!),
    enabled: id !== undefined,
  })
}
```

- [ ] **Step 3: entities/accommodation index에 export 추가**

`apps/frontend/src/entities/accommodation/index.ts`에 아래 줄 추가:

```ts
export { useAccommodation } from './model/useAccommodation'
export { fetchAccommodationById } from './api/accommodationApi'
```

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/src/entities/accommodation/
git commit -m "feat: fetchAccommodationById 및 useAccommodation 훅 추가"
```

---

### Task 4: MSW 핸들러 확장 (숙소 상세·예약 생성)

**Files:**
- Modify: `apps/frontend/src/mocks/handlers.ts`

- [ ] **Step 1: handlers.ts에 핸들러 추가**

`apps/frontend/src/mocks/handlers.ts` 전체를 아래로 교체:

```ts
import { http, HttpResponse } from 'msw'
import type { Booking } from '../entities/booking'

const mockAccommodations = [
  {
    id: 1,
    name: '제주 신라호텔',
    location: '제주',
    pricePerNight: 250000,
    available: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['수영장', '주차', 'Wi-Fi', '주방', '에어컨'],
  },
  {
    id: 2,
    name: '부산 파라다이스 호텔',
    location: '부산',
    pricePerNight: 180000,
    available: true,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['주차', 'Wi-Fi', '레스토랑'],
  },
  {
    id: 3,
    name: '서울 롯데호텔',
    location: '서울',
    pricePerNight: 300000,
    available: false,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['Wi-Fi', '피트니스', '스파'],
  },
]

const mockBookings: Booking[] = []

export const handlers = [
  http.get('http://localhost:3000/accommodations', ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const location = url.searchParams.get('location')
    let result = mockAccommodations
    if (location) result = result.filter((a) => a.location === location)
    if (keyword) result = result.filter((a) => a.name.includes(keyword))
    return HttpResponse.json(result)
  }),

  http.get('http://localhost:3000/accommodations/:id', ({ params }) => {
    const id = Number(params.id)
    const accommodation = mockAccommodations.find((a) => a.id === id)
    if (!accommodation) return HttpResponse.json({ error: '숙소를 찾을 수 없습니다' }, { status: 404 })
    return HttpResponse.json(accommodation)
  }),

  http.post('http://localhost:3000/bookings', async ({ request }) => {
    const body = await request.json() as { accommodationId: number; guestName: string; checkIn: string; checkOut: string }
    const accommodation = mockAccommodations.find((a) => a.id === body.accommodationId)
    if (!accommodation) return HttpResponse.json({ error: '숙소를 찾을 수 없습니다' }, { status: 404 })
    const booking: Booking = {
      id: Date.now(),
      bookingNumber: `V-TEST-${Date.now().toString(36).toUpperCase().slice(-4)}`,
      accommodationId: body.accommodationId,
      guestName: body.guestName,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      status: 'confirmed',
      totalPrice: accommodation.pricePerNight * 2,
    }
    mockBookings.push(booking)
    return HttpResponse.json(booking, { status: 201 })
  }),
]
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/src/mocks/handlers.ts
git commit -m "feat: MSW 핸들러에 숙소 상세·예약 생성 핸들러 추가"
```

---

## ===== LWPW-5_TEST 브랜치 (API 타입 완료 후) =====

### Task 5: LWPW-5_TEST worktree 생성 및 API 테스트

**Files:**
- Create: `apps/frontend/src/entities/accommodation/model/useAccommodation.test.ts`
- Create: `apps/frontend/src/entities/booking/api/bookingApi.test.ts`

- [ ] **Step 1: worktree 생성**

```bash
# LWPW-5 브랜치에서 (LWPW-5_API merge 후)
git worktree add ../project-with-harness-LWPW-5_TEST -b LWPW-5_TEST
cd ../project-with-harness-LWPW-5_TEST
```

- [ ] **Step 2: useAccommodation 테스트 작성 (failing)**

`apps/frontend/src/entities/accommodation/model/useAccommodation.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAccommodation } from './useAccommodation'
import { createQueryWrapper } from '../../../test/queryWrapper'

describe('useAccommodation', () => {
  it('id로 숙소 단건 조회에 성공한다', async () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useAccommodation(1), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe(1)
    expect(result.current.data?.name).toBe('제주 신라호텔')
  })

  it('id가 undefined이면 쿼리를 실행하지 않는다', () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useAccommodation(undefined), { wrapper })
    expect(result.current.isPending).toBe(true)
    expect(result.current.fetchStatus).toBe('idle')
  })
})
```

- [ ] **Step 3: 테스트 실패 확인**

```bash
pnpm -F frontend test src/entities/accommodation/model/useAccommodation.test.ts
```

Expected: FAIL (useAccommodation 미구현)

- [ ] **Step 4: bookingApi 테스트 작성 (failing)**

`apps/frontend/src/entities/booking/api/bookingApi.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { createBooking } from './bookingApi'

describe('createBooking', () => {
  it('예약 생성에 성공하면 Booking 객체를 반환한다', async () => {
    const booking = await createBooking({
      accommodationId: 1,
      guestName: '홍길동',
      checkIn: '2026-07-01',
      checkOut: '2026-07-03',
    })
    expect(booking.bookingNumber).toMatch(/^V-/)
    expect(booking.guestName).toBe('홍길동')
    expect(booking.status).toBe('confirmed')
    expect(booking.totalPrice).toBeGreaterThan(0)
  })

  it('존재하지 않는 숙소 ID로 예약하면 에러가 발생한다', async () => {
    await expect(
      createBooking({
        accommodationId: 9999,
        guestName: '홍길동',
        checkIn: '2026-07-01',
        checkOut: '2026-07-03',
      })
    ).rejects.toThrow()
  })
})
```

- [ ] **Step 5: 테스트 실패 확인**

```bash
pnpm -F frontend test src/entities/booking/api/bookingApi.test.ts
```

Expected: FAIL (bookingApi 미구현)

- [ ] **Step 6: 커밋 (테스트 먼저)**

```bash
git add apps/frontend/src/entities/
git commit -m "test: useAccommodation, bookingApi 테스트 작성 (TDD - Red)"
```

---

### Task 6: useBookingForm 테스트 작성

**Files:**
- Create: `apps/frontend/src/features/booking/model/useBookingForm.test.ts`

- [ ] **Step 1: useBookingForm 테스트 작성 (failing)**

`apps/frontend/src/features/booking/model/useBookingForm.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBookingForm } from './useBookingForm'
import { createQueryWrapper } from '../../../test/queryWrapper'

describe('useBookingForm', () => {
  it('초기 상태에서 모든 필드가 빈 값이다', () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingForm(1), { wrapper })
    expect(result.current.guestName).toBe('')
    expect(result.current.checkIn).toBe('')
    expect(result.current.checkOut).toBe('')
  })

  it('checkOut이 checkIn보다 이르면 유효성 검사가 실패한다', () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingForm(1), { wrapper })
    act(() => {
      result.current.setCheckIn('2026-07-05')
      result.current.setCheckOut('2026-07-03')
    })
    expect(result.current.isValid).toBe(false)
  })

  it('모든 필드가 유효하면 isValid가 true이다', () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingForm(1), { wrapper })
    act(() => {
      result.current.setGuestName('홍길동')
      result.current.setCheckIn('2026-07-01')
      result.current.setCheckOut('2026-07-03')
    })
    expect(result.current.isValid).toBe(true)
  })

  it('submit 성공 시 onSuccess 콜백이 예약 정보와 함께 호출된다', async () => {
    const onSuccess = vi.fn()
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useBookingForm(1, { onSuccess }), { wrapper })
    act(() => {
      result.current.setGuestName('홍길동')
      result.current.setCheckIn('2026-07-01')
      result.current.setCheckOut('2026-07-03')
    })
    await act(async () => {
      await result.current.submit()
    })
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ guestName: '홍길동', status: 'confirmed' })
    )
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pnpm -F frontend test src/features/booking/model/useBookingForm.test.ts
```

Expected: FAIL (useBookingForm 미구현)

- [ ] **Step 3: AccommodationDetailPage 렌더링 테스트 작성 (failing)**

`apps/frontend/src/pages/accommodation-detail/ui/AccommodationDetailPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import AccommodationDetailPage from './AccommodationDetailPage'

function renderWithProviders(id: number) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/accommodations/${id}`]}>
        <Routes>
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AccommodationDetailPage', () => {
  it('숙소 정보가 로딩 후 표시된다', async () => {
    renderWithProviders(1)
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
    })
    expect(screen.getByText('제주')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })

  it('"지금 예약하기" 버튼이 표시된다', async () => {
    renderWithProviders(1)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /지금 예약하기/ })).toBeInTheDocument()
    })
  })

  it('편의시설 목록이 표시된다', async () => {
    renderWithProviders(1)
    await waitFor(() => {
      expect(screen.getByText('수영장')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 4: 테스트 실패 확인**

```bash
pnpm -F frontend test src/pages/accommodation-detail/
```

Expected: FAIL (AccommodationDetailPage 미구현)

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/features/booking/ apps/frontend/src/pages/accommodation-detail/
git commit -m "test: useBookingForm, AccommodationDetailPage 테스트 작성 (TDD - Red)"
```

---

## ===== LWPW-5_UI 브랜치 (API 타입 완료 후) =====

### Task 7: LWPW-5_UI worktree 생성 및 useBookingForm 구현

**Files:**
- Create: `apps/frontend/src/features/booking/model/useBookingForm.ts`
- Create: `apps/frontend/src/features/booking/index.ts`

- [ ] **Step 1: worktree 생성**

```bash
git worktree add ../project-with-harness-LWPW-5_UI -b LWPW-5_UI
cd ../project-with-harness-LWPW-5_UI
```

- [ ] **Step 2: useBookingForm 구현**

`apps/frontend/src/features/booking/model/useBookingForm.ts`:

```ts
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createBooking } from '../../../entities/booking'
import type { Booking } from '../../../entities/booking'

interface UseBookingFormOptions {
  onSuccess?: (booking: Booking) => void
}

/**
 * # useBookingForm
 * ---
 * - 간단설명: 예약 폼 상태 관리 및 제출 로직
 * - 제약사항: checkOut이 checkIn보다 이르면 isValid false
 * ---
 * @param accommodationId - 예약할 숙소 ID
 * @param options - 성공/실패 콜백
 * @example
 * const { guestName, setGuestName, submit, isValid } = useBookingForm(1, { onSuccess: (b) => console.log(b) })
 */
export const useBookingForm = (
  accommodationId: number,
  options?: UseBookingFormOptions
) => {
  const [guestName, setGuestName] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const isValid =
    guestName.trim().length > 0 &&
    checkIn.length > 0 &&
    checkOut.length > 0 &&
    checkIn < checkOut

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () => createBooking({ accommodationId, guestName, checkIn, checkOut }),
    onSuccess: options?.onSuccess,
  })

  const submit = async () => {
    if (!isValid) return
    await mutateAsync()
  }

  return {
    guestName,
    setGuestName,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    isValid,
    isPending,
    error,
    submit,
  }
}
```

- [ ] **Step 3: features/booking index 작성**

`apps/frontend/src/features/booking/index.ts`:

```ts
export { useBookingForm } from './model/useBookingForm'
export { default as BookingForm } from './ui/BookingForm'
export { default as BookingConfirmation } from './ui/BookingConfirmation'
```

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/src/features/booking/
git commit -m "feat: useBookingForm 훅 구현"
```

---

### Task 8: BookingForm 및 BookingConfirmation UI 구현

**Files:**
- Create: `apps/frontend/src/features/booking/ui/BookingForm.tsx`
- Create: `apps/frontend/src/features/booking/ui/BookingConfirmation.tsx`

- [ ] **Step 1: BookingForm 구현**

`apps/frontend/src/features/booking/ui/BookingForm.tsx`:

```tsx
import { useBookingForm } from '../model/useBookingForm'
import type { Booking } from '../../../entities/booking'
import { Button } from '../../../shared/ui/primitive'
import { Input } from '../../../shared/ui/primitive'

interface Props {
  accommodationId: number
  pricePerNight: number
  onSuccess: (booking: Booking) => void
}

/**
 * # BookingForm
 * ---
 * - 간단설명: 체크인/체크아웃/이름 입력 예약 폼
 * - 제약사항: isValid false이면 제출 버튼 비활성화
 * ---
 * @param accommodationId - 숙소 ID
 * @param pricePerNight - 1박 가격 (총액 미리보기용)
 * @param onSuccess - 예약 완료 콜백
 * @example
 * <BookingForm accommodationId={1} pricePerNight={150000} onSuccess={(b) => setBooking(b)} />
 */
export default function BookingForm({ accommodationId, pricePerNight, onSuccess }: Props) {
  const {
    guestName, setGuestName,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    isValid, isPending, error, submit,
  } = useBookingForm(accommodationId, { onSuccess })

  const nights =
    checkIn && checkOut && checkIn < checkOut
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
      : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-inter text-label-sm text-surface-on-variant">체크인</label>
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-inter text-label-sm text-surface-on-variant">체크아웃</label>
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-inter text-label-sm text-surface-on-variant">투숙객 이름</label>
        <Input
          type="text"
          placeholder="홍길동"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </div>
      {nights > 0 && (
        <div className="bg-surface-container-low rounded-lg p-3 flex justify-between items-center">
          <span className="font-inter text-body-sm text-surface-on-variant">{nights}박 총액</span>
          <span className="font-plus-jakarta text-headline-md text-surface-on">
            {(pricePerNight * nights).toLocaleString()}원
          </span>
        </div>
      )}
      {error && (
        <p className="font-inter text-label-sm text-error">
          {(error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? '예약 중 오류가 발생했습니다'}
        </p>
      )}
      <Button
        onClick={submit}
        disabled={!isValid || isPending}
        className="w-full"
      >
        {isPending ? '예약 중...' : '예약 확정'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: BookingConfirmation 구현**

`apps/frontend/src/features/booking/ui/BookingConfirmation.tsx`:

```tsx
import type { Booking } from '../../../entities/booking'
import { Button } from '../../../shared/ui/primitive'

interface Props {
  booking: Booking
  onClose: () => void
}

/**
 * # BookingConfirmation
 * ---
 * - 간단설명: 예약 완료 후 예약번호·기간·금액을 표시하는 확인 화면
 * ---
 * @param booking - 완료된 예약 정보
 * @param onClose - 닫기 콜백
 * @example
 * <BookingConfirmation booking={booking} onClose={() => setOpen(false)} />
 */
export default function BookingConfirmation({ booking, onClose }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>
      <div className="text-center">
        <h3 className="font-plus-jakarta text-headline-md text-surface-on mb-1">예약 완료!</h3>
        <p className="font-inter text-body-sm text-surface-on-variant">예약이 성공적으로 확정되었습니다.</p>
      </div>
      <div className="w-full bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">예약 번호</span>
          <span className="font-plus-jakarta text-label-lg text-primary font-bold">{booking.bookingNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">체크인</span>
          <span className="font-inter text-body-sm text-surface-on">{booking.checkIn}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">체크아웃</span>
          <span className="font-inter text-body-sm text-surface-on">{booking.checkOut}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">총 금액</span>
          <span className="font-plus-jakarta text-headline-md text-surface-on">{booking.totalPrice.toLocaleString()}원</span>
        </div>
      </div>
      <Button onClick={onClose} className="w-full">확인</Button>
    </div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/features/booking/ui/
git commit -m "feat: BookingForm, BookingConfirmation UI 구현"
```

---

### Task 9: 숙소 상세 페이지 서브 컴포넌트 구현

**Files:**
- Create: `apps/frontend/src/pages/accommodation-detail/ui/HeroImage.tsx`
- Create: `apps/frontend/src/pages/accommodation-detail/ui/AmenitiesList.tsx`
- Create: `apps/frontend/src/pages/accommodation-detail/ui/MapPlaceholder.tsx`
- Create: `apps/frontend/src/pages/accommodation-detail/ui/BookingBottomBar.tsx`

- [ ] **Step 1: HeroImage 구현**

`apps/frontend/src/pages/accommodation-detail/ui/HeroImage.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'

interface Props {
  imageUrl?: string
  name: string
}

/**
 * # HeroImage
 * ---
 * - 간단설명: 숙소 히어로 이미지 + 오버레이 헤더(뒤로가기·공유·찜)
 * - 제약사항: imageUrl 없으면 회색 placeholder
 * ---
 * @param imageUrl - 이미지 URL (optional)
 * @param name - 숙소명 (alt 텍스트)
 * @example
 * <HeroImage imageUrl="https://..." name="제주 풀빌라" />
 */
export default function HeroImage({ imageUrl, name }: Props) {
  const navigate = useNavigate()

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-surface-container-high" />
      )}
      {/* 오버레이 헤더 */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pt-12 pb-4 bg-gradient-to-b from-black/30 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
          aria-label="뒤로가기"
        >
          <span className="material-symbols-outlined text-surface-on" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <div className="flex gap-2">
          <button
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
            aria-label="공유"
          >
            <span className="material-symbols-outlined text-surface-on" style={{ fontSize: '20px' }}>share</span>
          </button>
          <button
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
            aria-label="찜하기"
          >
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>favorite</span>
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: AmenitiesList 구현**

`apps/frontend/src/pages/accommodation-detail/ui/AmenitiesList.tsx`:

```tsx
const AMENITY_ICONS: Record<string, string> = {
  'Wi-Fi': 'wifi',
  '수영장': 'pool',
  '주차': 'local_parking',
  '주방': 'kitchen',
  '에어컨': 'ac_unit',
  '넷플릭스': 'tv',
  '피트니스': 'fitness_center',
  '스파': 'spa',
  '레스토랑': 'restaurant',
}

interface Props {
  amenities: string[]
}

/**
 * # AmenitiesList
 * ---
 * - 간단설명: 편의시설 아이콘 + 이름 그리드
 * - 제약사항: 정의되지 않은 편의시설은 'check' 아이콘으로 표시
 * ---
 * @param amenities - 편의시설 이름 목록
 * @example
 * <AmenitiesList amenities={['Wi-Fi', '수영장', '주차']} />
 */
export default function AmenitiesList({ amenities }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
            {AMENITY_ICONS[amenity] ?? 'check'}
          </span>
          <span className="font-inter text-body-sm text-surface-on">{amenity}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: MapPlaceholder 구현**

`apps/frontend/src/pages/accommodation-detail/ui/MapPlaceholder.tsx`:

```tsx
interface Props {
  location: string
}

/**
 * # MapPlaceholder
 * ---
 * - 간단설명: 지도 위치 더미 이미지 표시 (실제 지도 미구현)
 * ---
 * @param location - 위치명 (하단 텍스트)
 * @example
 * <MapPlaceholder location="제주도 서귀포시" />
 */
export default function MapPlaceholder({ location }: Props) {
  return (
    <div>
      <div className="w-full h-40 rounded-xl bg-surface-container-high flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#006a6222 1px, transparent 1px), linear-gradient(90deg, #006a6222 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
            location_on
          </span>
          <span className="font-inter text-label-sm text-surface-on-variant">지도 (더미)</span>
        </div>
      </div>
      <p className="font-inter text-body-sm text-surface-on-variant mt-2">📍 {location}</p>
    </div>
  )
}
```

- [ ] **Step 4: BookingBottomBar 구현**

`apps/frontend/src/pages/accommodation-detail/ui/BookingBottomBar.tsx`:

```tsx
import { Button } from '../../../../shared/ui/primitive'

interface Props {
  pricePerNight: number
  onBookingClick: () => void
}

/**
 * # BookingBottomBar
 * ---
 * - 간단설명: 스크롤과 무관하게 하단에 고정되는 가격 표시 + 예약 버튼 바
 * ---
 * @param pricePerNight - 1박 가격 (원)
 * @param onBookingClick - 예약하기 버튼 클릭 콜백
 * @example
 * <BookingBottomBar pricePerNight={150000} onBookingClick={() => setOpen(true)} />
 */
export default function BookingBottomBar({ pricePerNight, onBookingClick }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-outline-variant px-margin-mobile py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div>
          <span className="font-inter text-label-sm text-outline block">1박당</span>
          <span className="font-plus-jakarta text-headline-md text-surface-on">
            {pricePerNight.toLocaleString()}원
          </span>
        </div>
        <Button onClick={onBookingClick}>지금 예약하기</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/pages/accommodation-detail/ui/HeroImage.tsx \
         apps/frontend/src/pages/accommodation-detail/ui/AmenitiesList.tsx \
         apps/frontend/src/pages/accommodation-detail/ui/MapPlaceholder.tsx \
         apps/frontend/src/pages/accommodation-detail/ui/BookingBottomBar.tsx
git commit -m "feat: 숙소 상세 서브 컴포넌트 구현 (HeroImage, AmenitiesList, MapPlaceholder, BookingBottomBar)"
```

---

### Task 10: AccommodationDetailPage 조합 및 홈 카드 링크 연결

**Files:**
- Modify: `apps/frontend/src/pages/accommodation-detail/ui/AccommodationDetailPage.tsx`
- Modify: `apps/frontend/src/pages/accommodation-detail/index.ts`
- Modify: `apps/frontend/src/pages/home/ui/AccommodationCard.tsx`

- [ ] **Step 1: AccommodationDetailPage 구현 (placeholder 교체)**

`apps/frontend/src/pages/accommodation-detail/ui/AccommodationDetailPage.tsx`:

```tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccommodation } from '../../../entities/accommodation'
import type { Booking } from '../../../entities/booking'
import { BookingForm, BookingConfirmation } from '../../../features/booking'
import Modal from '../../../shared/ui/primitive/Modal'
import { Skeleton } from '../../../shared/ui/primitive'
import HeroImage from './HeroImage'
import AmenitiesList from './AmenitiesList'
import MapPlaceholder from './MapPlaceholder'
import BookingBottomBar from './BookingBottomBar'

/**
 * # AccommodationDetailPage
 * ---
 * - 간단설명: 숙소 상세 정보(이미지, 평점, 편의시설, 지도) + 하단 고정 예약 바 + 예약 모달
 * ---
 * @example
 * <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
 */
export default function AccommodationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: accommodation, isLoading, isError } = useAccommodation(id ? Number(id) : undefined)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)

  if (isLoading) {
    return (
      <div className="pb-24">
        <Skeleton className="w-full aspect-[4/3]" />
        <div className="px-margin-mobile pt-4 flex flex-col gap-3">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !accommodation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-inter text-body-md text-error">숙소를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <main className="pb-24">
        {/* 히어로 이미지 */}
        <HeroImage imageUrl={accommodation.imageUrl} name={accommodation.name} />

        {/* 본문 */}
        <div className="px-margin-mobile py-6 flex flex-col gap-6">
          {/* 제목 + 평점 */}
          <div>
            <div className="flex justify-between items-start mb-1">
              <h1 className="font-plus-jakarta text-headline-lg-mobile text-surface-on flex-1 pr-3">
                {accommodation.name}
              </h1>
              {accommodation.rating !== undefined && (
                <div className="flex items-center gap-1 bg-primary-container px-2 py-1 rounded-full shrink-0">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-inter text-label-sm text-primary font-bold">{accommodation.rating}</span>
                </div>
              )}
            </div>
            <p className="font-inter text-body-sm text-surface-on-variant">📍 {accommodation.location}</p>
          </div>

          <div className="h-px bg-outline-variant" />

          {/* 숙소 소개 */}
          <section>
            <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-3">숙소 소개</h2>
            <p className="font-inter text-body-md text-surface-on-variant leading-relaxed">
              {accommodation.name}은(는) {accommodation.location}에 위치한 숙소입니다.
              {accommodation.amenities && accommodation.amenities.length > 0 &&
                ` ${accommodation.amenities.join(', ')} 등 다양한 편의시설을 제공합니다.`
              }
            </p>
          </section>

          {/* 편의시설 */}
          {accommodation.amenities && accommodation.amenities.length > 0 && (
            <>
              <div className="h-px bg-outline-variant" />
              <section>
                <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-4">편의시설</h2>
                <AmenitiesList amenities={accommodation.amenities} />
              </section>
            </>
          )}

          {/* 지도 */}
          <div className="h-px bg-outline-variant" />
          <section>
            <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-4">위치</h2>
            <MapPlaceholder location={accommodation.location} />
          </section>
        </div>
      </main>

      {/* 하단 고정 예약 바 */}
      <BookingBottomBar
        pricePerNight={accommodation.pricePerNight}
        onBookingClick={() => setBookingModalOpen(true)}
      />

      {/* 예약 모달 */}
      <Modal open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <Modal.Header>
          <Modal.Title>
            {confirmedBooking ? '예약 완료' : '예약 신청'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmedBooking ? (
            <BookingConfirmation
              booking={confirmedBooking}
              onClose={() => {
                setBookingModalOpen(false)
                setConfirmedBooking(null)
              }}
            />
          ) : (
            <BookingForm
              accommodationId={accommodation.id}
              pricePerNight={accommodation.pricePerNight}
              onSuccess={(booking) => setConfirmedBooking(booking)}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
```

- [ ] **Step 2: pages/accommodation-detail/index.ts 업데이트**

```ts
export { default as AccommodationDetailPage } from './ui/AccommodationDetailPage'
```

- [ ] **Step 3: AccommodationCard에 클릭 링크 추가**

`apps/frontend/src/pages/home/ui/AccommodationCard.tsx` 최상단에 import 추가:

```tsx
import { useNavigate } from 'react-router-dom'
```

컴포넌트 함수 내부 시작에 추가:

```tsx
const navigate = useNavigate()
```

최외각 `<div>` 의 `onClick` 속성 추가:

```tsx
<div
  className="bg-surface-container-lowest rounded-xl overflow-hidden card-shadow cursor-pointer transition-transform duration-300 hover:-translate-y-1"
  onClick={() => navigate(`/accommodations/${accommodation.id}`)}
>
```

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/src/pages/accommodation-detail/ \
         apps/frontend/src/pages/home/ui/AccommodationCard.tsx
git commit -m "feat: AccommodationDetailPage 조합 완성 및 홈 카드 링크 연결"
```

---

### Task 11: 테스트 통과 확인 (Green)

- [ ] **Step 1: LWPW-5_TEST 브랜치로 이동하여 API 구현 코드 확인**

LWPW-5_TEST 브랜치에서 LWPW-5_API의 변경사항을 가져온다:

```bash
cd ../project-with-harness-LWPW-5_TEST
git merge LWPW-5_API
```

- [ ] **Step 2: 전체 테스트 실행**

```bash
pnpm -F frontend test
```

Expected: 모든 테스트 PASS

- [ ] **Step 3: 실패한 테스트 있으면 수정 후 재실행**

각 실패 메시지 확인 후 원인 수정. 통과하면 커밋:

```bash
git add -A
git commit -m "test: LWPW-5 전체 테스트 통과 (TDD - Green)"
```

---

### Task 12: 브랜치 merge 및 동작 검증

- [ ] **Step 1: LWPW-5 브랜치로 이동**

```bash
git checkout LWPW-5
```

- [ ] **Step 2: 순서대로 merge**

```bash
git merge LWPW-5_API
git merge LWPW-5_TEST
git merge LWPW-5_UI
```

- [ ] **Step 3: 개발 서버 실행 및 동작 확인**

```bash
pnpm dev
```

체크리스트:
- [ ] 홈 화면 숙소 카드 클릭 → `/accommodations/1`로 이동
- [ ] 히어로 이미지, 숙소명, 평점, 위치 표시
- [ ] 편의시설 목록 표시
- [ ] 지도 더미 이미지 표시
- [ ] 하단 예약 바 고정 (스크롤해도 위치 유지)
- [ ] "지금 예약하기" 클릭 → 예약 폼 모달 열림
- [ ] 날짜·이름 입력 후 "예약 확정" 클릭 → 예약번호 확인 화면
- [ ] 뒤로가기 버튼 → 홈으로 이동

- [ ] **Step 4: 전체 테스트 최종 실행**

```bash
pnpm -F frontend test
```

Expected: 전체 PASS

- [ ] **Step 5: 최종 커밋**

```bash
git add -A
git commit -m "feat: LWPW-5 브랜치 merge 완료 - 숙소 상세 & 예약 신청 화면"
```
