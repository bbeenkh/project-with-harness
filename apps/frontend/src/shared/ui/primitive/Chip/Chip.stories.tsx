import type { Meta, StoryObj } from '@storybook/react'
import Chip from './index'

const meta: Meta<typeof Chip> = {
  title: 'Primitive/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

/** 비활성 필터 태그 (기본 teal tint) */
export const Default: Story = {
  args: {
    label: '무료 WiFi',
    active: false,
  },
}

/** 선택된 필터 태그 (primary 배경) */
export const Active: Story = {
  args: {
    label: '조식 포함',
    active: true,
  },
}
