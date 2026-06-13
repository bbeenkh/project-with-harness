# 홈 화면 (LWPW-4) 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 검색창 + 인기 도시 칩 + 추천 숙소 카드 목록으로 구성된 홈 화면 구현 (LWPW-4)

**Architecture:** FSD 레이어 구조(pages → features → entities → shared). 3개 git worktree(LWPW-4_API / LWPW-4_TEST / LWPW-4_UI) 병렬 개발 후 순서대로 머지. React Query로 서버 상태 관리, MSW로 테스트 모킹.

**Tech Stack:** React 19, @tanstack/react-query, axios, Vitest + @testing-library/react, MSW 2, Tailwind CSS

---

## 파일 구조 맵

**Phase 0 — LWPW-4 베이스 브랜치**
- Modify: `apps/frontend/package.json` — @tanstack/react-query, axios 추가
- Modify: `apps/frontend/src/App.tsx` — QueryClientProvider 추가
- Modify: `apps/frontend/src/mocks/handlers.ts` — accommodation 핸들러 추가
- Create: `apps/frontend/src/test/queryWrapper.tsx` — React Query 테스트 래퍼
- Modify: `.gitignore` — .worktrees/ 추가

**LWPW-4_API 브랜치**
- Create: `apps/frontend/src/entities/accommodation/types/accommodation.ts`
- Create: `apps/frontend/src/shared/api/axiosInstance.ts`
- Create: `apps/frontend/src/entities/accommodation/api/accommodationApi.ts`
- Create: `apps/frontend/src/entities/accommodation/model/useAccommodations.ts`
- Create: `apps/frontend/src/entities/accommodation/index.ts`

**LWPW-4_TEST 브랜치 (API와 병렬)**
- Create: `apps/frontend/src/features/accommodation-search/model/useSearchState.test.ts`
- Create: `apps/frontend/src/features/accommodation-search/ui/SearchBar.test.tsx`
- Create: `apps/frontend/src/features/accommodation-search/ui/PopularCityChips.test.tsx`
- Create: `apps/frontend/src/entities/accommodation/model/useAccommodations.test.ts`
- Create: `apps/frontend/src/pages/home/ui/HomePage.test.tsx`

**LWPW-4_UI 브랜치 (API 타입 완료 후)**
- Create: `apps/frontend/src/features/accommodation-search/model/useSearchState.ts`
- Create: `apps/frontend/src/features/accommodation-search/ui/SearchBar.tsx`
- Create: `apps/frontend/src/features/accommodation-search/ui/PopularCityChips.tsx`
- Create: `apps/frontend/src/features/accommodation-search/index.ts`
- Create: `apps/frontend/src/pages/home/ui/AccommodationCard.tsx`
- Create: `apps/frontend/src/pages/home/ui/AccommodationList.tsx`
- Create: `apps/frontend/src/pages/home/ui/HomePage.tsx`
- Create: `apps/frontend/src/pages/home/index.ts`
- Modify: `apps/frontend/src/App.tsx` — HomePage 렌더링

---

## Phase 0: 기반 설정 (LWPW-4 베이스 브랜치)

### Task 1: LWPW-4 브랜치 생성 및 패키지 설치

**Files:**
- Modify: `apps/frontend/package.json`

- [ ] **Step 1: LWPW-4 브랜치 생성**

```bash
git checkout -b LWPW-4
```

- [ ] **Step 2: 패키지 설치**

```bash
pnpm -F frontend add @tanstack/react-query axios
```

- [ ] **Step 3: 설치 확인**

```bash
pnpm -F frontend list @tanstack/react-query axios
```

Expected: 두 패키지의 버전 정보가 출력됨

- [ ] **Step 4: 커밋**

```bash
git add apps/frontend/package.json pnpm-lock.yaml
git commit -m "feat: react-query, axios 패키지 설치 (LWPW-4)"
```

---

### Task 2: QueryClientProvider 설정

**Files:**
- Modify: `apps/frontend/src/App.tsx`

- [ ] **Step 1: App.tsx 수정**

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Hello from React + Vite</h1>
    </QueryClientProvider>
  )
}
```

- [ ] **Step 2: 개발 서버 기동 확인**

```bash
pnpm -F frontend dev
```

Expected: http://localhost:5173 에서 "Hello from React + Vite" 렌더링, 콘솔 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/App.tsx
git commit -m "feat: QueryClientProvider 설정 (LWPW-4)"
```

