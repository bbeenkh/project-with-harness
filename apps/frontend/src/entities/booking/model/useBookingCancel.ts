import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBooking } from '../api/bookingApi'

/**
 * # useBookingCancel
 * ---
 * - 간단설명: 예약 취소 Mutation 훅 — 성공 시 해당 예약 쿼리를 무효화해 자동 갱신
 * - 제약사항: bookingNumber가 없으면 invalidateQueries 미실행
 * ---
 * @param bookingNumber - 현재 조회된 예약 번호 (쿼리 무효화 키로 사용)
 * @example
 * const { mutate, isPending } = useBookingCancel('V-K3F2-9ZAB')
 * mutate(1)
 */
export const useBookingCancel = (bookingNumber: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingNumber] })
    },
  })
}
