import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Input from './index'

describe('Input 컴포넌트', () => {
  it('placeholder가 렌더링된다', () => {
    render(<Input placeholder="여행지 검색" />)
    expect(screen.getByPlaceholderText('여행지 검색')).toBeInTheDocument()
  })

  it('기본 배경 스타일이 적용된다', () => {
    render(<Input placeholder="검색" />)
    const input = screen.getByPlaceholderText('검색')
    expect(input).toHaveClass('bg-[#F7F7F7]')
  })

  it('입력값 변경 시 onChange가 호출된다', () => {
    const handleChange = vi.fn()
    render(<Input placeholder="검색" onChange={handleChange} />)
    fireEvent.change(screen.getByPlaceholderText('검색'), { target: { value: '제주' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('onEnter 콜백이 Enter 키 입력 시 호출된다', () => {
    const handleEnter = vi.fn()
    render(<Input placeholder="검색" onEnter={handleEnter} />)
    fireEvent.keyDown(screen.getByPlaceholderText('검색'), { key: 'Enter' })
    expect(handleEnter).toHaveBeenCalled()
  })

  it('disabled 상태가 적용된다', () => {
    render(<Input placeholder="검색" disabled />)
    expect(screen.getByPlaceholderText('검색')).toBeDisabled()
  })
})
