import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './index'

const meta: Meta<typeof Card> = {
  title: 'Primitive/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

/** 여행지 카드 예시 */
export const TravelCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>제주도 협재해수욕장</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#3C4947]">에메랄드빛 바다와 백사장이 어우러진 제주 최고의 해변</p>
      </CardContent>
      <CardFooter>
        <span className="text-base font-semibold text-[#006A62]">₩120,000 / 박</span>
      </CardFooter>
    </Card>
  ),
}
