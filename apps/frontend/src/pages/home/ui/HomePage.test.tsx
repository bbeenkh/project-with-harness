import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

const mockAccommodations = [
  { id: 1, name: '제주 신라호텔', location: '제주', pricePerNight: 250000, available: true },
  { id: 2, name: '부산 파라다이스 호텔', location: '부산', pricePerNight: 180000, available: true },
  { id: 3, name: '서울 롯데호텔', location: '서울', pricePerNight: 300000, available: false },
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

const renderWithQuery = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('HomePage', () => {
  it('페이지 진입 시 전체 숙소 카드 목록이 렌더링된다', async () => {
    renderWithQuery()
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
      expect(screen.getByText('부산 파라다이스 호텔')).toBeInTheDocument()
    })
  })

  it('인기 도시 칩 6개가 표시된다', () => {
    renderWithQuery()
    ;['서울', '제주', '도쿄', '파리', '뉴욕', '런던'].forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument()
    })
  })

  it('도시 칩 클릭 시 해당 location으로만 필터링된다', async () => {
    renderWithQuery()
    await waitFor(() => screen.getByText('제주 신라호텔'))
    await userEvent.click(screen.getAllByText('제주')[0])
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
      expect(screen.queryByText('부산 파라다이스 호텔')).not.toBeInTheDocument()
    })
  })

  it('검색창에 키워드 입력 시 해당 keyword로 필터링된다', async () => {
    renderWithQuery()
    await waitFor(() => screen.getByText('제주 신라호텔'))
    fireEvent.change(screen.getByPlaceholderText('여행지를 검색하세요'), {
      target: { value: '신라' },
    })
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
      expect(screen.queryByText('부산 파라다이스 호텔')).not.toBeInTheDocument()
    })
  })

  it('API 오류 시 에러 메시지가 표시된다', async () => {
    server.use(
      http.get('http://localhost:3000/accommodations', () => HttpResponse.error())
    )
    renderWithQuery()
    await waitFor(() => {
      expect(screen.getByText('숙소 목록을 불러오지 못했습니다')).toBeInTheDocument()
    })
  })
})
