/**
 * 예약 정보
 * - id: 예약 고유 ID
 * - bookingNumber: 예약 번호 (확인용)
 * - accommodationId: 숙소 ID (외래키)
 * - guestName: 예약자 이름
 * - checkIn: 체크인 날짜 (YYYY-MM-DD)
 * - checkOut: 체크아웃 날짜 (YYYY-MM-DD)
 * - status: 예약 상태 (confirmed, cancelled, pending)
 * - totalPrice: 총 가격 (원)
 */
export interface Booking {
  /** 예약 고유 ID */
  id: number
  /** 예약 번호 */
  bookingNumber: string
  /** 숙소 ID */
  accommodationId: number
  /** 예약자 이름 */
  guestName: string
  /** 체크인 날짜 (YYYY-MM-DD) */
  checkIn: string
  /** 체크아웃 날짜 (YYYY-MM-DD) */
  checkOut: string
  /** 예약 상태 */
  status: 'confirmed' | 'cancelled' | 'pending'
  /** 총 가격 (원) */
  totalPrice: number
}

/**
 * 예약 생성 요청 파라미터
 * - accommodationId: 숙소 ID
 * - guestName: 예약자 이름
 * - checkIn: 체크인 날짜 (YYYY-MM-DD)
 * - checkOut: 체크아웃 날짜 (YYYY-MM-DD)
 */
export interface CreateBookingRequest {
  /** 숙소 ID */
  accommodationId: number
  /** 예약자 이름 */
  guestName: string
  /** 체크인 날짜 (YYYY-MM-DD) */
  checkIn: string
  /** 체크아웃 날짜 (YYYY-MM-DD) */
  checkOut: string
}
