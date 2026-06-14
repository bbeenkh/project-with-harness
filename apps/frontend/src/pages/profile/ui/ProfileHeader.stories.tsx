import type { Meta, StoryObj } from '@storybook/react'
import ProfileHeader from './ProfileHeader'

const meta: Meta<typeof ProfileHeader> = {
  title: 'Pages/Profile/ProfileHeader',
  component: ProfileHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProfileHeader>

/** 기본 프로필 헤더 */
export const Default: Story = {
  args: {
    name: '김진서',
    email: 'jinseo.kim@voyage.com',
    joinedAt: '2023년 5월',
  },
}
