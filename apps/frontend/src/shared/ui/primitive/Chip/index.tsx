/**
 * # Chip
 * ---
 * - 간단설명: 필터 태그 및 예약 상태 배지에 사용하는 pill 형태 컴포넌트
 * - 제약사항: active 상태에서는 primary 색상으로 전환
 * ---
 * @param label - 칩 텍스트
 * @param active - 선택 활성 상태 여부
 * @param onClick - 클릭 핸들러
 * ---
 * @example
 * <Chip label="무료 WiFi" active={selected} onClick={() => toggleFilter('wifi')} />
 */
export default function Chip({
  label,
  active = false,
  onClick,
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  const base = 'rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer'
  const style = active
    ? 'bg-[#006A62] text-white'
    : 'bg-[#E0F4F2] text-[#006A62]'

  return (
    <span className={`${base} ${style}`} onClick={onClick}>
      {label}
    </span>
  )
}
