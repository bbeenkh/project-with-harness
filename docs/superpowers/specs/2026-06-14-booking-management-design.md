# LWPW-6 예약 확인 & 관리 화면 설계

- **Jira**: LWPW-6
- **날짜**: 2026-06-14
- **디자인 시스템**: Vibrant Horizon (Deep Teal & Coral)
- **대상 기기**: 모바일

---

## 1. 목표

사용자가 예약 번호(V-XXXX-XXXX)를 입력해 예약 내역을 조회하고, 예약 취소 및 영수증 출력(UI만)을 할 수 있는 페이지를 구현한다.

---

## 2. 라우트

| 경로 | 컴포넌트 |
|------|----------|
| `/my-bookings` | `MyBookingsPage` |

---

## 3. FSD 폴더 구조

```
entities/booking/
  api/bookingApi.ts          → cancelBooking() 함수 추가
  model/useBookingSearch.ts  → 예약 번호 조회 React Query 훅 (신규)
  model/useBookingCancel.ts  → 예약 취소 Mutation 훅 (신규)

features/booking-management/ (신규)
  ui/BookingSearchSection.tsx
  ui/BookingDetailCard.tsx
  ui/BookingInfoNote.tsx
  index.ts

widgets/bottom-nav/ (신규)
  ui/BottomNav.tsx
  index.ts

pages/my-bookings/ (신규)
  ui/MyBookingsPage.tsx
  index.ts

App.tsx  → /my-bookings 라우트 추가 + 공통 레이아웃에 BottomNav 삽입
```

---

## 4. UI 구성

```
MyBookingsPage (/my-bookings)
│
├── [상단 앱바]
│   ├── 좌: 'Voyage' 브랜드 텍스트 로고
│   └── 우: 사용자 아바타 (원형 이니셜)
│
├── [예약 조회 영역] BookingSearchSection
│   ├── 헤드라인: '나의 예약 확인'
│   ├── 서브텍스트: '예약 번호를 입력해 내역을 확인하세요'
│   ├── Input: placeholder='V-1234-5678'
│   └── Button: [🔍 조회] — Deep Teal 색상
│
├── [조회 결과 영역] — 조회 성공 시에만 표시
│   └── BookingDetailCard
│       ├── 배지: '확정됨' | '취소됨'
│       ├── 숙소 이미지
│       ├── 숙소명 (bold)
│       ├── 예약번호
│       ├── 2x2 그리드: 체크인 / 체크아웃 / 예약자명 / 결제 상태
│       └── 액션 버튼
│           ├── [영수증 출력] — Outline 스타일 → Toast 메시지
│           └── [예약 취소] — Coral 색상 → 바로 취소 API 호출
│
├── [안내 정보] BookingInfoNote — 조회 성공 시 함께 표시
│   └── 무료 취소 안내 (연한 그레이 배경 카드)
│
└── [하단 내비게이션 바] BottomNav (전 페이지 공통, 고정)
    ├── 🏠 홈 → /
    ├── 📋 나의 예약 → /my-bookings (Deep Teal 강조)
    └── 👤 프로필 → (미구현)
```

---

## 5. 상태 흐름

| 상태 | UI |
|------|----|
| 초기 | 조회 영역만 표시 |
| 로딩 중 | 버튼 비활성화 + Spinner |
| 조회 성공 | 예약 카드 + 안내 정보 표시 |
| 조회 실패(404) | '예약을 찾을 수 없습니다' 에러 텍스트 |
| 취소 성공 | 배지 '취소됨'으로 갱신 + Toast |

---

## 6. API 연동

### 기존 활용
| 함수 | 엔드포인트 | 설명 |
|------|-----------|------|
| `fetchBooking(bookingNumber)` | `GET /bookings/:bookingNumber` | 예약 번호로 조회 |

### 신규 추가
| 함수 | 엔드포인트 | 설명 |
|------|-----------|------|
| `cancelBooking(id)` | `PATCH /bookings/:id/cancel` | 예약 취소 |

---

## 7. 하단 내비게이션 적용 범위

기존 `/` (홈), `/accommodations/:id` (숙소 상세) 포함 전체 페이지에 `BottomNav` 공통 레이아웃 적용.
`App.tsx`에 레이아웃 래퍼(`<div className="pb-16">` + 고정 `BottomNav`)를 추가한다.

---

## 8. 영수증 출력

버튼 클릭 시 `window.print()` 또는 별도 처리 없이 Toast 메시지("영수증 출력 기능은 준비 중입니다")만 표시.

---

## 9. 개발 방법론

- TDD (Red → Green → Refactor) 원칙 준수
- 워크트리 병렬 개발:
  - `LWPW-6_API`: `cancelBooking` 함수, `useBookingSearch`, `useBookingCancel` 훅
  - `LWPW-6_UI`: 페이지 및 컴포넌트 구현
  - `LWPW-6_TEST`: 테스트 케이스 우선 작성

---

## 10. 테스트 범위

| 대상 | 테스트 케이스 |
|------|-------------|
| `cancelBooking` | API 호출 성공, 404/400 에러 처리 |
| `useBookingSearch` | 예약 조회 성공, 실패 상태 |
| `useBookingCancel` | 취소 성공 후 쿼리 무효화 |
| `BookingSearchSection` | 입력 → 버튼 클릭 → 조회 트리거 |
| `BookingDetailCard` | confirmed/cancelled 상태 렌더링, 취소 버튼 동작 |
| `MyBookingsPage` | 전체 흐름 통합 |
| `BottomNav` | 현재 경로에 따른 활성 탭 표시 |
