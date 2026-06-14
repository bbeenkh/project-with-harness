import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createBooking } from '../../../entities/booking'
import type { Booking } from '../../../entities/booking'

interface UseBookingFormOptions {
  onSuccess?: (booking: Booking) => void
}

/**
 * # useBookingForm
 * ---
 * - 간단설명: 예약 폼 상태 관리 및 제출 로직
 * - 제약사항: checkOut이 checkIn보다 이르면 isValid false
 * ---
 * @param accommodationId - 예약할 숙소 ID
 * @param options - 성공/실패 콜백
 * @example
 * const { guestName, setGuestName, submit, isValid } = useBookingForm(1, { onSuccess: (b) => console.log(b) })
 */
export const useBookingForm = (
  accommodationId: number,
  options?: UseBookingFormOptions
) => {
  const [guestName, setGuestName] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const isValid =
    guestName.trim().length > 0 &&
    checkIn.length > 0 &&
    checkOut.length > 0 &&
    checkIn < checkOut

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () => createBooking({ accommodationId, guestName, checkIn, checkOut }),
    onSuccess: options?.onSuccess,
  })

  const submit = async () => {
    if (!isValid) return
    await mutateAsync()
  }

  return {
    guestName,
    setGuestName,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    isValid,
    isPending,
    error,
    submit,
  }
}
