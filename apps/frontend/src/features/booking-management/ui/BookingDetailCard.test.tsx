import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookingDetailCard from './BookingDetailCard'
import type { Booking } from '../../../entities/booking'

const mockConfirmedBooking: Booking = {
  id: 1,
  bookingNumber: 'V-K3F2-9ZAB',
  accommodationId: 1,
  guestName: '홍길동',
  checkIn: '2026-07-10',
  checkOut: '2026-07-13',
  status: 'confirmed',
  totalPrice: 750000,
}

const mockCancelledBooking: Booking = {
  id: 2,
  bookingNumber: 'V-TEST-ABCD',
  accommodationId: 2,
  guestName: '김철수',
  checkIn: '2026-08-01',
  checkOut: '2026-08-03',
  status: 'cancelled',
  totalPrice: 360000,
}

const defaultProps = {
  booking: mockConfirmedBooking,
  onCancel: vi.fn(),
  onPrintReceipt: vi.fn(),
  isCancelling: false,
}

describe('BookingDetailCard', () => {
  it('예약 번호, 예약자명, 체크인/아웃 날짜를 렌더링한다', () => {
    render(<BookingDetailCard {...defaultProps} />)
    expect(screen.getByText('V-K3F2-9ZAB')).toBeInTheDocument()
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('2026-07-10')).toBeInTheDocument()
    expect(screen.getByText('2026-07-13')).toBeInTheDocument()
  })

  it('confirmed 상태이면 "확정됨" 배지를 표시한다', () => {
    render(<BookingDetailCard {...defaultProps} />)
    expect(screen.getByText('확정됨')).toBeInTheDocument()
  })

  it('cancelled 상태이면 "취소됨" 배지를 표시한다', () => {
    render(<BookingDetailCard {...defaultProps} booking={mockCancelledBooking} />)
    expect(screen.getByText('취소됨')).toBeInTheDocument()
  })

  it('confirmed 상태이면 예약 취소 버튼이 표시된다', () => {
    render(<BookingDetailCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /예약 취소/ })).toBeInTheDocument()
  })

  it('cancelled 상태이면 예약 취소 버튼이 표시되지 않는다', () => {
    render(<BookingDetailCard {...defaultProps} booking={mockCancelledBooking} />)
    expect(screen.queryByRole('button', { name: /예약 취소/ })).not.toBeInTheDocument()
  })

  it('예약 취소 버튼 클릭 시 onCancel 콜백이 호출된다', () => {
    const onCancel = vi.fn()
    render(<BookingDetailCard {...defaultProps} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /예약 취소/ }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('isCancelling이 true이면 취소 버튼이 비활성화된다', () => {
    render(<BookingDetailCard {...defaultProps} isCancelling={true} />)
    expect(screen.getByRole('button', { name: /취소 중/ })).toBeDisabled()
  })

  it('영수증 출력 버튼 클릭 시 onPrintReceipt 콜백이 호출된다', () => {
    const onPrintReceipt = vi.fn()
    render(<BookingDetailCard {...defaultProps} onPrintReceipt={onPrintReceipt} />)
    fireEvent.click(screen.getByRole('button', { name: /영수증 출력/ }))
    expect(onPrintReceipt).toHaveBeenCalledTimes(1)
  })
})
