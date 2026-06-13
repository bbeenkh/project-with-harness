import type { Meta, StoryObj } from '@storybook/react'
import Spinner from './index'

const meta: Meta<typeof Spinner> = {
  title: 'Primitive/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'lg', 'xl'],
      description: '스피너 크기',
    },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

/** 기본 로딩 스피너 */
export const Default: Story = {
  args: {
    size: 'lg',
  },
}
