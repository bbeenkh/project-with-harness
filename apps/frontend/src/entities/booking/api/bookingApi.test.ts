import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createBooking, fetchBooking, cancelBooking } from './bookingApi'
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

describe('fetchBooking', () => {
  const fetchBookingServer = setupServer(
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
  beforeAll(() => fetchBookingServer.listen())
  afterEach(() => fetchBookingServer.resetHandlers())
  afterAll(() => fetchBookingServer.close())

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
  const cancelBookingServer = setupServer(
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
  beforeAll(() => cancelBookingServer.listen())
  afterEach(() => cancelBookingServer.resetHandlers())
  afterAll(() => cancelBookingServer.close())

  it('예약 ID로 취소하면 status가 cancelled인 Booking을 반환한다', async () => {
    const booking = await cancelBooking(1)
    expect(booking.status).toBe('cancelled')
    expect(booking.bookingNumber).toBe('V-K3F2-9ZAB')
  })

  it('존재하지 않는 예약 ID로 취소하면 에러가 발생한다', async () => {
    await expect(cancelBooking(9999)).rejects.toThrow()
  })
})
