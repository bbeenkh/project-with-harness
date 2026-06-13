import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PopularCityChips from './PopularCityChips'

describe('PopularCityChips', () => {
  it('인기 도시 5개가 모두 렌더링된다', () => {
    render(<PopularCityChips selectedLocation={undefined} onSelect={() => {}} />)
    expect(screen.getByText('서울')).toBeInTheDocument()
    expect(screen.getByText('부산')).toBeInTheDocument()
    expect(screen.getByText('제주')).toBeInTheDocument()
    expect(screen.getByText('강릉')).toBeInTheDocument()
    expect(screen.getByText('경주')).toBeInTheDocument()
  })

  it('selectedLocation과 일치하는 칩이 active 스타일(bg-[#006A62])로 표시된다', () => {
    render(<PopularCityChips selectedLocation="제주" onSelect={() => {}} />)
    expect(screen.getByText('제주')).toHaveClass('bg-[#006A62]')
  })

  it('칩 클릭 시 onSelect에 해당 도시명이 전달된다', async () => {
    const onSelect = vi.fn()
    render(<PopularCityChips selectedLocation={undefined} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('부산'))
    expect(onSelect).toHaveBeenCalledWith('부산')
  })
})
