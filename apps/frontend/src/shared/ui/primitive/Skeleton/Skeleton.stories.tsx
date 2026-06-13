import type { Meta, StoryObj } from '@storybook/react'
import Skeleton from './index'

const meta: Meta = {
  title: 'Primitive/Skeleton',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

/** 여행지 카드 로딩 플레이스홀더 */
export const CardPlaceholder: Story = {
  render: () => (
    <div className="w-[320px] flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
      <Skeleton.Box styleClass={{ root: 'w-full h-[160px] rounded-xl' }} />
      <Skeleton.Box styleClass={{ root: 'w-3/4 h-4 rounded' }} />
      <Skeleton.Box styleClass={{ root: 'w-1/2 h-4 rounded' }} />
    </div>
  ),
}
