import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SettingsItem from './SettingsItem'

describe('SettingsItem 컴포넌트', () => {
  it('라벨 텍스트가 렌더링된다', () => {
    render(<SettingsItem label="이름" />)
    expect(screen.getByText('이름')).toBeInTheDocument()
  })

  it('value가 전달되면 우측에 값 텍스트가 표시된다', () => {
    render(<SettingsItem label="언어" value="한국어" />)
    expect(screen.getByText('한국어')).toBeInTheDocument()
  })

  it('showChevron 기본값은 true이고 chevron 아이콘이 렌더링된다', () => {
    render(<SettingsItem label="이름" />)
    expect(screen.getByText('chevron_right')).toBeInTheDocument()
  })

  it('showChevron=false이면 chevron 아이콘이 렌더링되지 않는다', () => {
    render(<SettingsItem label="로그아웃" showChevron={false} />)
    expect(screen.queryByText('chevron_right')).not.toBeInTheDocument()
  })

  it('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = vi.fn()
    render(<SettingsItem label="비밀번호 변경" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('labelColor=danger이면 라벨에 danger 색상 클래스가 적용된다', () => {
    render(<SettingsItem label="로그아웃" labelColor="danger" showChevron={false} />)
    expect(screen.getByText('로그아웃')).toHaveClass('text-[#b52330]')
  })

  it('labelColor 미지정 시 기본 텍스트 색상이 적용된다', () => {
    render(<SettingsItem label="이름" />)
    expect(screen.getByText('이름')).not.toHaveClass('text-[#b52330]')
  })
})
