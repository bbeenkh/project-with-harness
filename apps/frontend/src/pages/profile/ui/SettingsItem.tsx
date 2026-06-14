/**
 * # SettingsItem
 * ---
 * - 간단설명: 설정 목록의 단일 행 컴포넌트 — 선택적 leading 아이콘, 라벨, 현재값, chevron으로 구성
 * - 제약사항: onClick 미전달 시에도 버튼 역할로 렌더링됨 (접근성)
 * ---
 * @param label - 항목 라벨 텍스트
 * @param icon - 좌측 leading 아이콘 (material-symbols 이름, 예: "person")
 * @param value - 우측에 표시할 현재 값 (예: "한국어")
 * @param onClick - 클릭 핸들러
 * @param showChevron - chevron 아이콘 표시 여부, 기본값 true
 * @param labelColor - 라벨 색상 ('default' | 'danger'), 기본값 'default'
 * ---
 * @example
 * <SettingsItem icon="person" label="이름" value="김진서" />
 * <SettingsItem label="로그아웃" labelColor="danger" showChevron={false} />
 */
export interface SettingsItemProps {
  label: string
  icon?: string
  value?: string
  onClick?: () => void
  showChevron?: boolean
  labelColor?: 'default' | 'danger'
}

export default function SettingsItem({
  label,
  icon,
  value,
  onClick,
  showChevron = true,
  labelColor = 'default',
}: SettingsItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[56px] flex items-center justify-between px-gutter py-md bg-white hover:bg-surface-container-lowest transition-colors"
    >
      <div className="flex items-center gap-md">
        {icon && (
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
            {icon}
          </span>
        )}
        <span
          className={`font-inter text-body-md ${labelColor === 'danger' ? 'text-[#b52330]' : 'text-on-surface'}`}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-xs">
        {value && (
          <span className="font-inter text-body-sm text-on-surface-variant">{value}</span>
        )}
        {showChevron && (
          <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>
            chevron_right
          </span>
        )}
      </div>
    </button>
  )
}
