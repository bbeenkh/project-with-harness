import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Skeleton from './index'

describe('Skeleton 컴포넌트', () => {
  it('Skeleton.Box가 렌더링되고 기본 스타일이 적용된다', () => {
    const { container } = render(<Skeleton.Box />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('animate-pulse')
    expect(el).toHaveClass('bg-[#E4E2E2]')
  })

  it('Skeleton.Circle이 렌더링되고 rounded-full이 적용된다', () => {
    const { container } = render(<Skeleton.Circle />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('rounded-full')
    expect(el).toHaveClass('bg-[#E4E2E2]')
  })

  it('Skeleton.Box에 width/height style을 styleClass로 지정할 수 있다', () => {
    const { container } = render(
      <Skeleton.Box styleClass={{ root: 'w-full h-[120px]' }} />
    )
    expect(container.firstChild).toHaveClass('w-full')
  })
})
