# 홈 화면 설계 문서 (LWPW-4)

## 개요

여행지 검색창, 인기 도시 칩, 추천 숙소 카드 목록으로 구성된 홈 화면 구현.

- **Jira:** LWPW-4
- **작성일:** 2026-06-14

---

## 요구사항 요약

- 검색 입력창 (keyword 필터)
- 인기 여행지 칩 목록 (location 필터, 하드코딩)
- 추천 숙소 카드 목록 (전체 목록 초기 로드)
- 검색창과 칩은 독립적으로 동작 (둘 다 동시에 적용 가능)
- 기술 스택: axios + @tanstack/react-query

---

## FSD 폴더 구조

```
apps/frontend/src/
├── pages/
│   └── home/
│       └── ui/
│           └── HomePage.tsx
│
├── features/
│   └── accommodation-search/
│       ├── model/
│       │   └── useSearchState.ts
│       └── ui/
│           ├── SearchBar.tsx
│           └── PopularCityChips.tsx
│
├── entities/
│   └── accommodation/
│       ├── types/
│       │   └── accommodation.ts
│       ├── api/
│       │   └── accommodationApi.ts
│       └── model/
│           └── useAccommodations.ts
│
└── shared/
    ├── api/
    │   └── axiosInstance.ts
    └── ui/primitive/   (기존, 변경 없음)
```

---

## 데이터 흐름

```
HomePage
  ├── useSearchState()          → { keyword, location, setKeyword, setLocation }
  ├── useAccommodations({ keyword, location })  → { data, isLoading, isError }
  │     └── GET /accommodations?keyword=...&location=...
  ├── SearchBar                 → keyword 상태 바인딩
  ├── PopularCityChips          → location 상태 바인딩
  └── AccommodationList
        ├── isLoading → Skeleton × 3
        ├── isError   → 에러 안내 텍스트
        └── data      → AccommodationCard 목록
```

---

## 컴포넌트 상세

### SearchBar
- `shared/ui/primitive/Input` 래핑
- `prefix`에 검색 아이콘 배치
- `onChange`로 실시간 keyword 업데이트

### PopularCityChips
- 하드코딩 도시 목록: `['서울', '부산', '제주', '강릉', '경주']`
- `shared/ui/primitive/Chip` 사용
- 선택된 location과 일치 시 `active={true}`
- 선택된 칩 재클릭 시 선택 해제 (location → undefined)

### AccommodationCard
- `shared/ui/primitive/Card` 활용
- 표시 정보: 숙소명, 위치, 1박 가격, 예약 가능 여부 뱃지

### 로딩/에러 처리
- 로딩: `Skeleton` 컴포넌트 3개 표시
- 에러: 텍스트 안내 ("숙소 목록을 불러오지 못했습니다")

---

## API 연동

### axios 인스턴스
```ts
// shared/api/axiosInstance.ts
baseURL: 'http://localhost:3000'
```

### 숙소 API
```ts
// entities/accommodation/api/accommodationApi.ts
GET /accommodations?keyword=...&location=...
```

### React Query 설정
- `staleTime`: 기본값 (0)
- `gcTime`: 기본값 (5분)
- `QueryClientProvider`: `App.tsx`에서 감싸기

---

## 신규 설치 패키지

```bash
pnpm -F frontend add @tanstack/react-query axios
```

---

## 테스트 전략 (TDD)

| 대상 | 테스트 내용 |
|------|------------|
| `useAccommodations` | MSW 모킹 → 데이터 반환, 로딩 상태, 에러 상태 |
| `useSearchState` | keyword/location 상태 변경, 칩 토글 |
| `SearchBar` | 입력 시 keyword 업데이트 |
| `PopularCityChips` | 칩 클릭 → location 변경, 재클릭 → 해제 |
| `HomePage` | 전체 렌더링, 검색·칩 필터 연동 |

---

## 브랜치 전략 (워크트리 병렬 개발)

| 브랜치 | 작업 내용 | 시작 조건 |
|--------|----------|----------|
| `LWPW-4_API` | Accommodation 타입, axios API, useAccommodations 훅 | 즉시 |
| `LWPW-4_TEST` | 테스트 desc 먼저 작성 | 즉시 (API와 병렬) |
| `LWPW-4_UI` | HomePage, SearchBar, Chips, Card 조합 | API 타입 정의 완료 후 |

완료 후 세 브랜치를 `LWPW-4`에 순서대로 merge.
