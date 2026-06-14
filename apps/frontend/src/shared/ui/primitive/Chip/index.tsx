/**
 * # Chip
 * ---
 * - 간단설명: 필터 태그 및 선택 칩으로 사용하는 pill 형태 버튼 컴포넌트
 * - 제약사항: active 상태에서는 primary 배경색으로 전환
 * ---
 * @param label - 칩 텍스트
 * @param active - 선택 활성 상태 여부
 * @param onClick - 클릭 핸들러
 * ---
 * @example
 * <Chip label="서울" active={selected} onClick={() => toggleFilter('서울')} />
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
  const base =
    'px-6 py-2.5 rounded-full font-inter text-label-md flex-shrink-0 transition-all cursor-pointer'
  const style = active
    ? 'bg-primary text-primary-on shadow-md active:scale-95'
    : 'bg-surface-container-high text-surface-on-variant hover:bg-primary-container hover:text-primary-on'

  return (
    <button className={`${base} ${style}`} onClick={onClick}>
      {label}
    </button>
  )
}
