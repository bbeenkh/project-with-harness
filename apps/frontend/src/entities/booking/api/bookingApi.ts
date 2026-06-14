import axiosInstance from '../../../shared/api/axiosInstance'
import type { Booking, CreateBookingInput } from '../types/booking'

/**
 * # createBooking
 * ---
 * - 간단설명: 예약 생성 API 호출
 * - 제약사항: 중복 일정이면 409 에러 반환
 * ---
 * @param input - 예약 생성 입력값
 * @example
 * const booking = await createBooking({ accommodationId: 1, guestName: '홍길동', checkIn: '2026-07-01', checkOut: '2026-07-03' })
 */
export const createBooking = async (input: CreateBookingInput): Promise<Booking> => {
  const { data } = await axiosInstance.post<Booking>('/bookings', input)
  return data
}

/**
 * # fetchBooking
 * ---
 * - 간단설명: 예약 번호로 예약 조회
 * - 제약사항: 없는 번호이면 404 에러 반환
 * ---
 * @param bookingNumber - V-XXXX-XXXX 형식 예약 번호
 * @example
 * const booking = await fetchBooking('V-K3F2-9ZAB')
 */
export const fetchBooking = async (bookingNumber: string): Promise<Booking> => {
  const { data } = await axiosInstance.get<Booking>(`/bookings/${bookingNumber}`)
  return data
}

/**
 * # cancelBooking
 * ---
 * - 간단설명: 예약 ID로 예약 취소
 * - 제약사항: 이미 취소된 예약이면 400 에러 반환, 존재하지 않는 id는 404 에러 반환
 * ---
 * @param id - 예약 고유 ID
 * @example
 * const cancelled = await cancelBooking(1)
 */
export const cancelBooking = async (id: number): Promise<Booking> => {
  const { data } = await axiosInstance.patch<Booking>(`/bookings/${id}/cancel`)
  return data
}
