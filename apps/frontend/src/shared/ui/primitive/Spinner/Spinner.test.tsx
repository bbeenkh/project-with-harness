import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Spinner from './index'

describe('Spinner 컴포넌트', () => {
  it('렌더링된다', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SVG 요소에 animate-spin 클래스가 적용된다', () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveClass('animate-spin')
  })

  it('size=xl일 때 w-8 h-8 클래스가 적용된다', () => {
    const { container } = render(<Spinner size="xl" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-8')
    expect(svg).toHaveClass('h-8')
  })

  it('size=xs일 때 w-4 h-4 클래스가 적용된다', () => {
    const { container } = render(<Spinner size="xs" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-4')
    expect(svg).toHaveClass('h-4')
  })
})
