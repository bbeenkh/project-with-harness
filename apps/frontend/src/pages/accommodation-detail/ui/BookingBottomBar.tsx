import { useState } from 'react'
import type { AxiosError } from 'axios'
import { useBookingForm } from '../../../features/booking'
import type { Booking } from '../../../entities/booking'
import { Button, Input } from '../../../shared/ui/primitive'

interface Props {
  pricePerNight: number
  accommodationId: number
}

/**
 * # BookingBottomBar
 * ---
 * - 간단설명: 하단 고정 예약 바 — 가격·날짜·이름 폼을 인라인으로 포함, "지금 예약하기" 코랄 버튼
 * - 제약사항: 예약 성공 시 완료 상태로 전환, 닫기 버튼으로 초기화
 * ---
 * @param pricePerNight - 1박 가격 (원)
 * @param accommodationId - 숙소 ID (예약 생성 시 사용)
 * @example
 * <BookingBottomBar pricePerNight={450000} accommodationId={1} />
 */
export default function BookingBottomBar({ pricePerNight, accommodationId }: Props) {
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)

  const {
    guestName, setGuestName,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    isValid, isPending, error, submit,
  } = useBookingForm(accommodationId, {
    onSuccess: (booking) => setConfirmedBooking(booking),
  })

  if (confirmedBooking) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant rounded-t-2xl shadow-2xl px-margin-mobile pt-5 pb-8">
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <p className="font-plus-jakarta text-headline-md text-surface-on">예약 완료!</p>
          <p className="font-inter text-label-sm text-surface-on-variant">
            예약 번호: <span className="text-primary font-bold">{confirmedBooking.bookingNumber}</span>
          </p>
          <p className="font-inter text-label-sm text-surface-on-variant">
            {confirmedBooking.checkIn} → {confirmedBooking.checkOut} · 총{' '}
            {confirmedBooking.totalPrice.toLocaleString()}원
          </p>
          <Button
            variant="ghost"
            className="w-full mt-1"
            onClick={() => setConfirmedBooking(null)}
          >
            닫기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant rounded-t-2xl shadow-2xl px-margin-mobile pt-4 pb-8">
      {/* 가격 + 세부 정책 링크 */}
      <div className="flex items-baseline gap-1 mb-3">
        <span className="font-plus-jakarta text-headline-lg-mobile text-surface-on font-bold">
          ₩{pricePerNight.toLocaleString()}
        </span>
        <span className="font-inter text-body-sm text-surface-on-variant">/박</span>
        <button
          type="button"
          className="ml-auto font-inter text-label-sm text-primary underline underline-offset-2"
        >
          세부 가격 정책
        </button>
      </div>

      {/* 체크인/체크아웃 */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="font-inter text-label-sm text-surface-on-variant block mb-1">체크인</label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="font-inter text-label-sm text-surface-on-variant block mb-1">체크아웃</label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* 예약자 성함 */}
      <div className="mb-3">
        <label className="font-inter text-label-sm text-surface-on-variant block mb-1">예약자 성함</label>
        <Input
          type="text"
          placeholder="홍길동"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="font-inter text-label-sm text-error mb-2">
          {(error as AxiosError<{ error: string }>).response?.data?.error ?? '예약 중 오류가 발생했습니다'}
        </p>
      )}

      {/* CTA 버튼 (코랄) */}
      <Button
        variant="action"
        onClick={submit}
        disabled={!isValid || isPending}
        className="w-full py-3 text-base font-semibold"
      >
        {isPending ? '예약 중...' : '지금 예약하기'}
      </Button>
    </div>
  )
}
