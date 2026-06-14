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
  /** 리뷰 수 */
  reviewCount?: number
  /** 슈퍼호스트 여부 */
  isSuperhost?: boolean
  /** 최대 인원 */
  maxGuests?: number
  /** 침실 수 */
  bedrooms?: number
  /** 베드 수 */
  beds?: number
  /** 욕실 수 */
  bathrooms?: number
  /** 숙소 소개 텍스트 */
  description?: string
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
      reviewCount: 96,
      isSuperhost: true,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      description: '에메랄드빛 바다가 한눈에 펼쳐지는 오션뷰 펜션입니다. 넓은 테라스에서 제주의 아름다운 일몰을 감상하며 특별한 추억을 만들어 보세요.',
      amenities: ['수영장', '바비큐', '주차', 'Wi-Fi', '에어컨', '주방'],
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    },
    {
      id: 2,
      name: '교토 전통 료칸',
      location: '교토',
      pricePerNight: 280000,
      available: true,
      rating: 4.9,
      reviewCount: 214,
      isSuperhost: true,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      description: '일본 전통 건축 양식을 그대로 살린 정통 료칸입니다. 노천 온천과 계절 식재료로 준비한 정통 가이세키 조식을 즐기실 수 있습니다.',
      amenities: ['온천', '조식포함', '정원', 'Wi-Fi'],
      imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
    },
    {
      id: 3,
      name: '산토리니 블루돔 빌라',
      location: '산토리니',
      pricePerNight: 420000,
      available: true,
      rating: 4.7,
      reviewCount: 178,
      isSuperhost: false,
      maxGuests: 6,
      bedrooms: 3,
      beds: 3,
      bathrooms: 2,
      description: '새하얀 벽과 파란 돔이 어우러진 산토리니 전통 스타일의 빌라입니다. 에게해가 내려다보이는 인피니티 풀에서 황홀한 일몰을 즐겨보세요.',
      amenities: ['수영장', '오션뷰', '조식포함', 'Wi-Fi', '에어컨'],
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    },
    {
      id: 4,
      name: '파리 샹젤리제 아파트',
      location: '파리',
      pricePerNight: 320000,
      available: true,
      rating: 4.6,
      reviewCount: 87,
      isSuperhost: false,
      maxGuests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      description: '에펠탑이 보이는 샹젤리제 인근의 아늑한 아파트입니다. 완비된 주방에서 직접 요리를 즐기며 파리지앵처럼 생활해 보세요.',
      amenities: ['주방', '에펠탑뷰', '와이파이', '에어컨'],
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    },
    {
      id: 5,
      name: '서울 강남 호텔',
      location: '서울',
      pricePerNight: 180000,
      available: true,
      rating: 4.5,
      reviewCount: 52,
      isSuperhost: false,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      description: '강남 중심부에 위치한 비즈니스 호텔입니다. 최첨단 피트니스 센터와 풍성한 조식 뷔페로 활기찬 하루를 시작하세요.',
      amenities: ['피트니스', '조식포함', '주차', 'Wi-Fi'],
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    },
  ],
  bookings: [],
}

export const db = await JSONFilePreset<Data>('db.json', defaultData)
