import { useQuery } from '@tanstack/react-query'
import { fetchAccommodationById } from '../api/accommodationApi'

/**
 * # useAccommodation
 * ---
 * - 간단설명: 숙소 단건 상세 조회 React Query 훅
 * - 제약사항: id가 undefined이면 쿼리 비활성화
 * ---
 * @param id - 숙소 ID
 * @example
 * const { data, isLoading } = useAccommodation(1)
 */
export const useAccommodation = (id: number | undefined) => {
  return useQuery({
    queryKey: ['accommodation', id],
    queryFn: () => fetchAccommodationById(id!),
    enabled: id !== undefined,
  })
}
