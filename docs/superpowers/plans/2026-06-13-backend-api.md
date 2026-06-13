# 백엔드 API 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accommodation + Booking 데이터 모델과 7개 REST 엔드포인트를 단일 `index.ts`에 구현한다.

**Architecture:** `db.ts`에 타입·스키마·seed 데이터를 정의하고, `index.ts`에 모든 라우트를 추가한다. 테스트는 vitest + Hono의 `app.request()`로 실제 서버 없이 실행한다. db는 `vi.mock`으로 격리한다.

**Tech Stack:** Hono 4, lowdb 7, TypeScript 5, vitest

---

### Task 1: vitest 테스트 환경 설정

**Files:**
- Modify: `apps/backend/package.json`
- Create: `apps/backend/src/index.test.ts`

- [ ] **Step 1: vitest 설치**

```bash
cd apps/backend && pnpm add -D vitest
```

- [ ] **Step 2: package.json scripts에 test 추가**

`apps/backend/package.json`의 `"scripts"` 블록에 두 줄 추가:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: 초기 테스트 파일 생성**

`apps/backend/src/index.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'

describe('백엔드 API', () => {
  it('테스트 환경이 동작한다', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 4: 테스트 실행 확인**

```bash
cd apps/backend && pnpm test
```
Expected: PASS (1 passed)

- [ ] **Step 5: 커밋**

```bash
git add apps/backend/package.json apps/backend/src/index.test.ts
git commit -m "테스트: vitest 환경 설정"
```

---

### Task 2: db.ts 확장 — 타입, 스키마, seed 데이터 (LWPW-12, LWPW-13)

**Files:**
- Modify: `apps/backend/src/db.ts`

- [ ] **Step 1: db.ts 전체 교체**

`apps/backend/src/db.ts`:
```typescript
import { JSONFilePreset } from 'lowdb/node'

/**
 * # Accommodation
 * ---
 * - 간단설명: 숙소 데이터 모델
 * ---
 */
export interface Accommodation {
  id: number
  /** 숙소명 */
  name: string
  /** 도시/국가 */
  location: string
  /** 1박 가격 (원) */
  pricePerNight: number
  /** 예약 가능 여부 */
  available: boolean
  /** 평점 (0~5) */
  rating: number
  /** 편의시설 목록 */
  amenities: string[]
  /** 대표 이미지 URL */
  imageUrl: string
}

/**
 * 예약 상태
 * - confirmed = 예약 확정
 * - cancelled = 취소됨
 */
export type BookingStatus = 'confirmed' | 'cancelled'

/**
 * # Booking
 * ---
 * - 간단설명: 예약 데이터 모델
 * ---
 */
export interface Booking {
  id: number
  /** 예약 번호 (V-XXXX-XXXX 형식) */
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
  status: BookingStatus
  /** 총 결제 금액 (pricePerNight × 박수) */
  totalPrice: number
}

type Data = {
  items: { id: number; name: string }[]
  accommodations: Accommodation[]
  bookings: Booking[]
}

const defaultData: Data = {
  items: [],
  accommodations: [
    {
      id: 1,
      name: '제주 오션뷰 펜션',
      location: '제주',
      pricePerNight: 150000,
      available: true,
      rating: 4.8,
      amenities: ['수영장', '바비큐', '주차'],
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    },
    {
      id: 2,
      name: '교토 전통 료칸',
      location: '교토',
      pricePerNight: 280000,
      available: true,
      rating: 4.9,
      amenities: ['온천', '조식포함', '정원'],
      imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
    },
    {
      id: 3,
      name: '산토리니 블루돔 빌라',
      location: '산토리니',
      pricePerNight: 420000,
      available: true,
      rating: 4.7,
      amenities: ['수영장', '오션뷰', '조식포함'],
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    },
    {
      id: 4,
      name: '파리 샹젤리제 아파트',
      location: '파리',
      pricePerNight: 320000,
      available: true,
      rating: 4.6,
      amenities: ['주방', '에펠탑뷰', '와이파이'],
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    },
    {
      id: 5,
      name: '서울 강남 호텔',
      location: '서울',
      pricePerNight: 180000,
      available: true,
      rating: 4.5,
      amenities: ['피트니스', '조식포함', '주차'],
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    },
  ],
  bookings: [],
}

