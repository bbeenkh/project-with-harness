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
