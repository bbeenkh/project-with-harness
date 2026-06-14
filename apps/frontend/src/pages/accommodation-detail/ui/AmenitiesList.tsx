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
}

interface Props {
  amenities: string[]
}

/**
 * # AmenitiesList
 * ---
 * - 간단설명: 편의시설 아이콘 + 이름 그리드
 * - 제약사항: 정의되지 않은 편의시설은 'check' 아이콘으로 표시
 * ---
 * @param amenities - 편의시설 이름 목록
 * @example
 * <AmenitiesList amenities={['Wi-Fi', '수영장', '주차']} />
 */
export default function AmenitiesList({ amenities }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
            {AMENITY_ICONS[amenity] ?? 'check'}
          </span>
          <span className="font-inter text-body-sm text-surface-on">{amenity}</span>
        </div>
      ))}
    </div>
  )
}
