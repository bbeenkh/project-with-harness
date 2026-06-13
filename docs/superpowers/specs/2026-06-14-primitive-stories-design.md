# Primitive UI 컴포넌트 Storybook 스토리 설계 (LWPW-33)

## 개요

`shared/ui/primitive/` 9개 컴포넌트에 Storybook 스토리를 추가한다.
컴포넌트당 주요 사용 예시 1-2개만 작성한다.

## 환경

- Storybook: `@storybook/react-vite`
- 포맷: CSF3 (Component Story Format 3)
- stories 탐색 경로: `src/**/*.stories.@(ts|tsx)`
- preview: Tailwind CSS (`index.css`) 로드됨

## 파일 구조

```
apps/frontend/src/shared/ui/primitive/
├── Button/Button.stories.tsx
├── CardUI/Card.stories.tsx
├── Input/Input.stories.tsx
├── Modal/Modal.stories.tsx
├── Skeleton/Skeleton.stories.tsx
├── Spinner/Spinner.stories.tsx
├── Toast/Toast.stories.tsx
├── Separator/Separator.stories.tsx
└── Chip/Chip.stories.tsx
```

## 컴포넌트별 스토리 목록

| 컴포넌트 | Story 1 | Story 2 |
|---|---|---|
| Button | Primary (예약하기) | Ghost (취소) |
| Card | 여행지 카드 (제주도) | — |
| Input | 여행지 검색 인풋 | — |
| Modal | Bottom Sheet (날짜 선택) | — |
| Skeleton | 카드 로딩 플레이스홀더 | — |
| Spinner | 기본 로딩 (md) | — |
| Toast | 예약 완료 알림 | — |
| Separator | 수평 구분선 | — |
| Chip | 기본 태그 | 활성(선택됨) 태그 |

## 스토리 작성 규칙

- `title`: `'Primitive/<ComponentName>'` 형식
- `args`로 props 제어 가능하게 설정
- Toast는 `useState`로 controlled 상태 관리 (render 함수 활용)
- Modal은 `useState`로 open 상태 관리

## 커밋

스토리 완성 후 단일 커밋:
```
feat: primitive 컴포넌트 Storybook 스토리 추가 (LWPW-33)
```
