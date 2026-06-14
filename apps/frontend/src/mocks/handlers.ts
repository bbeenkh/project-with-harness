import { http, HttpResponse } from 'msw'
import type { Booking } from '../entities/booking'

const mockAccommodations = [
  {
    id: 1,
    name: '제주 신라호텔',
    location: '제주',
    pricePerNight: 250000,
    available: true,
    rating: 4.8,
    reviewCount: 128,
    isSuperhost: true,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    description: '에메랄드빛 바다가 한눈에 보이는 프라이빗 테라스와 인피니티 풀을 갖춘 독채 풀빌라입니다. 특별한 여행을 위한 최고의 선택으로, 넓은 오션뷰 테라스에서 제주의 아름다운 일몰을 감상하실 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['수영장', '주차', 'Wi-Fi', '주방', '에어컨', '넷플릭스'],
  },
  {
    id: 2,
    name: '부산 파라다이스 호텔',
    location: '부산',
    pricePerNight: 180000,
    available: true,
    rating: 4.5,
    reviewCount: 64,
    isSuperhost: false,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: '해운대 해변 바로 앞에 위치한 럭셔리 호텔입니다. 탁 트인 오션뷰와 최상의 서비스로 잊지 못할 추억을 만들어 드립니다.',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['주차', 'Wi-Fi', '레스토랑'],
  },
  {
    id: 3,
    name: '서울 롯데호텔',
    location: '서울',
    pricePerNight: 300000,
    available: false,
    rating: 4.9,
    reviewCount: 312,
    isSuperhost: true,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    description: '서울 도심 속 최고급 호텔로, 잠실 롯데월드와 인접해 있습니다. 최상층 루프탑 수영장에서 서울의 야경을 즐기실 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['Wi-Fi', '피트니스', '스파'],
  },
]

const mockBookings: Booking[] = []

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

  http.get('http://localhost:3000/accommodations/:id', ({ params }) => {
    const id = Number(params.id)
    const accommodation = mockAccommodations.find((a) => a.id === id)
    if (!accommodation) return HttpResponse.json({ error: '숙소를 찾을 수 없습니다' }, { status: 404 })
    return HttpResponse.json(accommodation)
  }),

  http.post('http://localhost:3000/bookings', async ({ request }) => {
    const body = await request.json() as { accommodationId: number; guestName: string; checkIn: string; checkOut: string }
    const accommodation = mockAccommodations.find((a) => a.id === body.accommodationId)
    if (!accommodation) return HttpResponse.json({ error: '숙소를 찾을 수 없습니다' }, { status: 404 })
    const booking: Booking = {
      id: Date.now(),
      bookingNumber: `V-TEST-${Date.now().toString(36).toUpperCase().slice(-4)}`,
      accommodationId: body.accommodationId,
      guestName: body.guestName,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      status: 'confirmed',
      totalPrice: accommodation.pricePerNight * 2,
    }
    mockBookings.push(booking)
    return HttpResponse.json(booking, { status: 201 })
  }),
]
