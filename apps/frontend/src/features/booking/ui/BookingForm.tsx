import { useBookingForm } from '../model/useBookingForm'
import type { Booking } from '../../../entities/booking'
import { Button } from '../../../shared/ui/primitive'
import { Input } from '../../../shared/ui/primitive'

interface Props {
  accommodationId: number
  pricePerNight: number
  onSuccess: (booking: Booking) => void
}

/**
 * # BookingForm
 * ---
 * - 간단설명: 체크인/체크아웃/이름 입력 예약 폼
 * - 제약사항: isValid false이면 제출 버튼 비활성화
 * ---
 * @param accommodationId - 숙소 ID
 * @param pricePerNight - 1박 가격 (총액 미리보기용)
 * @param onSuccess - 예약 완료 콜백
 * @example
 * <BookingForm accommodationId={1} pricePerNight={150000} onSuccess={(b) => setBooking(b)} />
 */
export default function BookingForm({ accommodationId, pricePerNight, onSuccess }: Props) {
  const {
    guestName, setGuestName,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    isValid, isPending, error, submit,
  } = useBookingForm(accommodationId, { onSuccess })

  const nights =
    checkIn && checkOut && checkIn < checkOut
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
      : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-inter text-label-sm text-surface-on-variant">체크인</label>
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-inter text-label-sm text-surface-on-variant">체크아웃</label>
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-inter text-label-sm text-surface-on-variant">투숙객 이름</label>
        <Input
          type="text"
          placeholder="홍길동"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </div>
      {nights > 0 && (
        <div className="bg-surface-container-low rounded-lg p-3 flex justify-between items-center">
          <span className="font-inter text-body-sm text-surface-on-variant">{nights}박 총액</span>
          <span className="font-plus-jakarta text-headline-md text-surface-on">
            {(pricePerNight * nights).toLocaleString()}원
          </span>
        </div>
      )}
      {error && (
        <p className="font-inter text-label-sm text-error">
          {(error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? '예약 중 오류가 발생했습니다'}
        </p>
      )}
      <Button
        onClick={submit}
        disabled={!isValid || isPending}
        className="w-full"
      >
        {isPending ? '예약 중...' : '예약 확정'}
      </Button>
    </div>
  )
}
