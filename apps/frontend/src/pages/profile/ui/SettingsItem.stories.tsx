import type { Meta, StoryObj } from '@storybook/react'
import SettingsItem from './SettingsItem'

const meta: Meta<typeof SettingsItem> = {
  title: 'Pages/Profile/SettingsItem',
  component: SettingsItem,
  tags: ['autodocs'],
  argTypes: {
    labelColor: { control: 'select', options: ['default', 'danger'] },
    showChevron: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SettingsItem>

/** 기본 항목 (chevron만) */
export const Default: Story = {
  args: { label: '이름', showChevron: true },
}

/** 현재 값이 있는 항목 */
export const WithValue: Story = {
  args: { label: '언어', value: '한국어', showChevron: true },
}

/** 위험 액션 항목 (로그아웃/삭제) */
export const DangerVariant: Story = {
  args: { label: '로그아웃', labelColor: 'danger', showChevron: false },
}
