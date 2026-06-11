# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs both servers concurrently)
pnpm dev

# Individual servers
pnpm -F frontend dev   # Vite on :5173
pnpm -F backend dev    # Hono on :3000

# Build all apps
pnpm build

# Lint (ESLint 9 flat config on apps/)
pnpm lint
```

No test suite is configured.

The pre-commit hook runs `pnpm lint-staged`, which auto-fixes and lints staged `*.{ts,tsx}` files via ESLint.

## Architecture

pnpm monorepo with two apps under `apps/`:

**Frontend** (`apps/frontend/`) — React 19 + Vite 6 + TypeScript
Entry: `src/main.tsx` → `App.tsx`. No routing, no state management yet.

**Backend** (`apps/backend/`) — Hono 4 + lowdb 7 + TypeScript
Entry: `src/index.ts`. Runs via `tsx` (no compile step in dev). Three routes:
- `GET /` — health check
- `GET /items` — list items
- `POST /items` — create item

Database: `src/db.ts` initializes lowdb with file `db.json` (git-ignored). Schema: `{ items: { id: number, name: string }[] }`.

**Shared config:**
- `tsconfig.base.json` — strict, ES2022, bundler module resolution; extended by both apps
- `eslint.config.js` — ESLint 9 flat config; `typescript-eslint` scoped to `apps/`, `react-hooks` plugin for frontend files

## 프로젝트 기획: 여행 예약 간단 프로젝트

### 개요
사용자가 여행지를 검색하고 숙소/항공편을 예약할 수 있는 간단한 웹 애플리케이션.

### 주요 기능

**사용자 기능**
- 여행지 검색 (도시/국가명 입력)
- 숙소 목록 조회 및 상세 보기
- 예약 생성 / 조회 / 취소
- 예약 내역 확인 페이지

**관리 기능 (백엔드 API)**
- 숙소 데이터 CRUD
- 예약 데이터 CRUD
- 예약 가능 여부 확인

### 데이터 모델

```typescript
// 숙소 (Accommodation)
{
  id: number
  name: string         // 숙소명
  location: string     // 도시/국가
  pricePerNight: number
  available: boolean
}

// 예약 (Booking)
{
  id: number
  accommodationId: number
  guestName: string
  checkIn: string      // YYYY-MM-DD
  checkOut: string     // YYYY-MM-DD
  status: 'confirmed' | 'cancelled'
}
```

### API 설계 (Hono 백엔드 확장)

| Method | Path | 설명 |
|--------|------|------|
| GET | /accommodations | 전체 숙소 목록 |
| GET | /accommodations/:id | 숙소 상세 |
| POST | /accommodations | 숙소 추가 |
| GET | /bookings | 전체 예약 목록 |
| POST | /bookings | 예약 생성 |
| PATCH | /bookings/:id/cancel | 예약 취소 |

### 프론트엔드 화면 구성 (React)

1. **홈** — 여행지 검색창 + 숙소 카드 목록
2. **숙소 상세** — 이미지, 가격, 예약 폼
3. **예약 확인** — 예약 번호 입력 후 내역 조회

### 기술 스택
현재 모노레포 구조 그대로 활용:
- Frontend: React 19 + Vite (라우팅은 React Router 추가 예정)
- Backend: Hono 4 + lowdb (기존 구조 확장)
- 스타일: Tailwind CSS 추가 예정
