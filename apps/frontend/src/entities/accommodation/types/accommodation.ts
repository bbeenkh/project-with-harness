/**
 * 숙소 정보
 * - id: 숙소 고유 ID
 * - name: 숙소명
 * - location: 도시명
 * - pricePerNight: 1박 가격 (원)
 * - available: 예약 가능 여부
 */
export interface Accommodation {
  /** 숙소 고유 ID */
  id: number
  /** 숙소명 */
  name: string
  /** 도시명 */
  location: string
  /** 1박 가격 (원) */
  pricePerNight: number
  /** 예약 가능 여부 */
  available: boolean
}

/**
 * 숙소 목록 조회 파라미터
 * - keyword: 숙소명 부분일치 검색어
 * - location: 도시명 완전일치 필터
 */
export interface AccommodationQuery {
  /** 숙소명 부분일치 검색어 */
  keyword?: string
  /** 도시명 완전일치 필터 */
  location?: string
}
