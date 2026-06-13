# 기본 UI 컴포넌트 제작 설계 (LWPW-33)

## 개요

Stitch 디자인 시스템 "Vibrant Horizon" 기반으로 여행 예약 앱에 필요한 기본 UI 컴포넌트를 `shared/ui/primitive`에 추가한다.
component-installer MCP로 headless 컴포넌트를 설치하고, Tailwind 클래스로 Vibrant Horizon 스타일을 override한다.

## 대상 스크린

| 스크린 | 사용 컴포넌트 |
|---|---|
| 홈 - 여행지 검색 및 목록 | Button, Input, Card, Chip, Skeleton |
| 숙소 상세 및 예약 신청 | Button, Card, Input, Modal, Spinner |
| 예약 확인 및 관리 | Button, Card, Separator, Toast |

## 컴포넌트 목록

| 컴포넌트 | 출처 | 설명 |
|---|---|---|
| Button | component-installer | Primary / Action / Ghost 3가지 variant |
| Card | component-installer (CardUI) | 여행지·숙소 카드 |
| Input | component-installer | 검색바, 예약 폼 입력 |
| Modal | component-installer | 날짜 선택, 필터 Bottom Sheet |
| Skeleton | component-installer | 로딩 플레이스홀더 |
| Spinner | component-installer | 로딩 인디케이터 |
| Toast | component-installer | 예약 성공/실패 알림 |
| Separator | component-installer | 구분선 |
| Chip | 직접 제작 | 필터 태그, 예약 상태 배지 |

## 폴더 구조

```
apps/frontend/src/shared/ui/primitive/
├── Button/Button.tsx
├── Card/Card.tsx
├── Input/Input.tsx
├── Modal/Modal.tsx
├── Skeleton/Skeleton.tsx
├── Spinner/Spinner.tsx
├── Toast/Toast.tsx
├── Separator/Separator.tsx
├── Chip/Chip.tsx
└── index.ts
```

기존 `shared/ui/Button/`은 삭제하고 `primitive/Button`으로 교체한다.

## 스타일 방침

Vibrant Horizon 디자인 토큰을 Tailwind 클래스로 표현한다.

### 색상 토큰

| 역할 | 값 |
|---|---|
| Primary | `#006A62` |
| Primary Container (Surface) | `#00A699` |
| Secondary (Action/CTA) | `#FF5A5F` |
| Surface | `#FBF9F8` |
| On Surface | `#1B1C1C` |

### 컴포넌트별 스타일

**Button**
- `primary`: `bg-[#00A699] text-white rounded-xl hover:bg-[#006A62]`
- `action`: `bg-[#FF5A5F] text-white rounded-xl hover:opacity-90`
- `ghost`: `border border-[#00A699] text-[#00A699] bg-transparent rounded-xl hover:bg-[#E0F4F2]`

**Card**
- `bg-white rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-4`

**Input**
- 기본: `bg-[#F7F7F7] border-transparent rounded-xl`
- 포커스: `focus:border-[#00A699] focus:ring-0`

**Chip**
- `bg-[#E0F4F2] text-[#006A62] rounded-full px-3 py-1 text-sm font-medium`

**Separator**
- `bg-[#BBC9C6]`

## 기존 Button 교체

- `apps/frontend/src/shared/ui/Button/` 디렉터리 삭제
- `Button.test.tsx`는 `primitive/Button/` 위치에 새로 작성 (TDD 원칙 유지)
- `Button.stories.tsx`는 삭제 (Storybook 미설정 상태이므로 제외)
- import 경로: `shared/ui/Button/Button` → `shared/ui/primitive`

## 제약 및 특이사항

- **Spinner**: component-installer MCP의 Spinner는 SVGR 설정이 필요하므로, SVGR 없이 동작하는 순수 CSS/Tailwind animate-spin 방식의 SVG inline으로 대체 구현한다.
- **Modal (Bottom Sheet)**: 데스크탑에서는 일반 모달, 모바일 뷰포트에서는 하단에서 슬라이드업되는 Bottom Sheet처럼 동작하도록 스타일 override.

## 브랜치

`LWPW-33`

## JsDoc 작성 방침

CLAUDE.md 규칙에 따라 각 컴포넌트 상단에 한국어 JsDoc 작성.