export const db = await JSONFilePreset<Data>('db.json', defaultData)
```

- [ ] **Step 2: 커밋**

```bash
git add apps/backend/src/db.ts
git commit -m "feat: 숙소/예약 데이터 모델 및 seed 데이터 추가 (LWPW-12, LWPW-13)"
```

---

### Task 3: GET /accommodations (LWPW-14)

**Files:**
- Modify: `apps/backend/src/index.test.ts`
- Modify: `apps/backend/src/index.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`apps/backend/src/index.test.ts` 전체 교체:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Accommodation, Booking } from './db.js'

vi.mock('./db.js', () => {
  const accommodations: Accommodation[] = [
    {
      id: 1,
      name: '제주 오션뷰 펜션',
      location: '제주',
      pricePerNight: 150000,
      available: true,
      rating: 4.8,
      amenities: ['수영장'],
      imageUrl: 'https://example.com/1.jpg',
    },
    {
      id: 2,
      name: '교토 전통 료칸',
      location: '교토',
      pricePerNight: 280000,
      available: true,
      rating: 4.9,
      amenities: ['온천'],
      imageUrl: 'https://example.com/2.jpg',
    },
  ]
  return {
    db: {
      data: { accommodations, bookings: [] as Booking[] },
      read: vi.fn().mockResolvedValue(undefined),
      write: vi.fn().mockResolvedValue(undefined),
    },
  }
})

import app from './index.js'
import { db } from './db.js'

beforeEach(() => {
  db.data.bookings = []
})

describe('GET /accommodations', () => {
  it('전체 목록을 반환한다', async () => {
    const res = await app.request('/accommodations')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(2)
  })

  it('location 파라미터로 필터링한다', async () => {
    const res = await app.request('/accommodations?location=제주')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].location).toBe('제주')
  })

  it('keyword 파라미터로 숙소명 검색한다', async () => {
    const res = await app.request('/accommodations?keyword=료칸')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('교토 전통 료칸')
  })
})
```

- [ ] **Step 2: 테스트 실행 - 실패 확인**

```bash
cd apps/backend && pnpm test
```
Expected: FAIL (라우트 미존재로 404)

- [ ] **Step 3: index.ts에 GET /accommodations 추가**

`apps/backend/src/index.ts` 전체 교체:

```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db.js'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello from Hono' }))

app.get('/items', async (c) => {
  await db.read()
  return c.json(db.data.items)
})

app.post('/items', async (c) => {
  const body = await c.req.json<{ name: string }>()
  const item = { id: Date.now(), name: body.name }
  db.data.items.push(item)
  await db.write()
  return c.json(item, 201)
})

/**
 * # GET /accommodations
 * ---
 * - 간단설명: 숙소 목록 조회 (검색 필터 포함)
 * - 제약사항: location은 완전일치, keyword는 숙소명 부분일치
 * ---
 * @param location 도시명 (완전일치)
 * @param keyword 숙소명 검색어 (부분일치)
 * @example GET /accommodations?location=제주&keyword=펜션
 */
app.get('/accommodations', async (c) => {
  await db.read()
  const location = c.req.query('location')
  const keyword = c.req.query('keyword')
  let result = db.data.accommodations
  if (location) result = result.filter((a) => a.location === location)
  if (keyword) result = result.filter((a) => a.name.includes(keyword))
  return c.json(result)
})

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Backend running on http://localhost:3000')
})

