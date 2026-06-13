import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../shared/ui/primitive/CardUI'
import type { Accommodation } from '../../../entities/accommodation/types/accommodation'

interface Props {
  accommodation: Accommodation
}

/**
 * # AccommodationCard
 * ---
 * - 간단설명: 개별 숙소 정보를 표시하는 카드 컴포넌트
 * - 제약사항: available이 false이면 "예약 불가" 뱃지 표시
 * ---
 * @param accommodation - 숙소 데이터
 * @example
 * <AccommodationCard accommodation={item} />
 */
export default function AccommodationCard({ accommodation }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{accommodation.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{accommodation.location}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="font-semibold text-[#006A62]">
          ₩{accommodation.pricePerNight.toLocaleString()} / 박
        </span>
        {!accommodation.available && (
          <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5">
            예약 불가
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
