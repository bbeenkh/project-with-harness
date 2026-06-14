import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createBooking } from './bookingApi'
import type { Booking } from '../types/booking'

const mockAccommodations = [
  {
    id: 1,
    name: '제주 신라호텔',
    location: '제주',
    pricePerNight: 250000,
    available: true,
  },
]

const server = setupServer(
  http.post('http://localhost:3000/bookings', async ({ request }) => {
    const body = (await request.json()) as {
      accommodationId: number
      guestName: string
      checkIn: string
      checkOut: string
    }
    const accommodation = mockAccommodations.find((a) => a.id === body.accommodationId)
    if (!accommodation) {
      return HttpResponse.json({ error: '숙소를 찾을 수 없습니다' }, { status: 404 })
    }
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
    return HttpResponse.json(booking, { status: 201 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

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
