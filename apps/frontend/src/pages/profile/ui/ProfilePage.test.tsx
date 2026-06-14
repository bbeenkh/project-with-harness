import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './ProfilePage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  )

describe('ProfilePage', () => {
  it('프로필 헤더(이름)가 렌더링된다', () => {
    renderPage()
    const elements = screen.getAllByText('김진서')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('가입일이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('가입일: 2023년 5월')).toBeInTheDocument()
  })

  it('개인 정보 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('개인 정보')).toBeInTheDocument()
    expect(screen.getByText('이름')).toBeInTheDocument()
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByText('전화번호')).toBeInTheDocument()
  })

  it('환경 설정 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('환경 설정')).toBeInTheDocument()
    expect(screen.getByText('언어')).toBeInTheDocument()
    expect(screen.getByText('통화')).toBeInTheDocument()
  })

  it('알림 설정 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('알림 설정')).toBeInTheDocument()
    expect(screen.getByText('푸시 알림')).toBeInTheDocument()
    expect(screen.getByText('마케팅 정보 수신')).toBeInTheDocument()
  })

  it('보안 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('보안')).toBeInTheDocument()
    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument()
    expect(screen.getByText('생체 인증')).toBeInTheDocument()
  })

  it('하단 로그아웃 버튼과 계정 삭제 링크가 렌더링된다', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /로그아웃/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /계정 삭제/ })).toBeInTheDocument()
  })

  it('푸시 알림 토글을 클릭하면 상태가 변경된다', () => {
    renderPage()
    const checkboxes = screen.getAllByRole('checkbox')
    const pushToggle = checkboxes[0] // 푸시 알림 (첫 번째 토글)
    expect(pushToggle).toBeChecked()
    fireEvent.click(pushToggle)
    expect(pushToggle).not.toBeChecked()
  })
})
