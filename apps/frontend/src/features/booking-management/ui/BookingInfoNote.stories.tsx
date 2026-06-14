import type { Meta, StoryObj } from '@storybook/react'
import BookingInfoNote from './BookingInfoNote'

const meta: Meta<typeof BookingInfoNote> = {
  title: 'Features/BookingManagement/BookingInfoNote',
  component: BookingInfoNote,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookingInfoNote>

/** 무료 취소 안내 카드 */
export const Default: Story = {}
