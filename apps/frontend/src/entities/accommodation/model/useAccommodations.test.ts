import { renderHook, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAccommodations } from './useAccommodations'
import { createQueryWrapper } from '../../../test/queryWrapper'

const mockAccommodations = [
  { id: 1, name: '제주 신라호텔', location: '제주', pricePerNight: 250000, available: true },
  { id: 2, name: '부산 파라다이스 호텔', location: '부산', pricePerNight: 180000, available: true },
]

const server = setupServer(
  http.get('http://localhost:3000/accommodations', ({ request }) => {
    const url = new URL(request.url)
    const location = url.searchParams.get('location')
    const keyword = url.searchParams.get('keyword')
    let result = mockAccommodations
    if (location) result = result.filter((a) => a.location === location)
    if (keyword) result = result.filter((a) => a.name.includes(keyword))
    return HttpResponse.json(result)
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useAccommodations', () => {
  it('파라미터 없이 호출 시 전체 목록을 반환한다', async () => {
    const { result } = renderHook(() => useAccommodations({}), {
      wrapper: createQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('location 파라미터로 필터링된 결과를 반환한다', async () => {
    const { result } = renderHook(() => useAccommodations({ location: '제주' }), {
      wrapper: createQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].location).toBe('제주')
  })

  it('데이터 로딩 중 isLoading이 true이다', () => {
    const { result } = renderHook(() => useAccommodations({}), {
      wrapper: createQueryWrapper(),
    })
    expect(result.current.isLoading).toBe(true)
  })

  it('API 오류 시 isError가 true가 된다', async () => {
    server.use(
      http.get('http://localhost:3000/accommodations', () => HttpResponse.error())
    )
    const { result } = renderHook(() => useAccommodations({}), {
      wrapper: createQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
