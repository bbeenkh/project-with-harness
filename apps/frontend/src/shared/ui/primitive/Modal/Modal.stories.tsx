import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Modal from './index'
import Button from '../Button/index'

const meta: Meta<typeof Modal> = {
  title: 'Primitive/Modal',
  component: Modal,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Modal>

function DatePickerSheetStory() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-4">
      <Button variant="primary" onClick={() => setOpen(true)}>
        날짜 선택
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Header>
          <Modal.Title>날짜를 선택하세요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#3C4947]">체크인</span>
              <span className="font-semibold text-[#1B1C1C]">2026.07.01</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#3C4947]">체크아웃</span>
              <span className="font-semibold text-[#1B1C1C]">2026.07.03</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="action" onClick={() => setOpen(false)}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

/** 날짜 선택 Bottom Sheet */
export const DatePickerSheet: Story = {
  render: () => <DatePickerSheetStory />,
}
