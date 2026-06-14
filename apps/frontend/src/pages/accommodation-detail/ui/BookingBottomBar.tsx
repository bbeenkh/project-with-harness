import { Button } from '../../../shared/ui/primitive'

interface Props {
  pricePerNight: number
  onBookingClick: () => void
}

/**
 * # BookingBottomBar
 * ---
 * - 간단설명: 스크롤과 무관하게 하단에 고정되는 가격 표시 + 예약 버튼 바
 * ---
 * @param pricePerNight - 1박 가격 (원)
 * @param onBookingClick - 예약하기 버튼 클릭 콜백
 * @example
 * <BookingBottomBar pricePerNight={150000} onBookingClick={() => setOpen(true)} />
 */
export default function BookingBottomBar({ pricePerNight, onBookingClick }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-outline-variant px-margin-mobile py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div>
          <span className="font-inter text-label-sm text-outline block">1박당</span>
          <span className="font-plus-jakarta text-headline-md text-surface-on">
            {pricePerNight.toLocaleString()}원
          </span>
        </div>
        <Button onClick={onBookingClick}>지금 예약하기</Button>
      </div>
    </div>
  )
}
