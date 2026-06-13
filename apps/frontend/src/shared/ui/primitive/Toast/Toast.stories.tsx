import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Toast from './index'
import Button from '../Button/index'

const meta: Meta = {
  title: 'Primitive/Toast',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

function BookingSuccessStory() {
  const [open, setOpen] = useState(false)
  return (
    <Toast.Provider
      open={open}
      onOpenChange={setOpen}
      message="예약이 완료되었습니다!"
      styleClass={{
        root: 'bg-[#006A62] text-white rounded-xl px-4 py-3 shadow-[0px_12px_32px_rgba(0,0,0,0.12)]',
        viewport: 'fixed bottom-4 right-4 flex flex-col gap-2 z-50',
      }}
    >
      <div className="p-4">
        <Button variant="action" onClick={() => setOpen(true)}>
          예약 완료 알림 보기
        </Button>
      </div>
    </Toast.Provider>
  )
}

function BookingErrorStory() {
  const [open, setOpen] = useState(false)
  return (
    <Toast.Provider
      open={open}
      onOpenChange={setOpen}
      message="예약에 실패했습니다. 다시 시도해주세요."
      styleClass={{
        root: 'bg-[#BA1A1A] text-white rounded-xl px-4 py-3 shadow-[0px_12px_32px_rgba(0,0,0,0.12)]',
        viewport: 'fixed bottom-4 right-4 flex flex-col gap-2 z-50',
      }}
    >
      <div className="p-4">
        <Button variant="ghost" onClick={() => setOpen(true)}>
          오류 알림 보기
        </Button>
      </div>
    </Toast.Provider>
  )
}

/** 예약 완료 알림 (success) */
export const BookingSuccess: Story = {
  render: () => <BookingSuccessStory />,
}

/** 오류 알림 (error) */
export const BookingError: Story = {
  render: () => <BookingErrorStory />,
}
