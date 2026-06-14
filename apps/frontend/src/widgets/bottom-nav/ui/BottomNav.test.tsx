import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from './BottomNav'

const renderWithRouter = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <BottomNav />
    </MemoryRouter>
  )

describe('BottomNav', () => {
  it('홈, 내 예약, 프로필 탭을 렌더링한다', () => {
    renderWithRouter('/')
    expect(screen.getByText('홈')).toBeInTheDocument()
    expect(screen.getByText('내 예약')).toBeInTheDocument()
    expect(screen.getByText('프로필')).toBeInTheDocument()
  })

  it('현재 경로가 /일 때 홈 탭이 활성화된다', () => {
    renderWithRouter('/')
    const homeLink = screen.getByRole('link', { name: /홈/ })
    expect(homeLink).toHaveClass('text-primary')
  })

  it('현재 경로가 /my-bookings일 때 내 예약 탭이 활성화된다', () => {
    renderWithRouter('/my-bookings')
    const bookingsLink = screen.getByRole('link', { name: /내 예약/ })
    expect(bookingsLink).toHaveClass('text-primary')
  })

  it('각 탭은 올바른 경로로 링크된다', () => {
    renderWithRouter('/')
    expect(screen.getByRole('link', { name: /홈/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /내 예약/ })).toHaveAttribute('href', '/my-bookings')
  })
})
