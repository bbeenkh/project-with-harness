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
