import type { Meta, StoryObj } from '@storybook/react'
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

const meta: Meta<typeof BookingDetailCard> = {
  title: 'Features/BookingManagement/BookingDetailCard',
  component: BookingDetailCard,
  tags: ['autodocs'],
  args: {
    onCancel: () => {},
    onPrintReceipt: () => {},
    isCancelling: false,
  },
}

export default meta
type Story = StoryObj<typeof BookingDetailCard>

/** 확정된 예약 — 예약 취소 버튼 노출 */
export const Confirmed: Story = {
  args: { booking: mockConfirmedBooking },
}

/** 취소된 예약 — 취소 버튼 미노출 */
export const Cancelled: Story = {
  args: { booking: mockCancelledBooking },
}

/** 취소 API 호출 중 — 버튼 비활성화 */
export const Cancelling: Story = {
  args: { booking: mockConfirmedBooking, isCancelling: true },
}
