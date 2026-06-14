import { http, HttpResponse } from 'msw'

const mockAccommodations = [
  { id: 1, name: '제주 신라호텔', location: '제주', pricePerNight: 250000, available: true },
  { id: 2, name: '부산 파라다이스 호텔', location: '부산', pricePerNight: 180000, available: true },
  { id: 3, name: '서울 롯데호텔', location: '서울', pricePerNight: 300000, available: false },
]

export const handlers = [
  http.get('http://localhost:3000/accommodations', ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const location = url.searchParams.get('location')

    let result = mockAccommodations
    if (location) result = result.filter((a) => a.location === location)
    if (keyword) result = result.filter((a) => a.name.includes(keyword))

    return HttpResponse.json(result)
  }),
]
