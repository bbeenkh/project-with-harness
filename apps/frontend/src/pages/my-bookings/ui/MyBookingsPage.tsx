import { useState } from 'react'
import Toast from '../../../shared/ui/primitive/Toast'
import { useBookingSearch } from '../../../entities/booking/model/useBookingSearch'
import { useBookingCancel } from '../../../entities/booking/model/useBookingCancel'
import BookingSearchSection from '../../../features/booking-management/ui/BookingSearchSection'
import BookingDetailCard from '../../../features/booking-management/ui/BookingDetailCard'
import BookingInfoNote from '../../../features/booking-management/ui/BookingInfoNote'

/**
 * # MyBookingsPage
 * ---
 * - 간단설명: 예약 번호 입력 조회 → 예약 상세 카드 + 취소 + 영수증 출력이 가능한 예약 관리 페이지
 * - 제약사항: /my-bookings 라우트에서 사용, BottomNav는 App.tsx 공통 레이아웃에서 주입
 * ---
 * @example
 * <Route path="/my-bookings" element={<MyBookingsPage />} />
 */
export default function MyBookingsPage() {
  const {
    inputValue,
    setInputValue,
    search,
    submittedNumber,
    data: booking,
    isLoading,
    isError,
  } = useBookingSearch()

  const { mutate: cancel, isPending: isCancelling } = useBookingCancel(submittedNumber)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setToastOpen(true)
  }

  const handleCancel = () => {
    if (!booking) return
    cancel(booking.id, {
      onSuccess: () => showToast('예약이 취소되었습니다'),
      onError: () => showToast('취소에 실패했습니다'),
    })
  }

  return (
    <Toast.Provider
      open={toastOpen}
      onOpenChange={setToastOpen}
      message={toastMessage}
      styleClass={{
        root: 'bg-surface-inverse text-surface-inverse-on rounded-xl px-md py-sm font-inter text-body-sm',
        viewport: 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs',
      }}
    >
      <div className="pt-16 pb-16">
        {/* 앱바 */}
        <header className="fixed top-0 w-full z-50 bg-surface shadow-sm flex justify-between items-center px-margin-mobile h-16">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
              travel_explore
            </span>
            <span className="font-plus-jakarta text-headline-lg-mobile text-primary">Voyage</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary-container" />
        </header>

        <BookingSearchSection
          inputValue={inputValue}
          onChange={setInputValue}
          onSearch={search}
          isLoading={isLoading}
        />

        {isLoading && (
          <p className="text-center font-inter text-body-sm text-surface-on-variant py-lg">
            조회 중...
          </p>
        )}

        {isError && (
          <p
            className="text-center font-inter text-body-sm text-error py-lg"
            role="alert"
          >
            예약을 찾을 수 없습니다
          </p>
        )}

        {booking && (
          <>
            <BookingDetailCard
              booking={booking}
              onCancel={handleCancel}
              onPrintReceipt={() => showToast('영수증 출력 기능은 준비 중입니다')}
              isCancelling={isCancelling}
            />
            <BookingInfoNote />
          </>
        )}
      </div>
    </Toast.Provider>
  )
}
