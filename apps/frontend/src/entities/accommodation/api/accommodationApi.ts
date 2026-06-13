import axiosInstance from '../../../shared/api/axiosInstance'
import type { Accommodation, AccommodationQuery } from '../types/accommodation'

/**
 * # fetchAccommodations
 * ---
 * - 간단설명: 숙소 목록 조회 API 호출
 * - 제약사항: keyword는 숙소명 부분일치, location은 도시명 완전일치, 빈 값은 파라미터에서 제외
 * ---
 * @param params - 검색 파라미터 (keyword, location)
 * @example
 * const list = await fetchAccommodations({ location: '제주' })
 */
export const fetchAccommodations = async (params: AccommodationQuery): Promise<Accommodation[]> => {
  const { data } = await axiosInstance.get<Accommodation[]>('/accommodations', {
    params: {
      ...(params.keyword ? { keyword: params.keyword } : {}),
      ...(params.location ? { location: params.location } : {}),
    },
  })
  return data
}
