import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './index'

describe('Button 컴포넌트', () => {
  it('children 텍스트가 렌더링된다', () => {
    render(<Button>확인</Button>)
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
  })

  it('variant=primary일 때 primary 스타일이 적용된다', () => {
    render(<Button variant="primary">확인</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[#00A699]')
  })

  it('variant=action일 때 action 스타일이 적용된다', () => {
    render(<Button variant="action">예약</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[#FF5A5F]')
  })

  it('variant=ghost일 때 ghost 스타일이 적용된다', () => {
    render(<Button variant="ghost">취소</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-[#00A699]')
  })

  it('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>클릭</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('variant 미지정 시 primary가 기본값이다', () => {
    render(<Button>기본</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[#00A699]')
  })

  it('disabled 상태에서 클릭해도 onClick이 호출되지 않는다', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>비활성</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
