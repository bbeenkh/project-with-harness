import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useBookingForm } from './useBookingForm'
import { createQueryWrapper } from '../../../test/queryWrapper'
import type { Booking } from '../../../entities/booking/types/booking'

const server = setupServer(
  http.post('http://localhost:3000/bookings', async ({ request }) => {
    const body = (await request.json()) as {
      accommodationId: number
      guestName: string
      checkIn: string
      checkOut: string
    }
    if (body.accommodationId !== 1) {
      return HttpResponse.json({ error: '숙소를 찾을 수 없습니다' }, { status: 404 })
    }
    const booking: Booking = {
      id: Date.now(),
      bookingNumber: `V-TEST-ABCD`,
      accommodationId: body.accommodationId,
      guestName: body.guestName,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      status: 'confirmed',
      totalPrice: 500000,
    }
    return HttpResponse.json(booking, { status: 201 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

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