---

### Task 3: MSW accommodation 핸들러 추가

**Files:**
- Modify: `apps/frontend/src/mocks/handlers.ts`

- [ ] **Step 1: handlers.ts 수정**

```ts
import { http, HttpResponse } from 'msw'

const mockAccommodations = [
  { id: 1, name: '제주 신라호텔', location: '제주', pricePerNight: 250000, available: true },
  { id: 2, name: '부산 파라다이스 호텔', location: '부산', pricePerNight: 180000, available: true },
  { id: 3, name: '서울 롯데호텔', location: '서울', pricePerNight: 300000, available: false },
]

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
]
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/src/mocks/handlers.ts
git commit -m "feat: MSW accommodation 핸들러 추가 (LWPW-4)"
```

---

### Task 4: React Query 테스트 래퍼 생성

**Files:**
- Create: `apps/frontend/src/test/queryWrapper.tsx`

- [ ] **Step 1: queryWrapper.tsx 생성**

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * # createQueryWrapper
 * ---
 * - 간단설명: React Query 훅 테스트용 QueryClientProvider 래퍼 팩토리
 * - 제약사항: retry: false로 설정해 테스트에서 재시도 방지
 * ---
 * @example
 * const wrapper = createQueryWrapper()
 * renderHook(() => useAccommodations({}), { wrapper })
 */
export const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/src/test/queryWrapper.tsx
git commit -m "feat: React Query 테스트 래퍼 생성 (LWPW-4)"
```

---

### Task 5: .gitignore에 .worktrees/ 추가

- [ ] **Step 1: .gitignore에 .worktrees/ 추가**

```bash
echo ".worktrees/" >> .gitignore
git check-ignore -q .worktrees && echo "ignored OK"
```

Expected: `ignored OK` 출력

- [ ] **Step 2: 커밋**

```bash
git add .gitignore
git commit -m "chore: .worktrees/ gitignore 추가 (LWPW-4)"
```

---

### Task 6: 3개 worktree 생성

- [ ] **Step 1: LWPW-4_API, LWPW-4_TEST worktree 생성**

```bash
git worktree add .worktrees/LWPW-4_API -b LWPW-4_API
git worktree add .worktrees/LWPW-4_TEST -b LWPW-4_TEST
```

- [ ] **Step 2: 각 worktree 의존성 설치**

```bash
(cd .worktrees/LWPW-4_API && pnpm install)
(cd .worktrees/LWPW-4_TEST && pnpm install)
```

Expected: 각 worktree에서 node_modules 심링크 확인

---

## Phase 1: LWPW-4_API 브랜치

> 모든 작업은 `.worktrees/LWPW-4_API/apps/frontend/src/` 기준

### Task 7: Accommodation 타입 정의

**Files:**
- Create: `entities/accommodation/types/accommodation.ts`

- [ ] **Step 1: 타입 파일 생성**

```ts
/**
 * 숙소 정보
 * - id: 숙소 고유 ID
 * - name: 숙소명
 * - location: 도시명
 * - pricePerNight: 1박 가격 (원)
 * - available: 예약 가능 여부
 */
export interface Accommodation {
  /** 숙소 고유 ID */
  id: number
  /** 숙소명 */
  name: string
  /** 도시명 */
  location: string
  /** 1박 가격 (원) */
  pricePerNight: number
  /** 예약 가능 여부 */
  available: boolean
}

/**
 * 숙소 목록 조회 파라미터
 * - keyword: 숙소명 부분일치 검색어
 * - location: 도시명 완전일치 필터
 */
