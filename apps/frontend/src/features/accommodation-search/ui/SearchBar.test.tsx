import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('placeholder 텍스트가 표시된다', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('여행지를 검색하세요')).toBeInTheDocument()
  })

  it('입력 시 onChange가 새 값으로 호출된다', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('여행지를 검색하세요'), {
      target: { value: '호텔' },
    })
    expect(onChange).toHaveBeenCalledWith('호텔')
  })

  it('value prop이 input에 반영된다', () => {
    render(<SearchBar value="제주" onChange={() => {}} />)
    expect(screen.getByDisplayValue('제주')).toBeInTheDocument()
  })
})
