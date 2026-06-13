import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './index'

describe('Card 컴포넌트', () => {
  it('children이 렌더링된다', () => {
    render(<Card><p>내용</p></Card>)
    expect(screen.getByText('내용')).toBeInTheDocument()
  })

  it('Card에 Vibrant Horizon 카드 스타일이 적용된다', () => {
    const { container } = render(<Card>카드</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-2xl')
  })

  it('CardHeader가 렌더링된다', () => {
    render(<Card><CardHeader>헤더</CardHeader></Card>)
    expect(screen.getByText('헤더')).toBeInTheDocument()
  })

  it('CardTitle이 렌더링된다', () => {
    render(<Card><CardTitle>제주도 여행</CardTitle></Card>)
    expect(screen.getByText('제주도 여행')).toBeInTheDocument()
  })

  it('CardContent가 렌더링된다', () => {
    render(<Card><CardContent>상세 내용</CardContent></Card>)
    expect(screen.getByText('상세 내용')).toBeInTheDocument()
  })

  it('CardFooter가 렌더링된다', () => {
    render(<Card><CardFooter>₩120,000</CardFooter></Card>)
    expect(screen.getByText('₩120,000')).toBeInTheDocument()
  })
})
