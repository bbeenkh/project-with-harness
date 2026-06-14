import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBooking } from '../api/bookingApi'

/**
 * # useBookingSearch
 * ---
 * - 간단설명: 예약 번호 입력 상태 + 조회 React Query 훅
 * - 제약사항: search() 호출 시 inputValue가 비어있으면 쿼리 실행 안 함, retry: false
 * ---
 * @example
 * const { inputValue, setInputValue, search, data, isLoading, isError } = useBookingSearch()
 */
export const useBookingSearch = () => {
  const [inputValue, setInputValue] = useState('')
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['booking', submittedNumber],
    queryFn: () => fetchBooking(submittedNumber!),
    enabled: submittedNumber !== null,
    retry: false,
  })

  const search = () => {
    const trimmed = inputValue.trim()
    if (trimmed) setSubmittedNumber(trimmed)
  }

  return {
    inputValue,
    setInputValue,
    search,
    submittedNumber,
    ...query,
  }
}
