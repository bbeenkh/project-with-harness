# LWPW-5 숙소 상세 & 예약 신청 화면 설계

## 개요

숙소 상세 정보(히어로 이미지, 평점, 설명, 편의시설, 지도)를 표시하고, 하단 고정 예약 바에서 예약 폼 모달을 통해 예약을 신청하는 화면을 구현한다.

**Jira**: LWPW-5
**디자인 참고**: https://stitch.withgoogle.com/projects/13318352752179312516

---

## 화면 구조

### AccommodationDetailPage (단일 스크롤 + 하단 고정 바)

```
┌─────────────────────────────┐
│ ← 뒤로  [공유] [찜]        │  ← 히어로 이미지 위 오버레이
│   [히어로 이미지 전체폭]    │
│─────────────────────────────│
│ 숙소명                ⭐4.9 │
│ 📍 위치                     │
│ [최대인원] [침실] [욕실]    │
│─────────────────────────────│
│ 숙소 소개                   │
│ ...설명 텍스트...           │
│─────────────────────────────│
│ 편의시설                    │
│ 🌐 WiFi    🏊 수영장        │
│ 🚗 주차    🍳 주방          │
│─────────────────────────────│
│ 위치                        │
│ [더미 지도 이미지]           │
│─────────────────────────────│  ← 스크롤 영역 끝
│ ₩150,000/박  [지금 예약하기]│  ← sticky bottom bar
└─────────────────────────────┘
```

### BookingFormModal (예약 신청)

- "지금 예약하기" 버튼 클릭 시 Modal 컴포넌트로 표시
- 필드: 체크인 날짜, 체크아웃 날짜, 게스트 이름
- 제출 시 `POST /bookings` 호출
- 성공 시: 예약번호 확인 화면으로 전환 (모달 내부)
- 실패(409) 시: "해당 기간에 이미 예약이 있습니다" 에러 메시지

---

## 라우팅

React Router v6 신규 추가:

| 경로 | 컴포넌트 |
|------|---------|
| `/` | HomePage |
| `/accommodations/:id` | AccommodationDetailPage |

홈 화면 AccommodationCard 클릭 → `/accommodations/:id` 이동

---

## FSD 레이어 구성

### entities/booking
- `types/booking.ts` — `Booking`, `CreateBookingInput` 인터페이스
- `api/bookingApi.ts` — `createBooking(input)`, `fetchBooking(bookingNumber)`
- `index.ts` — public exports

### features/booking
- `model/useBookingForm.ts` — 폼 상태, 유효성 검사, 뮤테이션 호출
- `ui/BookingForm.tsx` — 체크인/체크아웃/이름 입력 폼
- `ui/BookingConfirmation.tsx` — 예약 완료 확인 화면 (예약번호 표시)
- `index.ts` — public exports

### pages/accommodation-detail
- `ui/AccommodationDetailPage.tsx` — 전체 화면 조합
- `ui/HeroImage.tsx` — 히어로 이미지 + 오버레이 헤더
- `ui/AmenitiesList.tsx` — 편의시설 그리드
- `ui/MapPlaceholder.tsx` — 더미 지도 이미지
- `ui/BookingBottomBar.tsx` — 하단 고정 가격/예약 버튼
- `index.ts` — public exports

### entities/accommodation (기존 확장)
- `api/accommodationApi.ts` — `fetchAccommodationById(id)` 추가
- `model/useAccommodation.ts` — 단건 조회 훅 추가

---

## 데이터 타입

```typescript
// entities/booking/types/booking.ts

interface Booking {
  id: number
  bookingNumber: string          // V-XXXX-XXXX
  accommodationId: number
  guestName: string
  checkIn: string                // YYYY-MM-DD
  checkOut: string               // YYYY-MM-DD
  status: 'confirmed' | 'cancelled'
  totalPrice: number
}

interface CreateBookingInput {
  accommodationId: number
  guestName: string
  checkIn: string
  checkOut: string
}
```

---

## API 연동

| 메서드 | 경로 | 용도 |
|--------|------|------|
| GET | `/accommodations/:id` | 숙소 상세 조회 (기존 백엔드) |
| POST | `/bookings` | 예약 생성 (기존 백엔드) |

---

## 에러 처리

- 숙소 없음(404): "숙소를 찾을 수 없습니다" 메시지
- 예약 중복(409): 인라인 에러 메시지
- 네트워크 에러: Toast 컴포넌트 활용

---

## 테스트 계획 (TDD)

### entities/booking
- `createBooking` API 모킹 테스트 (성공/409/404)
- `fetchBooking` API 모킹 테스트

### features/booking
- `useBookingForm` — 유효성 검사, 제출 성공/실패

### pages/accommodation-detail
- `AccommodationDetailPage` — 데이터 로딩/성공/에러 렌더링
- `BookingBottomBar` — 버튼 클릭 시 모달 오픈
- `BookingForm` — 입력값 변경, 제출 동작

---

## 구현 순서 (worktree 병렬)

1. `LWPW-5_API` — Booking 타입, API 함수, `fetchAccommodationById`, React Router 설치
2. `LWPW-5_UI` — AccommodationDetailPage, BookingBottomBar, BookingFormModal UI
3. `LWPW-5_TEST` — 위 기능에 대한 TDD 테스트 (API 브랜치 타입 완료 후 시작)
