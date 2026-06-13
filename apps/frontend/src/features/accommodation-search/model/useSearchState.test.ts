import { renderHook, act } from '@testing-library/react'
import { useSearchState } from './useSearchState'

describe('useSearchState', () => {
  it('초기값은 keyword 빈 문자열, location undefined이다', () => {
    const { result } = renderHook(() => useSearchState())
    expect(result.current.keyword).toBe('')
    expect(result.current.location).toBeUndefined()
  })

  it('setKeyword 호출 시 keyword가 업데이트된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => {
      result.current.setKeyword('호텔')
    })
    expect(result.current.keyword).toBe('호텔')
  })

  it('toggleLocation 호출 시 location이 해당 도시로 설정된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => { result.current.toggleLocation('제주') })
    expect(result.current.location).toBe('제주')
  })

  it('같은 도시로 toggleLocation 재호출 시 location이 undefined로 해제된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => { result.current.toggleLocation('제주') })
    act(() => { result.current.toggleLocation('제주') })
    expect(result.current.location).toBeUndefined()
  })

  it('다른 도시로 toggleLocation 호출 시 location이 교체된다', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => { result.current.toggleLocation('제주') })
    act(() => { result.current.toggleLocation('부산') })
    expect(result.current.location).toBe('부산')
  })
})
