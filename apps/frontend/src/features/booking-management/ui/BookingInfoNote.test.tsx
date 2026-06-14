import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BookingInfoNote from './BookingInfoNote'

describe('BookingInfoNote', () => {
  it('무료 취소 안내 제목을 렌더링한다', () => {
    render(<BookingInfoNote />)
    expect(screen.getByText('무료 취소 안내')).toBeInTheDocument()
  })

  it('취소 규정 안내 텍스트를 렌더링한다', () => {
    render(<BookingInfoNote />)
    expect(
      screen.getByText(/체크인 7일 전까지 무료 취소/)
    ).toBeInTheDocument()
  })
})
