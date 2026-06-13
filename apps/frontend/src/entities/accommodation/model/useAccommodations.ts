import { useQuery } from '@tanstack/react-query'
import { fetchAccommodations } from '../api/accommodationApi'
import type { AccommodationQuery } from '../types/accommodation'

/**
 * # useAccommodations
 * ---
 * - 간단설명: 숙소 목록 조회 React Query 훅
 * - 제약사항: staleTime, gcTime은 React Query 기본값 사용 (staleTime: 0, gcTime: 5분)
 * ---
 * @param params - 검색 파라미터 (keyword, location)
 * @example
 * const { data, isLoading, isError } = useAccommodations({ location: '제주' })
 */
export const useAccommodations = (params: AccommodationQuery) => {
  return useQuery({
    queryKey: ['accommodations', params],
    queryFn: () => fetchAccommodations(params),
  })
}
