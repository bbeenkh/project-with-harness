import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProfileHeader from './ProfileHeader'

describe('ProfileHeader 컴포넌트', () => {
  const defaultProps = {
    name: '김진서',
    email: 'jinseo.kim@voyage.com',
    joinedAt: '2023년 5월',
  }

  it('이름이 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByText('김진서')).toBeInTheDocument()
  })

  it('가입일이 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByText('가입일: 2023년 5월')).toBeInTheDocument()
  })

  it('아바타 플레이스홀더가 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByTestId('avatar-placeholder')).toBeInTheDocument()
  })

  it('수정 버튼이 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /프로필 수정/ })).toBeInTheDocument()
  })
})
