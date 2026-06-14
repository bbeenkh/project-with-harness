import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookingSearchSection from './BookingSearchSection'

const defaultProps = {
  inputValue: '',
  onChange: vi.fn(),
  onSearch: vi.fn(),
  isLoading: false,
}

describe('BookingSearchSection', () => {
  it('헤드라인과 안내 텍스트를 렌더링한다', () => {
    render(<BookingSearchSection {...defaultProps} />)
    expect(screen.getByText('나의 예약 확인')).toBeInTheDocument()
    expect(screen.getByText('예약 번호를 입력해 내역을 확인하세요')).toBeInTheDocument()
  })

  it('placeholder가 V-1234-5678인 입력 필드를 렌더링한다', () => {
    render(<BookingSearchSection {...defaultProps} />)
    expect(screen.getByPlaceholderText('V-1234-5678')).toBeInTheDocument()
  })

  it('입력 값 변경 시 onChange 콜백이 호출된다', () => {
    const onChange = vi.fn()
    render(<BookingSearchSection {...defaultProps} onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('V-1234-5678'), {
      target: { value: 'V-K3F2-9ZAB' },
    })
    expect(onChange).toHaveBeenCalledWith('V-K3F2-9ZAB')
  })

  it('조회 버튼 클릭 시 onSearch 콜백이 호출된다', () => {
    const onSearch = vi.fn()
    render(
      <BookingSearchSection {...defaultProps} inputValue="V-K3F2-9ZAB" onSearch={onSearch} />
    )
    fireEvent.click(screen.getByRole('button', { name: /조회/ }))
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('inputValue가 비어있으면 조회 버튼이 비활성화된다', () => {
    render(<BookingSearchSection {...defaultProps} inputValue="" />)
    expect(screen.getByRole('button', { name: /조회/ })).toBeDisabled()
  })

  it('isLoading이 true이면 조회 버튼이 비활성화된다', () => {
    render(
      <BookingSearchSection {...defaultProps} inputValue="V-K3F2-9ZAB" isLoading={true} />
    )
    expect(screen.getByRole('button', { name: /조회/ })).toBeDisabled()
  })
})
