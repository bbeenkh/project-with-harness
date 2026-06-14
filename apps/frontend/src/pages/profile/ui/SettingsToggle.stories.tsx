import type { Meta, StoryObj } from '@storybook/react'
import SettingsToggle from './SettingsToggle'

const meta: Meta<typeof SettingsToggle> = {
  title: 'Pages/Profile/SettingsToggle',
  component: SettingsToggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsToggle>

/** 활성 상태 */
export const Checked: Story = {
  args: { label: '푸시 알림', checked: true, onChange: () => {} },
}

/** 비활성 상태 */
export const Unchecked: Story = {
  args: { label: '마케팅 정보 수신', checked: false, onChange: () => {} },
}
