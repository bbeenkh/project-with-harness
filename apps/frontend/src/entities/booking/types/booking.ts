/**
 * 예약 정보
 * - id: 예약 고유 ID
 * - bookingNumber: V-XXXX-XXXX 형식 예약 번호
 * - accommodationId: 숙소 ID
 * - guestName: 투숙객 이름
 * - checkIn: 체크인 날짜 (YYYY-MM-DD)
 * - checkOut: 체크아웃 날짜 (YYYY-MM-DD)
 * - status: 예약 상태 (confirmed | cancelled)
 * - totalPrice: 총 결제 금액 (원)
 */
export interface Booking {
  /** 예약 고유 ID */
  id: number
  /** V-XXXX-XXXX 형식 예약 번호 */
  bookingNumber: string
  /** 숙소 ID */
  accommodationId: number
  /** 투숙객 이름 */
  guestName: string
  /** 체크인 날짜 (YYYY-MM-DD) */
  checkIn: string
  /** 체크아웃 날짜 (YYYY-MM-DD) */
  checkOut: string
  /** 예약 상태 */
  status: 'confirmed' | 'cancelled'
  /** 총 결제 금액 (원) */
  totalPrice: number
}

/**
 * 예약 생성 요청 입력
 * - accommodationId: 숙소 ID
 * - guestName: 투숙객 이름
 * - checkIn: 체크인 날짜 (YYYY-MM-DD)
 * - checkOut: 체크아웃 날짜 (YYYY-MM-DD)
 */
export interface CreateBookingInput {
  /** 숙소 ID */
  accommodationId: number
  /** 투숙객 이름 */
  guestName: string
  /** 체크인 날짜 (YYYY-MM-DD) */
  checkIn: string
  /** 체크아웃 날짜 (YYYY-MM-DD) */
  checkOut: string
}
