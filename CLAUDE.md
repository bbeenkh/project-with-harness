# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 작업 순서: 신규 작업 시, 반드시 다음 플로우를 준수하여 작업 진행할 것
1. 기획&요구사항 정리
- atlassian mcp 사용해 Jira 접근하여 기획 확인
- 전반적 작업 내용은 jira에서 확인
- 브랜치 명은 티켓 이름을 그대로 사용

<!-- - 세부 기획, 제약사항 등은 confluence에서 확인(현재 세팅 안되었으므로 무시)
  - PDR: 기획 및 제약사항 어떻게, 어째서 했는지를 정리하는 문서
  - ADR: 특정 기술 도입 결정을 왜 하였는지 정리하는 문서 -->

2. 디자인: stitch mcp 사용해 화면, ui배치 구성
- 반드시 존재하는 디자인 시스템 기반으로 제작할것, 새로 제작 필요할시는 별도 생성 질문후 진행

3. 개발: Jira, confluence, stitch mcp 통해 작업사항 바탕으로 하여  작업내용 파악
- 개발 과정은 red green refactor 원칙 기반 TDD로 작업 진행할 것
- superpowers의 brainstorming skill 사용하여 기획 구체화 진행
- 커밋 메세지: 내용은 전부 한글로 작성할것

worktree 활용: 1개의 작업마다 다음 subagent 구성하여 git worktree 사용해 병렬로 작업 진행, 각 작업 필요없으면 생략가능
1. 현재 작업중인 브랜치에 다음 생성
- [브랜치명]_API: API 연동, interface 작성 및 스펙 jsdoc작성
- [브랜치명]_UI: 디자인 정보 받아서 UI 퍼블리싱 작업, 기존 컴포넌트 활용할것
- [브랜치명]_TEST: 단위테스트 작성

2. 위의 세 작업 완료 후 기존브랜치에 merge 후 나머지 작업 완료할 것

- 개발 방법론: superpowers의 test-driven-development skill 사용하여 TDD로 진행
1. 테스트 desc 작성, 작성후 검토 요청하기
2. 구현하려는 기능의 테스트 작성 
3. 테스트를 통과시키는 최소한의 코드 작성
4. 리팩토링 및 개선

- 폴더 구조: fsd 패턴 사용하여 구조적으로 정리
규칙
폴더 구조: 레이어, 슬라이스, 세그먼트로 분류됨

레이어: fsd에서 정의된 폴더 분류
App: 최상위 app.tsx, provider, router 등 최상위 설정들
Pages; 개별 페이지 정의, 비즈니스 로직보다는 사용자 인터페이스 관련 로직만 관리
widgets: 페이지 내 독립적으로 작동하는 기능 관리, 다양한 페이지에서 재사용 가능 (ui): template
Features: 재사용 가능한 비즈니스 기능 위한 레이어, 재사용 가능한 ui+비즈니스 로직: organisms
Entities: 데이터 모델, 데이터에 대한 로직, 사용자 정보 관리 store, interface 정의
Shared: 공용 ui, 유틸 순수함수들-슬라이스 없이 세그먼트만 있음: atoms, molecules

슬라이스: 레이어의 컨텍스트별 폴더, 각 도메인에 대한 폴더명 구성
- index.ts: 해당 슬라이스에서 사용가능한 모든 기능 리턴, 구체적인 경로 몰라도 import 가능함
세그먼트: 컨텍스트별 세부 내용, 아래 디렉토리로 구별되나 커스터마이징 가능
    - Model: 상태관리, 비즈니스로직, 데이터 상태 저장및 관리
    - Ui: 각 기능에 대한 UI
    - api: 각 api 요청에 대한 코드 작성 (rq useQuery, useMutation hoook)
    - Lib: 유틸 순수함수
    - Types: interface, type


레이어는 반드시 자신의 하위요소만 참조해야 함
각 세그먼트의 폴더명은 컨벤션은 있으나 임의 변경 가능





- 중요!: Jsdoc 작성
- 각 작성한 요소의 스펙에 대해 jsdoc 형식의 간단 문서를 작성해야 한다
- 한국어로 작성하며, 함수, 변수, 클래스 등의 경우 요소 바로 위에 작성한다

- 아래의 양식에 따라 작성한다
/** 
 * # 컴포넌트/함수/클래스 이름
   ---
 * - 간단설명: 무슨역할인지 1줄로 설명
   - 제약사항 및 특이사항: 있으면 목록별로 나열
   ---
   @param: 쿼리파라미터
   ex) @param children react children
   ---
 * @example: 간단예제
 * 
 */
 
- type, interface, enum의 경우, jsdoc은 다음과 같은 형태로 작성한다
/**
 * 도서 검색 목록 정렬 기준
 * - ACCURACY = 정확도순
 * - LATEST = 발간일순
 */
export enum FETCH_BOOK_SORT {
	/** 정확도순 */
  ACCURACY = "accuracy",
  /** 발간일순 */
  LATEST = "latest",
}


4. 작업 마무리 및 PR
- 티켓 검토중으로 작업상태 변경
- 각 테스트 진행후 PR 
- AI 가 기본 내용 검토
- 사용자가 최종 검토
 

- commit 메세지는 한국어로만 작성할 것

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

# 디자인
stitch MCP 활용해 디자인시스템 및 UI 파악할 것
https://stitch.withgoogle.com/projects/13318352752179312516?pli=1

PDR: /docs/pdr/v1.md 참고