export interface AccommodationQuery {
  /** 숙소명 부분일치 검색어 */
  keyword?: string
  /** 도시명 완전일치 필터 */
  location?: string
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/src/entities/accommodation/types/accommodation.ts
git commit -m "feat: Accommodation 타입 정의 (LWPW-4_API)"
```

---

### Task 8: axios 인스턴스 생성

**Files:**
- Create: `shared/api/axiosInstance.ts`

- [ ] **Step 1: axiosInstance.ts 생성**

```ts
import axios from 'axios'

/**
 * # axiosInstance
 * ---
 * - 간단설명: 백엔드 API 기본 URL이 설정된 axios 인스턴스
 * - 제약사항: baseURL은 http://localhost:3000 (개발 환경)
 * ---
 * @example
 * const { data } = await axiosInstance.get('/accommodations')
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
})

export default axiosInstance
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/src/shared/api/axiosInstance.ts
git commit -m "feat: axios 인스턴스 생성 (LWPW-4_API)"
```

---

### Task 9: fetchAccommodations API 함수 작성

**Files:**
- Create: `entities/accommodation/api/accommodationApi.ts`

- [ ] **Step 1: accommodationApi.ts 생성**

```ts
import axiosInstance from '../../shared/api/axiosInstance'
import type { Accommodation, AccommodationQuery } from '../types/accommodation'

/**
 * # fetchAccommodations
 * ---
 * - 간단설명: 숙소 목록 조회 API 호출
 * - 제약사항: keyword는 숙소명 부분일치, location은 도시명 완전일치, 빈 값은 파라미터에서 제외
 * ---
 * @param params - 검색 파라미터 (keyword, location)
 * @example
 * const list = await fetchAccommodations({ location: '제주' })
 */
export const fetchAccommodations = async (params: AccommodationQuery): Promise<Accommodation[]> => {
  const { data } = await axiosInstance.get<Accommodation[]>('/accommodations', {
    params: {
      ...(params.keyword ? { keyword: params.keyword } : {}),
      ...(params.location ? { location: params.location } : {}),
    },
  })
  return data
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/frontend/src/entities/accommodation/api/accommodationApi.ts
git commit -m "feat: fetchAccommodations API 함수 작성 (LWPW-4_API)"
```

---

### Task 10: useAccommodations 훅 작성

**Files:**
- Create: `entities/accommodation/model/useAccommodations.ts`
- Create: `entities/accommodation/index.ts`

- [ ] **Step 1: useAccommodations.ts 생성**

```ts
import { useQuery } from '@tanstack/react-query'
import { fetchAccommodations } from '../api/accommodationApi'
import type { AccommodationQuery } from '../types/accommodation'

/**
 * # useAccommodations
 * ---
 * - 간단설명: 숙소 목록 조회 React Query 훅
 * - 제약사항: staleTime, gcTime은 React Query 기본값 사용 (staleTime: 0, gcTime: 5분)
 * ---
 * @param params - 검색 파라미터 (keyword, location)
 * @example
 * const { data, isLoading, isError } = useAccommodations({ location: '제주' })
 */
export const useAccommodations = (params: AccommodationQuery) => {
  return useQuery({
    queryKey: ['accommodations', params],
    queryFn: () => fetchAccommodations(params),
  })
}
```

- [ ] **Step 2: entities/accommodation/index.ts 생성**

```ts
export { useAccommodations } from './model/useAccommodations'
export type { Accommodation, AccommodationQuery } from './types/accommodation'
```

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/entities/accommodation/model/useAccommodations.ts \
        apps/frontend/src/entities/accommodation/index.ts
git commit -m "feat: useAccommodations 훅 작성 (LWPW-4_API)"
```

---

## Phase 2: LWPW-4_TEST 브랜치

> 모든 작업은 `.worktrees/LWPW-4_TEST/apps/frontend/src/` 기준
>
> 구현 파일이 없으므로 테스트는 RED(실패) 상태여야 함 — TDD 시작점

### Task 11: useSearchState 테스트 작성

**Files:**
- Create: `features/accommodation-search/model/useSearchState.test.ts`

- [ ] **Step 1: useSearchState.test.ts 생성**

```ts
import { renderHook, act } from '@testing-library/react'
import { useSearchState } from './useSearchState'

describe('useSearchState', () => {
  it('초기값은 keyword 빈 문자열, location undefined이다', () => {
    const { result } = renderHook(() => useSearchState())
    expect(result.current.keyword).toBe('')
    expect(result.current.location).toBeUndefined()
  })

  it('setKeyword 호출 시 keyword가 업데이트된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => {
      result.current.setKeyword('호텔')
    })
    expect(result.current.keyword).toBe('호텔')
  })

  it('toggleLocation 호출 시 location이 해당 도시로 설정된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => { result.current.toggleLocation('제주') })
    expect(result.current.location).toBe('제주')
  })

  it('같은 도시로 toggleLocation 재호출 시 location이 undefined로 해제된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => { result.current.toggleLocation('제주') })
    act(() => { result.current.toggleLocation('제주') })
    expect(result.current.location).toBeUndefined()
  })

  it('다른 도시로 toggleLocation 호출 시 location이 교체된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => { result.current.toggleLocation('제주') })
    act(() => { result.current.toggleLocation('부산') })
    expect(result.current.location).toBe('부산')
  })
})
```

- [ ] **Step 2: 테스트 실행 — RED 확인**

```bash
pnpm -F frontend test src/features/accommodation-search/model/useSearchState.test.ts
```

Expected: FAIL — `Cannot find module './useSearchState'`

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/features/accommodation-search/model/useSearchState.test.ts
git commit -m "test: useSearchState 테스트 작성 (LWPW-4_TEST)"
```

---

### Task 12: PopularCityChips 테스트 작성

**Files:**
- Create: `features/accommodation-search/ui/PopularCityChips.test.tsx`

- [ ] **Step 1: PopularCityChips.test.tsx 생성**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PopularCityChips from './PopularCityChips'

describe('PopularCityChips', () => {
  it('인기 도시 5개가 모두 렌더링된다', () => {
    render(<PopularCityChips selectedLocation={undefined} onSelect={() => {}} />)
    expect(screen.getByText('서울')).toBeInTheDocument()
    expect(screen.getByText('부산')).toBeInTheDocument()
    expect(screen.getByText('제주')).toBeInTheDocument()
    expect(screen.getByText('강릉')).toBeInTheDocument()
    expect(screen.getByText('경주')).toBeInTheDocument()
  })

  it('selectedLocation과 일치하는 칩이 active 스타일(bg-[#006A62])로 표시된다', () => {
    render(<PopularCityChips selectedLocation="제주" onSelect={() => {}} />)
    expect(screen.getByText('제주')).toHaveClass('bg-[#006A62]')
  })

  it('칩 클릭 시 onSelect에 해당 도시명이 전달된다', async () => {
    const onSelect = vi.fn()
    render(<PopularCityChips selectedLocation={undefined} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('부산'))
    expect(onSelect).toHaveBeenCalledWith('부산')
  })
})
```

- [ ] **Step 2: 테스트 실행 — RED 확인**

```bash
pnpm -F frontend test src/features/accommodation-search/ui/PopularCityChips.test.tsx
```

Expected: FAIL — `Cannot find module './PopularCityChips'`

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/features/accommodation-search/ui/PopularCityChips.test.tsx
git commit -m "test: PopularCityChips 테스트 작성 (LWPW-4_TEST)"
```

---

### Task 13: SearchBar 테스트 작성

**Files:**
- Create: `features/accommodation-search/ui/SearchBar.test.tsx`

- [ ] **Step 1: SearchBar.test.tsx 생성**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('placeholder 텍스트가 표시된다', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('여행지를 검색하세요')).toBeInTheDocument()
  })

  it('입력 시 onChange가 새 값으로 호출된다', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('여행지를 검색하세요'), {
      target: { value: '호텔' },
    })
    expect(onChange).toHaveBeenCalledWith('호텔')
  })

  it('value prop이 input에 반영된다', () => {
    render(<SearchBar value="제주" onChange={() => {}} />)
    expect(screen.getByDisplayValue('제주')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — RED 확인**

```bash
pnpm -F frontend test src/features/accommodation-search/ui/SearchBar.test.tsx
```

Expected: FAIL — `Cannot find module './SearchBar'`

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/features/accommodation-search/ui/SearchBar.test.tsx
git commit -m "test: SearchBar 테스트 작성 (LWPW-4_TEST)"
```

---

### Task 14: useAccommodations 테스트 작성

**Files:**
- Create: `entities/accommodation/model/useAccommodations.test.ts`

- [ ] **Step 1: useAccommodations.test.ts 생성**

```ts
import { renderHook, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAccommodations } from './useAccommodations'
import { createQueryWrapper } from '../../../test/queryWrapper'

const mockAccommodations = [
  { id: 1, name: '제주 신라호텔', location: '제주', pricePerNight: 250000, available: true },
  { id: 2, name: '부산 파라다이스 호텔', location: '부산', pricePerNight: 180000, available: true },
]

const server = setupServer(
  http.get('http://localhost:3000/accommodations', ({ request }) => {
    const url = new URL(request.url)
    const location = url.searchParams.get('location')
    const keyword = url.searchParams.get('keyword')
    let result = mockAccommodations
    if (location) result = result.filter((a) => a.location === location)
    if (keyword) result = result.filter((a) => a.name.includes(keyword))
    return HttpResponse.json(result)
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useAccommodations', () => {
  it('파라미터 없이 호출 시 전체 목록을 반환한다', async () => {
    const { result } = renderHook(() => useAccommodations({}), {
      wrapper: createQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('location 파라미터로 필터링된 결과를 반환한다', async () => {
    const { result } = renderHook(() => useAccommodations({ location: '제주' }), {
      wrapper: createQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].location).toBe('제주')
  })

  it('데이터 로딩 중 isLoading이 true이다', () => {
    const { result } = renderHook(() => useAccommodations({}), {
      wrapper: createQueryWrapper(),
    })
    expect(result.current.isLoading).toBe(true)
  })

  it('API 오류 시 isError가 true가 된다', async () => {
    server.use(
      http.get('http://localhost:3000/accommodations', () => HttpResponse.error())
    )
    const { result } = renderHook(() => useAccommodations({}), {
      wrapper: createQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
```

- [ ] **Step 2: 테스트 실행 — RED 확인**

```bash
pnpm -F frontend test src/entities/accommodation/model/useAccommodations.test.ts
```

Expected: FAIL — `Cannot find module './useAccommodations'`

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/entities/accommodation/model/useAccommodations.test.ts
git commit -m "test: useAccommodations 테스트 작성 (LWPW-4_TEST)"
```

---

### Task 15: HomePage 통합 테스트 작성

**Files:**
- Create: `pages/home/ui/HomePage.test.tsx`

- [ ] **Step 1: HomePage.test.tsx 생성**

```tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './HomePage'

const mockAccommodations = [
  { id: 1, name: '제주 신라호텔', location: '제주', pricePerNight: 250000, available: true },
  { id: 2, name: '부산 파라다이스 호텔', location: '부산', pricePerNight: 180000, available: true },
  { id: 3, name: '서울 롯데호텔', location: '서울', pricePerNight: 300000, available: false },
]

const server = setupServer(
  http.get('http://localhost:3000/accommodations', ({ request }) => {
    const url = new URL(request.url)
    const location = url.searchParams.get('location')
    const keyword = url.searchParams.get('keyword')
    let result = mockAccommodations
    if (location) result = result.filter((a) => a.location === location)
    if (keyword) result = result.filter((a) => a.name.includes(keyword))
    return HttpResponse.json(result)
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderWithQuery = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  )
}

describe('HomePage', () => {
  it('페이지 진입 시 전체 숙소 카드 목록이 렌더링된다', async () => {
    renderWithQuery()
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
      expect(screen.getByText('부산 파라다이스 호텔')).toBeInTheDocument()
    })
  })

  it('인기 도시 칩 5개가 표시된다', () => {
    renderWithQuery()
    ;['서울', '부산', '제주', '강릉', '경주'].forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument()
    })
  })

