import Chip from '../../../shared/ui/primitive/Chip'

/** 인기 여행지 도시 목록 (하드코딩) */
const POPULAR_CITIES = ['서울', '제주', '도쿄', '파리', '뉴욕', '런던']

interface Props {
  selectedLocation: string | undefined
  onSelect: (city: string) => void
}

/**
 * # PopularCityChips
 * ---
 * - 간단설명: 인기 여행지 도시 칩 목록 (수평 스크롤)
 * - 제약사항: selectedLocation과 일치하는 칩만 active 상태
 * ---
 * @param selectedLocation - 현재 선택된 도시명
 * @param onSelect - 칩 클릭 시 도시명 전달 콜백
 * @example
 * <PopularCityChips selectedLocation={location} onSelect={toggleLocation} />
 */
export default function PopularCityChips({ selectedLocation, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {POPULAR_CITIES.map((city) => (
        <Chip
          key={city}
          label={city}
          active={selectedLocation === city}
          onClick={() => onSelect(city)}
        />
      ))}
    </div>
  )
}
