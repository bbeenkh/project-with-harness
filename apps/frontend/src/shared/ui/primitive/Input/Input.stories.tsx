import type { Meta, StoryObj } from '@storybook/react'
import Input from './index'

const meta: Meta<typeof Input> = {
  title: 'Primitive/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

/** 여행지 검색 인풋 */
export const Search: Story = {
  args: {
    placeholder: '여행지를 검색하세요',
  },
}

/** 비활성 상태 인풋 */
export const Disabled: Story = {
  args: {
    placeholder: '검색 불가',
    disabled: true,
  },
}
