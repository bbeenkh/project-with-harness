import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SettingsSection from './SettingsSection'

describe('SettingsSection 컴포넌트', () => {
  it('섹션 제목이 렌더링된다', () => {
    render(<SettingsSection title="개인 정보"><div /></SettingsSection>)
    expect(screen.getByText('개인 정보')).toBeInTheDocument()
  })

  it('children이 렌더링된다', () => {
    render(
      <SettingsSection title="알림 설정">
        <div>푸시 알림 항목</div>
      </SettingsSection>
    )
    expect(screen.getByText('푸시 알림 항목')).toBeInTheDocument()
  })

  it('섹션 제목에 on-surface-variant 색상 클래스가 적용된다', () => {
    render(<SettingsSection title="환경 설정"><div /></SettingsSection>)
    expect(screen.getByText('환경 설정')).toHaveClass('text-on-surface-variant')
  })
})
