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

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Backend running on http://localhost:3000')
})

export default app
