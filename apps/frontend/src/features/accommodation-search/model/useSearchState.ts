import { useState } from 'react'

/**
 * # useSearchState
 * ---
 * - 간단설명: 홈 화면 검색 필터 상태 관리 훅 (keyword, location)
 * - 제약사항: toggleLocation은 같은 값 재선택 시 undefined로 해제됨
 * ---
 * @example
 * const { keyword, setKeyword, location, toggleLocation } = useSearchState()
 */
export const useSearchState = () => {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState<string | undefined>(undefined)

  const toggleLocation = (city: string) => {
    setLocation((prev) => (prev === city ? undefined : city))
  }

  return { keyword, setKeyword, location, toggleLocation }
}
