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
 * @param vertical - true이면 라벨(소형 그레이)이 위, 값(굵게)이 아래로 세로 배치
 * ---
 * @example
 * <SettingsItem icon="person" label="이름" value="김진서" />
 * <SettingsItem icon="person" label="이름" value="김진서" vertical />
 * <SettingsItem label="로그아웃" labelColor="danger" showChevron={false} />
 */
export interface SettingsItemProps {
  label: string
  icon?: string
  value?: string
  onClick?: () => void
  showChevron?: boolean
  labelColor?: 'default' | 'danger'
  vertical?: boolean
}

export default function SettingsItem({
  label,
  icon,
  value,
  onClick,
  showChevron = true,
  labelColor = 'default',
  vertical = false,
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
        {vertical ? (
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-inter text-label-sm text-on-surface-variant">{label}</span>
            {value && <span className="font-inter text-body-md text-on-surface">{value}</span>}
          </div>
        ) : (
          <span
            className={`font-inter text-body-md ${labelColor === 'danger' ? 'text-[#b52330]' : 'text-on-surface'}`}
          >
            {label}
          </span>
        )}
      </div>
      <div className="flex items-center gap-xs">
        {!vertical && value && (
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
