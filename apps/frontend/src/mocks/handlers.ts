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
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['수영장', '주차', 'Wi-Fi', '주방', '에어컨'],
  },
  {
    id: 2,
    name: '부산 파라다이스 호텔',
    location: '부산',
    pricePerNight: 180000,
    available: true,
    rating: 4.5,
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
