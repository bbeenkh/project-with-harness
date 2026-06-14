import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from './BottomNav'

const meta: Meta<typeof BottomNav> = {
  title: 'Widgets/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '200px' }}>
        <MemoryRouter initialEntries={['/']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BottomNav>

/** 홈 탭 활성화 상태 */
export const HomeActive: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '200px' }}>
        <MemoryRouter initialEntries={['/']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
}

/** 내 예약 탭 활성화 상태 */
export const BookingsActive: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '200px' }}>
        <MemoryRouter initialEntries={['/my-bookings']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
}
