import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PopularCityChips from './PopularCityChips'

describe('PopularCityChips', () => {
  it('인기 도시 6개가 모두 렌더링된다', () => {
    render(<PopularCityChips selectedLocation={undefined} onSelect={() => {}} />)
    expect(screen.getByText('서울')).toBeInTheDocument()
    expect(screen.getByText('제주')).toBeInTheDocument()
    expect(screen.getByText('도쿄')).toBeInTheDocument()
    expect(screen.getByText('파리')).toBeInTheDocument()
    expect(screen.getByText('뉴욕')).toBeInTheDocument()
    expect(screen.getByText('런던')).toBeInTheDocument()
  })

  it('selectedLocation과 일치하는 칩이 active 스타일(bg-primary)로 표시된다', () => {
    render(<PopularCityChips selectedLocation="제주" onSelect={() => {}} />)
    expect(screen.getByText('제주')).toHaveClass('bg-primary')
  })

  it('칩 클릭 시 onSelect에 해당 도시명이 전달된다', async () => {
    const onSelect = vi.fn()
    render(<PopularCityChips selectedLocation={undefined} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('도쿄'))
    expect(onSelect).toHaveBeenCalledWith('도쿄')
  })
})
