import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Chip from './index'

describe('Chip 컴포넌트', () => {
  it('label이 렌더링된다', () => {
    render(<Chip label="무료 WiFi" />)
    expect(screen.getByText('무료 WiFi')).toBeInTheDocument()
  })

  it('pill 스타일(rounded-full)이 적용된다', () => {
    const { container } = render(<Chip label="조식 포함" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('기본 상태에서 teal tint 배경이 적용된다', () => {
    const { container } = render(<Chip label="수영장" />)
    expect(container.firstChild).toHaveClass('bg-[#E0F4F2]')
    expect(container.firstChild).toHaveClass('text-[#006A62]')
  })

  it('active=true일 때 primary 배경이 적용된다', () => {
    const { container } = render(<Chip label="선택됨" active />)
    expect(container.firstChild).toHaveClass('bg-[#006A62]')
    expect(container.firstChild).toHaveClass('text-white')
  })

  it('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = vi.fn()
    render(<Chip label="클릭" onClick={handleClick} />)
    fireEvent.click(screen.getByText('클릭'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
