/**
 * # SettingsToggle
 * ---
 * - 간단설명: 토글 스위치가 있는 설정 행 컴포넌트
 * - 제약사항: 상태는 외부에서 제어(controlled). onChange 필수
 * ---
 * @param label - 항목 라벨 텍스트
 * @param checked - 토글 활성 여부
 * @param onChange - 토글 변경 핸들러 (새 값 전달)
 * ---
 * @example
 * const [on, setOn] = useState(false)
 * <SettingsToggle label="푸시 알림" checked={on} onChange={setOn} />
 */
export interface SettingsToggleProps {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}

export default function SettingsToggle({ label, checked, onChange }: SettingsToggleProps) {
  return (
    <label className="w-full flex items-center justify-between px-gutter py-md bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-colors">
      <span className="font-inter text-body-md text-on-surface">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          role="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          data-testid="toggle-track"
          className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#006a62]' : 'bg-[#eae8e7]'}`}
        />
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    </label>
  )
}
