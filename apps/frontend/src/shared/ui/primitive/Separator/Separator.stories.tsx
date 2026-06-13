import type { Meta, StoryObj } from '@storybook/react'
import Separator from './index'

const meta: Meta<typeof Separator> = {
  title: 'Primitive/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

/** 수평 구분선 (예약 정보 섹션 구분) */
export const Horizontal: Story = {
  render: () => (
    <div className="p-4">
      <p className="text-sm text-[#1B1C1C] mb-3">체크인 2026.07.01</p>
      <Separator />
      <p className="text-sm text-[#1B1C1C] mt-3">체크아웃 2026.07.03</p>
    </div>
  ),
}