  it('도시 칩 클릭 시 해당 location으로만 필터링된다', async () => {
    renderWithQuery()
    await waitFor(() => screen.getByText('제주 신라호텔'))
    await userEvent.click(screen.getAllByText('제주')[0])
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
      expect(screen.queryByText('부산 파라다이스 호텔')).not.toBeInTheDocument()
    })
  })

  it('검색창에 키워드 입력 시 해당 keyword로 필터링된다', async () => {
    renderWithQuery()
    await waitFor(() => screen.getByText('제주 신라호텔'))
    fireEvent.change(screen.getByPlaceholderText('여행지를 검색하세요'), {
      target: { value: '신라' },
    })
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
      expect(screen.queryByText('부산 파라다이스 호텔')).not.toBeInTheDocument()
    })
  })

  it('API 오류 시 에러 메시지가 표시된다', async () => {
    server.use(
      http.get('http://localhost:3000/accommodations', () => HttpResponse.error())
    )
    renderWithQuery()
    await waitFor(() => {
      expect(screen.getByText('숙소 목록을 불러오지 못했습니다')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: 테스트 실행 — RED 확인**

```bash
pnpm -F frontend test src/pages/home/ui/HomePage.test.tsx
```

Expected: FAIL — `Cannot find module './HomePage'`

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/pages/home/ui/HomePage.test.tsx
git commit -m "test: HomePage 통합 테스트 작성 (LWPW-4_TEST)"
```

---

## Phase 3: LWPW-4_UI 브랜치

> **선행 조건:** LWPW-4_API의 Task 7 (타입 정의) 완료 후 시작
> 모든 작업은 `.worktrees/LWPW-4_UI/apps/frontend/src/` 기준

### Task 16: LWPW-4_UI worktree 생성

- [ ] **Step 1: 메인 repo에서 LWPW-4_API 기반으로 worktree 생성**

```bash
# 메인 repo (project-with-harness/) 에서 실행
git worktree add .worktrees/LWPW-4_UI -b LWPW-4_UI LWPW-4_API
(cd .worktrees/LWPW-4_UI && pnpm install)
```

Expected: LWPW-4_API의 타입/API 파일들이 포함된 상태로 시작

---

### Task 17: useSearchState 구현

**Files:**
- Create: `features/accommodation-search/model/useSearchState.ts`

- [ ] **Step 1: useSearchState.ts 생성**

```ts
import { useState } from 'react'

/**
 * # useSearchState
 * ---
 * - 간단설명: 홈 화면 검색 필터 상태 관리 훅 (keyword, location)
 * - 제약사항: toggleLocation은 같은 값 재선택 시 undefined로 해제됨
 * ---
 * @example
 * const { keyword, setKeyword, location, toggleLocation } = useSearchState()
 */
export const useSearchState = () => {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState<string | undefined>(undefined)

  const toggleLocation = (city: string) => {
    setLocation((prev) => (prev === city ? undefined : city))
  }

  return { keyword, setKeyword, location, toggleLocation }
}
```

- [ ] **Step 2: 테스트 복사 후 GREEN 확인**

LWPW-4_TEST 브랜치의 테스트 파일을 가져와 실행:

```bash
# LWPW-4_TEST worktree에서 파일 복사
cp ../../.worktrees/LWPW-4_TEST/apps/frontend/src/features/accommodation-search/model/useSearchState.test.ts \
   apps/frontend/src/features/accommodation-search/model/useSearchState.test.ts
pnpm -F frontend test src/features/accommodation-search/model/useSearchState.test.ts
```

Expected: PASS (5 tests)

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/features/accommodation-search/model/
git commit -m "feat: useSearchState 훅 구현 (LWPW-4_UI)"
```

---

### Task 18: SearchBar 컴포넌트 구현

**Files:**
- Create: `features/accommodation-search/ui/SearchBar.tsx`

- [ ] **Step 1: SearchBar.tsx 생성**

```tsx
import Input from '../../../shared/ui/primitive/Input'

interface Props {
  value: string
  onChange: (value: string) => void
}

/**
 * # SearchBar
 * ---
 * - 간단설명: 홈 화면 여행지 검색 입력창
 * - 제약사항: Input primitive 래핑, onChange는 string 값 직접 전달
 * ---
 * @param value - 현재 검색어
 * @param onChange - 검색어 변경 콜백 (string)
 * @example
 * <SearchBar value={keyword} onChange={setKeyword} />
 */
export default function SearchBar({ value, onChange }: Props) {
  return (
    <Input
      placeholder="여행지를 검색하세요"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
```

- [ ] **Step 2: 테스트 복사 후 GREEN 확인**

```bash
cp ../../.worktrees/LWPW-4_TEST/apps/frontend/src/features/accommodation-search/ui/SearchBar.test.tsx \
   apps/frontend/src/features/accommodation-search/ui/SearchBar.test.tsx
pnpm -F frontend test src/features/accommodation-search/ui/SearchBar.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/features/accommodation-search/ui/SearchBar.tsx \
        apps/frontend/src/features/accommodation-search/ui/SearchBar.test.tsx
git commit -m "feat: SearchBar 컴포넌트 구현 (LWPW-4_UI)"
```

---

### Task 19: PopularCityChips 컴포넌트 구현

**Files:**
- Create: `features/accommodation-search/ui/PopularCityChips.tsx`

- [ ] **Step 1: PopularCityChips.tsx 생성**

```tsx
import Chip from '../../../shared/ui/primitive/Chip'

/** 인기 여행지 도시 목록 (하드코딩) */
const POPULAR_CITIES = ['서울', '부산', '제주', '강릉', '경주']

interface Props {
  selectedLocation: string | undefined
  onSelect: (city: string) => void
}

/**
 * # PopularCityChips
 * ---
 * - 간단설명: 인기 여행지 도시 칩 목록 (하드코딩 5개)
 * - 제약사항: selectedLocation과 일치하는 칩만 active 상태
 * ---
 * @param selectedLocation - 현재 선택된 도시명
 * @param onSelect - 칩 클릭 시 도시명 전달 콜백
 * @example
 * <PopularCityChips selectedLocation={location} onSelect={toggleLocation} />
 */
export default function PopularCityChips({ selectedLocation, onSelect }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {POPULAR_CITIES.map((city) => (
        <Chip
          key={city}
          label={city}
          active={selectedLocation === city}
          onClick={() => onSelect(city)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: 테스트 복사 후 GREEN 확인**

```bash
cp ../../.worktrees/LWPW-4_TEST/apps/frontend/src/features/accommodation-search/ui/PopularCityChips.test.tsx \
   apps/frontend/src/features/accommodation-search/ui/PopularCityChips.test.tsx
pnpm -F frontend test src/features/accommodation-search/ui/PopularCityChips.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/features/accommodation-search/ui/PopularCityChips.tsx \
        apps/frontend/src/features/accommodation-search/ui/PopularCityChips.test.tsx
git commit -m "feat: PopularCityChips 컴포넌트 구현 (LWPW-4_UI)"
```

---

### Task 20: AccommodationCard / AccommodationList 구현

**Files:**
- Create: `pages/home/ui/AccommodationCard.tsx`
- Create: `pages/home/ui/AccommodationList.tsx`

- [ ] **Step 1: AccommodationCard.tsx 생성**

```tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../shared/ui/primitive/CardUI'
import type { Accommodation } from '../../../entities/accommodation/types/accommodation'

interface Props {
  accommodation: Accommodation
}

/**
 * # AccommodationCard
 * ---
 * - 간단설명: 개별 숙소 정보를 표시하는 카드 컴포넌트
 * - 제약사항: available이 false이면 "예약 불가" 뱃지 표시
 * ---
 * @param accommodation - 숙소 데이터
 * @example
 * <AccommodationCard accommodation={item} />
 */
export default function AccommodationCard({ accommodation }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{accommodation.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{accommodation.location}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="font-semibold text-[#006A62]">
          ₩{accommodation.pricePerNight.toLocaleString()} / 박
        </span>
        {!accommodation.available && (
          <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5">
            예약 불가
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
```

- [ ] **Step 2: AccommodationList.tsx 생성**

Skeleton 컴포넌트는 `Skeleton.Box styleClass={{ root: '...' }}` API를 사용함:

```tsx
import Skeleton from '../../../shared/ui/primitive/Skeleton'
import AccommodationCard from './AccommodationCard'
import type { Accommodation } from '../../../entities/accommodation/types/accommodation'

interface Props {
  data: Accommodation[] | undefined
  isLoading: boolean
  isError: boolean
}

/**
 * # AccommodationList
 * ---
 * - 간단설명: 숙소 카드 목록 렌더링 (로딩/에러/데이터 상태 처리)
 * - 제약사항: isLoading 시 Skeleton.Box 3개, isError 시 에러 안내 텍스트
 * ---
 * @param data - 숙소 목록 데이터
 * @param isLoading - 로딩 여부
 * @param isError - 에러 여부
 * @example
 * <AccommodationList data={data} isLoading={isLoading} isError={isError} />
 */
export default function AccommodationList({ data, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton.Box key={i} styleClass={{ root: 'w-full h-32' }} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-center text-gray-500 py-8">숙소 목록을 불러오지 못했습니다</p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.map((item) => (
        <AccommodationCard key={item.id} accommodation={item} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/pages/home/ui/AccommodationCard.tsx \
        apps/frontend/src/pages/home/ui/AccommodationList.tsx
git commit -m "feat: AccommodationCard, AccommodationList 컴포넌트 구현 (LWPW-4_UI)"
```

---

### Task 21: HomePage 조합

**Files:**
- Create: `pages/home/ui/HomePage.tsx`
- Create: `pages/home/index.ts`
- Create: `features/accommodation-search/index.ts`

- [ ] **Step 1: HomePage.tsx 생성**

```tsx
import { useAccommodations } from '../../../entities/accommodation'
import { useSearchState } from '../../../features/accommodation-search/model/useSearchState'
import SearchBar from '../../../features/accommodation-search/ui/SearchBar'
import PopularCityChips from '../../../features/accommodation-search/ui/PopularCityChips'
import AccommodationList from './AccommodationList'

/**
 * # HomePage
 * ---
 * - 간단설명: 여행지 검색창 + 인기 도시 칩 + 추천 숙소 목록으로 구성된 홈 화면
 * ---
 * @example
 * <HomePage />
 */
export default function HomePage() {
  const { keyword, setKeyword, location, toggleLocation } = useSearchState()
  const { data, isLoading, isError } = useAccommodations({
    keyword: keyword || undefined,
    location,
  })

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <SearchBar value={keyword} onChange={setKeyword} />
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-2">인기 여행지</h2>
        <PopularCityChips selectedLocation={location} onSelect={toggleLocation} />
      </section>
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-2">추천 숙소</h2>
        <AccommodationList data={data} isLoading={isLoading} isError={isError} />
      </section>
    </main>
  )
}
```

- [ ] **Step 2: pages/home/index.ts 생성**

```ts
export { default as HomePage } from './ui/HomePage'
```

- [ ] **Step 3: features/accommodation-search/index.ts 생성**

```ts
export { useSearchState } from './model/useSearchState'
export { default as SearchBar } from './ui/SearchBar'
export { default as PopularCityChips } from './ui/PopularCityChips'
```

- [ ] **Step 4: 통합 테스트 복사 후 GREEN 확인**

```bash
cp ../../.worktrees/LWPW-4_TEST/apps/frontend/src/pages/home/ui/HomePage.test.tsx \
   apps/frontend/src/pages/home/ui/HomePage.test.tsx
pnpm -F frontend test src/pages/home/ui/HomePage.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: 커밋**

```bash
git add apps/frontend/src/pages/home/ui/HomePage.tsx \
        apps/frontend/src/pages/home/ui/HomePage.test.tsx \
        apps/frontend/src/pages/home/index.ts \
        apps/frontend/src/features/accommodation-search/index.ts
git commit -m "feat: HomePage 조합 구현 (LWPW-4_UI)"
```

---

### Task 22: App.tsx에 HomePage 연결

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: App.tsx 수정**

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './pages/home'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 2: 개발 서버에서 화면 확인**

```bash
# 터미널 1
pnpm -F backend dev

# 터미널 2
pnpm -F frontend dev
```

브라우저 http://localhost:5173 접속 확인 항목:
- 검색창 표시
- 인기 여행지 칩 5개 (서울/부산/제주/강릉/경주)
- 숙소 카드 목록 로드 (백엔드 응답)
- 칩 클릭 시 해당 도시만 필터링
- 검색창 입력 시 숙소명 필터링

- [ ] **Step 3: 커밋**

```bash
git add apps/frontend/src/App.tsx
git commit -m "feat: App.tsx에 HomePage 연결 (LWPW-4_UI)"
```

---

## Phase 4: 머지 및 마무리

### Task 23: 브랜치 머지 및 전체 테스트 통과

- [ ] **Step 1: LWPW-4_API 머지**

```bash
git checkout LWPW-4
git merge LWPW-4_API --no-ff -m "feat: LWPW-4_API 머지 - accommodation 엔티티 레이어"
```

- [ ] **Step 2: LWPW-4_TEST 머지**

```bash
git merge LWPW-4_TEST --no-ff -m "feat: LWPW-4_TEST 머지 - TDD 테스트"
```

- [ ] **Step 3: LWPW-4_UI 머지**

```bash
git merge LWPW-4_UI --no-ff -m "feat: LWPW-4_UI 머지 - 홈 화면 UI"
```

- [ ] **Step 4: 전체 테스트 통과 확인**

```bash
pnpm -F frontend test:run
```

Expected: 모든 테스트 PASS, 0 failures

- [ ] **Step 5: worktree 정리**

```bash
git worktree remove .worktrees/LWPW-4_API
git worktree remove .worktrees/LWPW-4_TEST
git worktree remove .worktrees/LWPW-4_UI
git branch -d LWPW-4_API LWPW-4_TEST LWPW-4_UI
```

---

### Task 24: Jira 상태 변경 및 PR 생성

- [ ] **Step 1: Jira 티켓 상태 변경**

Atlassian MCP로 LWPW-4 티켓을 "검토중"으로 전환

- [ ] **Step 2: PR 생성**

`/create-pr` 스킬 사용하여 LWPW-4 → master PR 생성