export default app
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd apps/backend && pnpm test
```
Expected: PASS (3 passed)

- [ ] **Step 5: 커밋**

```bash
git add apps/backend/src/index.ts apps/backend/src/index.test.ts
git commit -m "feat: GET /accommodations 검색 필터 구현 (LWPW-14)"
```

---

### Task 4: GET /accommodations/:id (LWPW-15)

**Files:**
- Modify: `apps/backend/src/index.test.ts`
- Modify: `apps/backend/src/index.ts`

- [ ] **Step 1: 실패하는 테스트 추가**

`apps/backend/src/index.test.ts` 끝에 추가:

```typescript
describe('GET /accommodations/:id', () => {
  it('존재하는 id이면 숙소 객체를 반환한다', async () => {
    const res = await app.request('/accommodations/1')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(1)
    expect(body.name).toBe('제주 오션뷰 펜션')
  })

  it('없는 id이면 404를 반환한다', async () => {
    const res = await app.request('/accommodations/999')
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
```

- [ ] **Step 2: 테스트 실행 - 실패 확인**

```bash
cd apps/backend && pnpm test
```
Expected: FAIL (2 new tests fail)

- [ ] **Step 3: index.ts에 GET /accommodations/:id 추가**

`app.get('/accommodations', ...)` 블록 바로 아래에 추가:

```typescript
/**
 * # GET /accommodations/:id
 * ---
 * - 간단설명: 숙소 상세 조회
 * - 제약사항: id가 없으면 404 반환
 * ---
 * @param id 숙소 ID
 * @example GET /accommodations/1
 */
app.get('/accommodations/:id', async (c) => {
  await db.read()
  const id = Number(c.req.param('id'))
  const accommodation = db.data.accommodations.find((a) => a.id === id)
  if (!accommodation) return c.json({ error: '숙소를 찾을 수 없습니다' }, 404)
  return c.json(accommodation)
})
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd apps/backend && pnpm test
```
Expected: PASS (5 passed)

- [ ] **Step 5: 커밋**

```bash
git add apps/backend/src/index.ts apps/backend/src/index.test.ts
git commit -m "feat: GET /accommodations/:id 숙소 상세 구현 (LWPW-15)"
```

---

### Task 5: POST /bookings (LWPW-16)

**Files:**
- Modify: `apps/backend/src/index.test.ts`
- Modify: `apps/backend/src/index.ts`

- [ ] **Step 1: 실패하는 테스트 추가**

`apps/backend/src/index.test.ts` 끝에 추가:

```typescript
describe('POST /bookings', () => {
  it('정상 요청이면 201과 예약 객체를 반환한다', async () => {
    const res = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-01',
        checkOut: '2026-07-03',
      }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.bookingNumber).toMatch(/^V-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    expect(body.status).toBe('confirmed')
    expect(body.totalPrice).toBe(300000) // 150000 × 2박
    expect(body.guestName).toBe('홍길동')
  })

  it('중복 일정이면 409를 반환한다', async () => {
    db.data.bookings = [
      {
        id: 1,
        bookingNumber: 'V-AAAA-BBBB',
        accommodationId: 1,
        guestName: '이미예약',
        checkIn: '2026-07-01',
        checkOut: '2026-07-05',
        status: 'confirmed',
        totalPrice: 600000,
      },
    ]
    const res = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-03',
        checkOut: '2026-07-07',
      }),
    })
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
```

- [ ] **Step 2: 테스트 실행 - 실패 확인**

```bash
cd apps/backend && pnpm test
```
Expected: FAIL (2 new tests fail)

- [ ] **Step 3: index.ts에 헬퍼 함수 + POST /bookings 추가**

`serve(...)` 호출 바로 위에 추가:

```typescript
/**
 * # generateBookingNumber
 * ---
 * - 간단설명: V-XXXX-XXXX 형식의 예약 번호 생성
 * ---
 * @example generateBookingNumber() // 'V-K3F2-9ZAB'
 */
function generateBookingNumber(): string {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase().padEnd(4, '0')
  return `V-${rand()}-${rand()}`
}

/**
 * # isOverlapping
 * ---
 * - 간단설명: 두 날짜 구간의 겹침 여부 확인
 * ---
 * @param aIn 구간 A 시작일 (YYYY-MM-DD)
 * @param aOut 구간 A 종료일 (YYYY-MM-DD)
 * @param bIn 구간 B 시작일 (YYYY-MM-DD)
 * @param bOut 구간 B 종료일 (YYYY-MM-DD)
 * @example isOverlapping('2026-07-01', '2026-07-05', '2026-07-03', '2026-07-07') // true
 */
function isOverlapping(aIn: string, aOut: string, bIn: string, bOut: string): boolean {
  return aIn < bOut && aOut > bIn
}

/**
 * # POST /bookings
 * ---
 * - 간단설명: 예약 생성 (중복 일정 검증 포함)
 * - 제약사항: 같은 숙소에 겹치는 confirmed 예약이 있으면 409 반환
 * ---
 * @param accommodationId 숙소 ID
 * @param guestName 투숙객 이름
 * @param checkIn 체크인 날짜 (YYYY-MM-DD)
 * @param checkOut 체크아웃 날짜 (YYYY-MM-DD)
 * @example POST /bookings { accommodationId: 1, guestName: '홍길동', checkIn: '2026-07-01', checkOut: '2026-07-03' }
 */
app.post('/bookings', async (c) => {
  await db.read()
  const body = await c.req.json<{
    accommodationId: number
    guestName: string
    checkIn: string
    checkOut: string
  }>()

  const accommodation = db.data.accommodations.find((a) => a.id === body.accommodationId)
  if (!accommodation) return c.json({ error: '숙소를 찾을 수 없습니다' }, 404)

  const isDuplicate = db.data.bookings.some(
    (b) =>
      b.accommodationId === body.accommodationId &&
      b.status === 'confirmed' &&
      isOverlapping(body.checkIn, body.checkOut, b.checkIn, b.checkOut)
  )
  if (isDuplicate) return c.json({ error: '해당 기간에 이미 예약이 있습니다' }, 409)

  const nights = Math.ceil(
    (new Date(body.checkOut).getTime() - new Date(body.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )

  const booking = {
    id: Date.now(),
    bookingNumber: generateBookingNumber(),
    accommodationId: body.accommodationId,
    guestName: body.guestName,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    status: 'confirmed' as const,
    totalPrice: accommodation.pricePerNight * nights,
  }

  db.data.bookings.push(booking)
  await db.write()
  return c.json(booking, 201)
})
```

> **주의:** `generateBookingNumber`와 `isOverlapping` 함수는 `serve(...)` 호출 이전 어디든 추가 가능하다.

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd apps/backend && pnpm test
```
Expected: PASS (7 passed)

- [ ] **Step 5: 커밋**

```bash
git add apps/backend/src/index.ts apps/backend/src/index.test.ts
git commit -m "feat: POST /bookings 예약 생성 및 중복 일정 검증 구현 (LWPW-16)"
```

---

### Task 6: GET /bookings/:bookingNumber (LWPW-17)

**Files:**
- Modify: `apps/backend/src/index.test.ts`
- Modify: `apps/backend/src/index.ts`

- [ ] **Step 1: 실패하는 테스트 추가**

`apps/backend/src/index.test.ts` 끝에 추가:

```typescript
describe('GET /bookings/:bookingNumber', () => {
  beforeEach(() => {
    db.data.bookings = [
      {
        id: 1,
        bookingNumber: 'V-TEST-1234',
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-01',
        checkOut: '2026-07-03',
        status: 'confirmed',
        totalPrice: 300000,
      },
    ]
  })

  it('존재하는 bookingNumber이면 예약 객체를 반환한다', async () => {
    const res = await app.request('/bookings/V-TEST-1234')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.bookingNumber).toBe('V-TEST-1234')
    expect(body.guestName).toBe('홍길동')
  })

  it('없는 bookingNumber이면 404를 반환한다', async () => {
    const res = await app.request('/bookings/V-NONE-0000')
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
```

- [ ] **Step 2: 테스트 실행 - 실패 확인**

```bash
cd apps/backend && pnpm test
```
Expected: FAIL (2 new tests fail)

- [ ] **Step 3: index.ts에 GET /bookings/:bookingNumber 추가**

`app.post('/bookings', ...)` 블록 아래에 추가:

```typescript
/**
 * # GET /bookings/:bookingNumber
 * ---
 * - 간단설명: 예약 번호로 예약 조회
 * - 제약사항: 없는 번호이면 404 반환
 * ---
 * @param bookingNumber 예약 번호 (V-XXXX-XXXX 형식)
 * @example GET /bookings/V-K3F2-9ZAB
 */
app.get('/bookings/:bookingNumber', async (c) => {
  await db.read()
  const { bookingNumber } = c.req.param()
  const booking = db.data.bookings.find((b) => b.bookingNumber === bookingNumber)
  if (!booking) return c.json({ error: '예약을 찾을 수 없습니다' }, 404)
  return c.json(booking)
})
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd apps/backend && pnpm test
```
Expected: PASS (9 passed)

- [ ] **Step 5: 커밋**

```bash
git add apps/backend/src/index.ts apps/backend/src/index.test.ts
git commit -m "feat: GET /bookings/:bookingNumber 예약 조회 구현 (LWPW-17)"
```

---

### Task 7: PATCH /bookings/:id/cancel (LWPW-18)

**Files:**
- Modify: `apps/backend/src/index.test.ts`
- Modify: `apps/backend/src/index.ts`

- [ ] **Step 1: 실패하는 테스트 추가**

`apps/backend/src/index.test.ts` 끝에 추가:

```typescript
describe('PATCH /bookings/:id/cancel', () => {
  beforeEach(() => {
    db.data.bookings = [
      {
        id: 100,
        bookingNumber: 'V-CANC-TEST',
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-01',
        checkOut: '2026-07-03',
        status: 'confirmed',
        totalPrice: 300000,
      },
    ]
  })

  it('정상 취소: 200과 업데이트된 예약 객체를 반환한다', async () => {
    const res = await app.request('/bookings/100/cancel', { method: 'PATCH' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('cancelled')
    expect(body.id).toBe(100)
  })

  it('이미 취소된 예약은 400을 반환한다', async () => {
    db.data.bookings[0].status = 'cancelled'
    const res = await app.request('/bookings/100/cancel', { method: 'PATCH' })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('없는 id이면 404를 반환한다', async () => {
    const res = await app.request('/bookings/999/cancel', { method: 'PATCH' })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
```

- [ ] **Step 2: 테스트 실행 - 실패 확인**

```bash
cd apps/backend && pnpm test
```
Expected: FAIL (3 new tests fail)

- [ ] **Step 3: index.ts에 PATCH /bookings/:id/cancel 추가**

`app.get('/bookings/:bookingNumber', ...)` 블록 아래에 추가:

```typescript
/**
 * # PATCH /bookings/:id/cancel
 * ---
 * - 간단설명: 예약 취소
 * - 제약사항: 이미 취소된 예약은 400 반환, 없는 id는 404 반환
 * ---
 * @param id 예약 ID
 * @example PATCH /bookings/1/cancel
 */
app.patch('/bookings/:id/cancel', async (c) => {
  await db.read()
  const id = Number(c.req.param('id'))
  const booking = db.data.bookings.find((b) => b.id === id)
  if (!booking) return c.json({ error: '예약을 찾을 수 없습니다' }, 404)
  if (booking.status === 'cancelled') return c.json({ error: '이미 취소된 예약입니다' }, 400)
  booking.status = 'cancelled'
  await db.write()
  return c.json(booking)
})
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd apps/backend && pnpm test
```
Expected: PASS (12 passed)

- [ ] **Step 5: 커밋**

```bash
git add apps/backend/src/index.ts apps/backend/src/index.test.ts
git commit -m "feat: PATCH /bookings/:id/cancel 예약 취소 구현 (LWPW-18)"
```
