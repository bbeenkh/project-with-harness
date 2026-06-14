interface Props {
  location: string
}

/**
 * # MapPlaceholder
 * ---
 * - 간단설명: 지도 위치 더미 이미지 표시 (실제 지도 미구현)
 * ---
 * @param location - 위치명 (하단 텍스트)
 * @example
 * <MapPlaceholder location="제주도 서귀포시" />
 */
export default function MapPlaceholder({ location }: Props) {
  return (
    <div>
      <div className="w-full h-40 rounded-xl bg-surface-container-high flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#006a6222 1px, transparent 1px), linear-gradient(90deg, #006a6222 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
            location_on
          </span>
          <span className="font-inter text-label-sm text-surface-on-variant">지도 (더미)</span>
        </div>
      </div>
      <p className="font-inter text-body-sm text-surface-on-variant mt-2">📍 {location}</p>
    </div>
  )
}
