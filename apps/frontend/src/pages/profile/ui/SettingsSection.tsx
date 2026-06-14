import type { ReactNode } from 'react'
import Separator from '../../../shared/ui/primitive/Separator'

/**
 * # SettingsSection
 * ---
 * - 간단설명: 설정 섹션 래퍼 — 제목 레이블과 자식 항목들을 그룹핑
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
    <section>
      <div className="px-gutter pt-lg pb-xs">
        <span className="font-inter text-label-md text-on-surface-variant uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden">
        {children}
      </div>
      <Separator className="mx-gutter" />
    </section>
  )
}
