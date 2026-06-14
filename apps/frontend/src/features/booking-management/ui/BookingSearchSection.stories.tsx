import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import BookingSearchSection from './BookingSearchSection'

const meta: Meta<typeof BookingSearchSection> = {
  title: 'Features/BookingManagement/BookingSearchSection',
  component: BookingSearchSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookingSearchSection>

function EmptyStory() {
  const [value, setValue] = useState('')
  return (
    <BookingSearchSection
      inputValue={value}
      onChange={setValue}
      onSearch={() => alert(`조회: ${value}`)}
      isLoading={false}
    />
  )
}

function WithValueStory() {
  const [value, setValue] = useState('V-K3F2-9ZAB')
  return (
    <BookingSearchSection
      inputValue={value}
      onChange={setValue}
      onSearch={() => alert(`조회: ${value}`)}
      isLoading={false}
    />
  )
}

/** 초기 빈 상태 */
export const Empty: Story = {
  render: () => <EmptyStory />,
}

/** 예약 번호 입력 상태 */
export const WithValue: Story = {
  render: () => <WithValueStory />,
}

/** 로딩 중 상태 */
export const Loading: Story = {
  args: {
    inputValue: 'V-K3F2-9ZAB',
    onChange: () => {},
    onSearch: () => {},
    isLoading: true,
  },
}
