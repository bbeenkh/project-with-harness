import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBooking } from '../api/bookingApi'
import type { Booking } from '../types/booking'

/**
 * # useBookingCancel
 * ---
 * - 간단설명: 예약 취소 Mutation 훅 — 성공 시 해당 예약 쿼리 캐시를 응답 데이터로 즉시 업데이트
 * - 제약사항: bookingNumber가 없으면 setQueryData 미실행
 * ---
 * @param bookingNumber - 현재 조회된 예약 번호 (쿼리 캐시 키로 사용)
 * @example
 * const { mutate, isPending } = useBookingCancel('V-K3F2-9ZAB')
 * mutate(1)
 */
export const useBookingCancel = (bookingNumber: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cancelBooking(id),
    onSuccess: (updatedBooking: Booking) => {
      if (bookingNumber) {
        queryClient.setQueryData(['booking', bookingNumber], updatedBooking)
      }
    },
  })
}
