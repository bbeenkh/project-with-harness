import { JSONFilePreset } from 'lowdb/node'

/**
 * # Accommodation
 * ---
 * - 간단설명: 숙소 데이터 모델
 * ---
 */
export interface Accommodation {
  id: number
  /** 숙소명 */
  name: string
  /** 도시/국가 */
  location: string
  /** 1박 가격 (원) */
  pricePerNight: number
  /** 예약 가능 여부 */
  available: boolean
  /** 평점 (0~5) */
  rating: number
  /** 편의시설 목록 */
  amenities: string[]
  /** 대표 이미지 URL */
  imageUrl: string
}

/**
 * 예약 상태
 * - confirmed = 예약 확정
 * - cancelled = 취소됨
 */
export type BookingStatus = 'confirmed' | 'cancelled'

/**
 * # Booking
 * ---
 * - 간단설명: 예약 데이터 모델
 * ---
 */
export interface Booking {
  id: number
  /** 예약 번호 (V-XXXX-XXXX 형식) */
  bookingNumber: string
  /** 숙소 ID */
  accommodationId: number
  /** 투숙객 이름 */
  guestName: string
  /** 체크인 날짜 (YYYY-MM-DD) */
  checkIn: string
  /** 체크아웃 날짜 (YYYY-MM-DD) */
  checkOut: string
  /** 예약 상태 */
  status: BookingStatus
  /** 총 결제 금액 (pricePerNight × 박수) */
  totalPrice: number
}

type Data = {
  items: { id: number; name: string }[]
  accommodations: Accommodation[]
  bookings: Booking[]
}

const defaultData: Data = {
  items: [],
  accommodations: [
    {
      id: 1,
      name: '제주 오션뷰 펜션',
      location: '제주',
      pricePerNight: 150000,
      available: true,
      rating: 4.8,
      amenities: ['수영장', '바비큐', '주차'],
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    },
    {
      id: 2,
      name: '교토 전통 료칸',
      location: '교토',
      pricePerNight: 280000,
      available: true,
      rating: 4.9,
      amenities: ['온천', '조식포함', '정원'],
      imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
    },
    {
      id: 3,
      name: '산토리니 블루돔 빌라',
      location: '산토리니',
      pricePerNight: 420000,
      available: true,
      rating: 4.7,
      amenities: ['수영장', '오션뷰', '조식포함'],
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    },
    {
      id: 4,
      name: '파리 샹젤리제 아파트',
      location: '파리',
      pricePerNight: 320000,
      available: true,
      rating: 4.6,
      amenities: ['주방', '에펠탑뷰', '와이파이'],
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    },
    {
      id: 5,
      name: '서울 강남 호텔',
      location: '서울',
      pricePerNight: 180000,
      available: true,
      rating: 4.5,
      amenities: ['피트니스', '조식포함', '주차'],
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    },
  ],
  bookings: [],
}

export const db = await JSONFilePreset<Data>('db.json', defaultData)
