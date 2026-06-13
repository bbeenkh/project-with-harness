import Skeleton from '../../../shared/ui/primitive/Skeleton'
import AccommodationCard from './AccommodationCard'
import type { Accommodation } from '../../../entities/accommodation/types/accommodation'

interface Props {
  data: Accommodation[] | undefined
  isLoading: boolean
  isError: boolean
}

/**
 * # AccommodationList
 * ---
 * - 간단설명: 숙소 카드 목록 렌더링 (로딩/에러/데이터 상태 처리)
 * - 제약사항: isLoading 시 Skeleton.Box 3개, isError 시 에러 안내 텍스트
 * ---
 * @param data - 숙소 목록 데이터
 * @param isLoading - 로딩 여부
 * @param isError - 에러 여부
 * @example
 * <AccommodationList data={data} isLoading={isLoading} isError={isError} />
 */
export default function AccommodationList({ data, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton.Box key={i} styleClass={{ root: 'w-full h-32' }} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-center text-gray-500 py-8">숙소 목록을 불러오지 못했습니다</p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.map((item) => (
        <AccommodationCard key={item.id} accommodation={item} />
      ))}
    </div>
  )
}
