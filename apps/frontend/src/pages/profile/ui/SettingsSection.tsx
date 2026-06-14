import type { ReactNode } from 'react'

/**
 * # SettingsSection
 * ---
 * - 간단설명: 설정 섹션 래퍼 — Teal Bold 제목과 흰색 카드로 자식 항목들을 그룹핑
 * - 제약사항: children으로 SettingsItem 또는 SettingsToggle을 전달할 것
 * ---
 * @param title - 섹션 제목 텍스트
 * @param children - 섹션 내 항목들 (SettingsItem | SettingsToggle)
 * ---
 * @example
 * <SettingsSection title="알림 설정">
 *   <SettingsToggle label="푸시 알림" checked={true} onChange={() => {}} />
 * </SettingsSection>
 */
export interface SettingsSectionProps {
  title: string
  children: ReactNode
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="mb-lg">
      <div className="px-gutter pb-sm">
        <span className="font-plus-jakarta text-label-md font-bold text-primary">
          {title}
        </span>
      </div>
      <div className="mx-gutter bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-outline-variant">
        {children}
      </div>
    </section>
  )
}
