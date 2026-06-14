import type { Booking } from '../../../entities/booking'
import Button from '../../../shared/ui/primitive/Button'

interface Props {
  booking: Booking
  onCancel: () => void
  onPrintReceipt: () => void
  isCancelling: boolean
}

const ACCOMMODATION_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  3: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
}
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'

const ACCOMMODATION_NAMES: Record<number, string> = {
  1: '제주 신라호텔',
  2: '부산 파라다이스 호텔',
  3: '서울 롯데호텔',
}

/**
 * # BookingDetailCard
 * ---
 * - 간단설명: 조회된 예약의 상세 정보를 카드 형태로 표시 — 숙소 이미지, 상태 배지, 2x2 그리드, 액션 버튼
 * - 제약사항: confirmed 상태일 때만 예약 취소 버튼 노출
 * ---
 * @param booking - 조회된 예약 데이터
 * @param onCancel - 예약 취소 버튼 클릭 콜백
 * @param onPrintReceipt - 영수증 출력 버튼 클릭 콜백
 * @param isCancelling - 취소 API 호출 중 여부
 * @example
 * <BookingDetailCard booking={booking} onCancel={handleCancel} onPrintReceipt={handlePrint} isCancelling={false} />
 */
export default function BookingDetailCard({ booking, onCancel, onPrintReceipt, isCancelling }: Props) {
  const imageUrl = ACCOMMODATION_IMAGES[booking.accommodationId] ?? FALLBACK_IMAGE
  const accommodationName = ACCOMMODATION_NAMES[booking.accommodationId] ?? '숙소'
  const isConfirmed = booking.status === 'confirmed'

  return (
    <article className="mx-margin-mobile rounded-xl overflow-hidden shadow-sm border border-outline-variant">
      <div className="relative">
        <img src={imageUrl} alt="숙소 이미지" className="w-full h-48 object-cover" />
        <span
          className={`absolute top-3 left-3 font-inter text-label-sm px-3 py-1 rounded-full ${
            isConfirmed
              ? 'bg-primary-container text-primary-on'
              : 'bg-surface-container-high text-surface-on-variant'
          }`}
        >
          {isConfirmed ? '확정됨' : '취소됨'}
        </span>
      </div>
      <div className="p-md">
        <p className="font-plus-jakarta text-headline-md text-surface-on">{accommodationName}</p>
        <p className="font-inter text-label-sm text-surface-on-variant mb-md">{booking.bookingNumber}</p>
        <div className="grid grid-cols-2 gap-sm mb-md">
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">체크인</p>
            <p className="font-inter text-body-sm text-surface-on">{booking.checkIn}</p>
          </div>
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">체크아웃</p>
            <p className="font-inter text-body-sm text-surface-on">{booking.checkOut}</p>
          </div>
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">예약자</p>
            <p className="font-inter text-body-sm text-surface-on">{booking.guestName}</p>
          </div>
          <div>
            <p className="font-inter text-label-sm text-surface-on-variant">결제 상태</p>
            <p className="font-inter text-body-sm text-surface-on">결제 완료</p>
          </div>
        </div>
        <div className="flex gap-sm">
          <Button variant="ghost" className="flex-1" onClick={onPrintReceipt}>
            영수증 출력
          </Button>
          {isConfirmed && (
            <Button
              variant="action"
              className="flex-1"
              onClick={onCancel}
              disabled={isCancelling}
            >
              {isCancelling ? '취소 중...' : '예약 취소'}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
