import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SettingsToggle from './SettingsToggle'

describe('SettingsToggle 컴포넌트', () => {
  it('라벨 텍스트가 렌더링된다', () => {
    render(<SettingsToggle label="푸시 알림" checked={false} onChange={vi.fn()} />)
    expect(screen.getByText('푸시 알림')).toBeInTheDocument()
  })

  it('checked=true이면 토글이 활성 상태로 렌더링된다', () => {
    render(<SettingsToggle label="푸시 알림" checked={true} onChange={vi.fn()} />)
    const toggle = screen.getByRole('checkbox')
    expect(toggle).toBeChecked()
  })

  it('checked=false이면 토글이 비활성 상태로 렌더링된다', () => {
    render(<SettingsToggle label="마케팅 정보 수신" checked={false} onChange={vi.fn()} />)
    const toggle = screen.getByRole('checkbox')
    expect(toggle).not.toBeChecked()
  })

  it('토글 클릭 시 onChange가 반전된 값으로 호출된다', () => {
    const handleChange = vi.fn()
    render(<SettingsToggle label="푸시 알림" checked={false} onChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('활성 상태일 때 토글이 primary 색상 클래스를 가진다', () => {
    render(<SettingsToggle label="푸시 알림" checked={true} onChange={vi.fn()} />)
    const track = screen.getByTestId('toggle-track')
    expect(track).toHaveClass('bg-[#006a62]')
  })

  it('비활성 상태일 때 토글이 surface 색상 클래스를 가진다', () => {
    render(<SettingsToggle label="마케팅 정보 수신" checked={false} onChange={vi.fn()} />)
    const track = screen.getByTestId('toggle-track')
    expect(track).toHaveClass('bg-[#eae8e7]')
  })
})
