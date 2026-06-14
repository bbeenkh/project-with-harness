import type { Booking } from '../../../entities/booking'
import { Button } from '../../../shared/ui/primitive'

interface Props {
  booking: Booking
  onClose: () => void
}

/**
 * # BookingConfirmation
 * ---
 * - 간단설명: 예약 완료 후 예약번호·기간·금액을 표시하는 확인 화면
 * ---
 * @param booking - 완료된 예약 정보
 * @param onClose - 닫기 콜백
 * @example
 * <BookingConfirmation booking={booking} onClose={() => setOpen(false)} />
 */
export default function BookingConfirmation({ booking, onClose }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>
      <div className="text-center">
        <h3 className="font-plus-jakarta text-headline-md text-surface-on mb-1">예약 완료!</h3>
        <p className="font-inter text-body-sm text-surface-on-variant">예약이 성공적으로 확정되었습니다.</p>
      </div>
      <div className="w-full bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">예약 번호</span>
          <span className="font-plus-jakarta text-label-lg text-primary font-bold">{booking.bookingNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">체크인</span>
          <span className="font-inter text-body-sm text-surface-on">{booking.checkIn}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">체크아웃</span>
          <span className="font-inter text-body-sm text-surface-on">{booking.checkOut}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-inter text-label-sm text-surface-on-variant">총 금액</span>
          <span className="font-plus-jakarta text-headline-md text-surface-on">{booking.totalPrice.toLocaleString()}원</span>
        </div>
      </div>
      <Button onClick={onClose} className="w-full">확인</Button>
    </div>
  )
}
