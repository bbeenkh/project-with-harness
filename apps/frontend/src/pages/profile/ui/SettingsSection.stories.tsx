import type { Meta, StoryObj } from '@storybook/react'
import SettingsSection from './SettingsSection'
import SettingsItem from './SettingsItem'
import SettingsToggle from './SettingsToggle'

const meta: Meta<typeof SettingsSection> = {
  title: 'Pages/Profile/SettingsSection',
  component: SettingsSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsSection>

/** 항목 목록이 있는 섹션 */
export const WithItems: Story = {
  render: () => (
    <SettingsSection title="개인 정보">
      <SettingsItem label="이름" value="김진서" />
      <SettingsItem label="이메일" value="jinseo.kim@voyage.com" />
      <SettingsItem label="전화번호" value="010-1234-5678" />
    </SettingsSection>
  ),
}

/** 토글 목록이 있는 섹션 */
export const WithToggles: Story = {
  render: () => (
    <SettingsSection title="알림 설정">
      <SettingsToggle label="푸시 알림" checked={true} onChange={() => {}} />
      <SettingsToggle label="마케팅 정보 수신" checked={false} onChange={() => {}} />
    </SettingsSection>
  ),
}
