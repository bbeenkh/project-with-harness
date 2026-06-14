import { useState } from 'react'

/**
 * 편의시설 이름 → Material Symbols 아이콘 이름 매핑
 * - 정의되지 않은 편의시설은 'check' 아이콘으로 표시
 */
const AMENITY_ICONS: Record<string, string> = {
  'Wi-Fi': 'wifi',
  '수영장': 'pool',
  '주차': 'local_parking',
  '주방': 'kitchen',
  '에어컨': 'ac_unit',
  '넷플릭스': 'tv',
  '피트니스': 'fitness_center',
  '스파': 'spa',
  '레스토랑': 'restaurant',
  '온천': 'hot_tub',
  '조식포함': 'free_breakfast',
  '정원': 'yard',
  '오션뷰': 'water',
  '에펠탑뷰': 'landscape',
  '와이파이': 'wifi',
  '바비큐': 'outdoor_grill',
}

const INITIAL_COUNT = 6

interface Props {
  amenities: string[]
}

/**
 * # AmenitiesList
 * ---
 * - 간단설명: 편의시설 아이콘 + 이름 그리드 (6개 초과 시 더보기 토글)
 * - 제약사항: 정의되지 않은 편의시설은 'check' 아이콘으로 표시
 * ---
 * @param amenities - 편의시설 이름 목록
 * @example
 * <AmenitiesList amenities={['Wi-Fi', '수영장', '주차']} />
 */
export default function AmenitiesList({ amenities }: Props) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? amenities : amenities.slice(0, INITIAL_COUNT)
  const hiddenCount = amenities.length - INITIAL_COUNT

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {visible.map((amenity) => (
          <div key={amenity} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
              {AMENITY_ICONS[amenity] ?? 'check'}
            </span>
            <span className="font-inter text-body-sm text-surface-on">{amenity}</span>
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 flex items-center gap-1 font-inter text-body-sm text-primary underline underline-offset-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
          {expanded ? '접기' : `+${hiddenCount}개 더보기`}
        </button>
      )}
    </div>
  )
}
