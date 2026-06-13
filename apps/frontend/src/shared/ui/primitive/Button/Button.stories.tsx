import type { Meta, StoryObj } from '@storybook/react'
import Button from './index'

const meta: Meta<typeof Button> = {
  title: 'Primitive/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'action', 'ghost'],
      description: '버튼 스타일 variant',
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

/** 주요 액션 버튼 (스카이블루) */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '여행지 검색',
  },
}

/** 예약/결제 등 긴급 액션 버튼 (코랄) */
export const Action: Story = {
  args: {
    variant: 'action',
    children: '지금 예약',
  },
}

/** 보조/취소 버튼 (투명 배경) */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '취소',
  },
}
