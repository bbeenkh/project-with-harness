import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Separator from './index'

describe('Separator 컴포넌트', () => {
  it('수평 구분선이 렌더링된다', () => {
    const { container } = render(<Separator />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
  })

  it('orientation=horizontal일 때 w-full 클래스가 적용된다', () => {
    const { container } = render(<Separator orientation="horizontal" />)
    expect(container.firstChild).toHaveClass('w-full')
  })

  it('orientation=vertical일 때 h-full 클래스가 적용된다', () => {
    const { container } = render(<Separator orientation="vertical" />)
    expect(container.firstChild).toHaveClass('h-full')
  })

  it('Vibrant Horizon 색상 border-[#BBC9C6]이 기본 적용된다', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveClass('border-[#BBC9C6]')
  })
})
