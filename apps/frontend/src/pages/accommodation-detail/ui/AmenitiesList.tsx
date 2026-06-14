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

/**
 * 편의시설 이름 → 화면 표시용 라벨 매핑 (Stitch 디자인 기준)
 */
const AMENITY_DISPLAY: Record<string, string> = {
  'Wi-Fi': '초고속 Wi-Fi',
  '수영장': '전용 수영장',
  '주차': '무료 주차',
  '주방': '풀옵션 주방',
  '에어컨': '에어컨',
  '넷플릭스': '넷플릭스',
  '피트니스': '피트니스 센터',
  '스파': '전용 스파',
  '레스토랑': '레스토랑',
  '온천': '노천 온천',
  '조식포함': '조식 포함',
  '정원': '일본식 정원',
  '바비큐': '바비큐 시설',
}

const INITIAL_COUNT = 6

interface Props {
  amenities: string[]
}

/**
 * # AmenitiesList
 * ---
 * - 간단설명: 편의시설 아이콘+라벨 2열 그리드 (6개 초과 시 "모두 보기" 아웃라인 버튼)
 * - 제약사항: 정의되지 않은 편의시설은 'check' 아이콘 / 원본 이름으로 표시
 * ---
 * @param amenities - 편의시설 이름 목록
 * @example
 * <AmenitiesList amenities={['Wi-Fi', '수영장', '주차']} />
 */
export default function AmenitiesList({ amenities }: Props) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? amenities : amenities.slice(0, INITIAL_COUNT)
  const hasMore = amenities.length > INITIAL_COUNT

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {visible.map((amenity) => (
          <div key={amenity} className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>
              {AMENITY_ICONS[amenity] ?? 'check'}
            </span>
            <span className="font-inter text-body-sm text-surface-on">
              {AMENITY_DISPLAY[amenity] ?? amenity}
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-5 w-full border border-outline text-surface-on font-inter text-body-sm font-medium py-3 rounded-xl hover:bg-surface-container-low transition-colors"
        >
          {expanded ? '접기' : `편의시설 ${amenities.length}개 모두 보기`}
        </button>
      )}
    </div>
  )
}
