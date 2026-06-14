import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import AccommodationDetailPage from './AccommodationDetailPage'

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

function renderWithProviders(id: number) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/accommodations/${id}`]}>
        <Routes>
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AccommodationDetailPage', () => {
  it('숙소 정보가 로딩 후 표시된다', async () => {
    renderWithProviders(1)
    await waitFor(() => {
      expect(screen.getByText('제주 신라호텔')).toBeInTheDocument()
    })
    expect(screen.getByText('제주')).toBeInTheDocument()
  })

  it('"지금 예약하기" 버튼이 표시된다', async () => {
    renderWithProviders(1)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /지금 예약하기/ })).toBeInTheDocument()
    })
  })

  it('편의시설 목록이 표시된다', async () => {
    renderWithProviders(1)
    await waitFor(() => {
      // AmenitiesList는 '수영장' → '전용 수영장' 으로 표시명 변환
      expect(screen.getByText('전용 수영장')).toBeInTheDocument()
    })
  })
})
