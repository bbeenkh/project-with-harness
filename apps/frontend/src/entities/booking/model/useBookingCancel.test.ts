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
