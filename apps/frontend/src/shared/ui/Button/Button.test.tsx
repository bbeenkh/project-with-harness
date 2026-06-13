import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button 컴포넌트', () => {
  it('children 텍스트가 렌더링된다', () => {
    render(<Button>확인</Button>)
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
  })

  it('variant=primary일 때 primary 스타일 클래스가 적용된다', () => {
    render(<Button variant="primary">확인</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
  })

  it('variant=secondary일 때 secondary 스타일 클래스가 적용된다', () => {
    render(<Button variant="secondary">취소</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200')
  })

  it('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>클릭</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('variant 미지정 시 primary가 기본값이다', () => {
    render(<Button>기본</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
  })
})
