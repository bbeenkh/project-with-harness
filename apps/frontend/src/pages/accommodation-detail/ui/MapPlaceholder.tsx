interface Props {
  location: string
}

/**
 * # MapPlaceholder
 * ---
 * - 간단설명: 숙소 위치 더미 지도 (그라디언트 배경 + 핀 아이콘 + 위치 라벨 오버레이)
 * ---
 * @param location - 위치 텍스트 (지도 하단 라벨로 표시)
 * @example
 * <MapPlaceholder location="제주도 서귀포시" />
 */
export default function MapPlaceholder({ location }: Props) {
  return (
    <div className="relative rounded-xl overflow-hidden h-44">
      {/* 더미 지도 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#c8ddd9] to-[#a8c5b5]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(#637b77 1px, transparent 1px), linear-gradient(90deg, #637b77 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* 위치 핀 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="material-symbols-outlined text-primary drop-shadow-md"
          style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
        >
          location_on
        </span>
      </div>

      {/* 위치 라벨 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-4 py-2">
        <span className="font-inter text-label-sm text-white">위치: {location}</span>
      </div>
    </div>
  )
}
