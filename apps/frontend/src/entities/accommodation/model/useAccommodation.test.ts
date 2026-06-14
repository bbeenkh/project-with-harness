import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAccommodation } from './useAccommodation'
import { createQueryWrapper } from '../../../test/queryWrapper'

const mockAccommodation = {
  id: 1,
  name: '제주 신라호텔',
  location: '제주',
  pricePerNight: 250000,
  available: true,
  rating: 4.8,
  imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  amenities: ['수영장', '주차', 'Wi-Fi', '주방', '에어컨'],
}

const server = setupServer(
  http.get('http://localhost:3000/accommodations/:id', ({ params }) => {
    const id = Number(params.id)
    if (id === 1) return HttpResponse.json(mockAccommodation)
    return HttpResponse.json({ error: '숙소를 찾을 수 없습니다' }, { status: 404 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useAccommodation', () => {
  it('id로 숙소 단건 조회에 성공한다', async () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useAccommodation(1), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe(1)
    expect(result.current.data?.name).toBe('제주 신라호텔')
  })

  it('id가 undefined이면 쿼리를 실행하지 않는다', () => {
    const wrapper = createQueryWrapper()
    const { result } = renderHook(() => useAccommodation(undefined), { wrapper })
    expect(result.current.isPending).toBe(true)
    expect(result.current.fetchStatus).toBe('idle')
  })
})
