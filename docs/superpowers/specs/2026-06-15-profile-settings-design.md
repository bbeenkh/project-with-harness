# 프로필 설정 페이지 디자인 명세

**Jira:** LWPW-36
**작성일:** 2026-06-15
**범위:** UI 퍼블리싱만 (기능 연동 없음)

---

## 개요

여행 예약 앱(Swift Travel Booking)에 프로필 및 설정 페이지를 추가한다. Stitch 디자인(Vibrant Horizon 디자인 시스템)을 기반으로 구현하며, 기존 BottomNav의 `/profile` 탭과 연결한다.

---

## 아키텍처

FSD 패턴의 `pages/profile/` 레이어에 구현한다. 섹션별 재사용 가능한 컴포넌트로 분리하여 Storybook 스토리 작성이 용이하도록 한다.

### 파일 구조

```
apps/frontend/src/pages/profile/
├── ui/
│   ├── ProfilePage.tsx
│   ├── ProfileHeader.tsx
│   ├── SettingsSection.tsx
│   ├── SettingsItem.tsx
│   ├── SettingsToggle.tsx
│   ├── ProfilePage.stories.tsx
│   ├── ProfileHeader.stories.tsx
│   ├── SettingsSection.stories.tsx
│   ├── SettingsItem.stories.tsx
│   └── SettingsToggle.stories.tsx
└── index.ts
```

`App.tsx`에 `/profile` 라우트 추가.

---

## 컴포넌트 명세

### ProfileHeader

프로필 상단 영역. 아바타(원형 플레이스홀더), 수정 버튼, 이름, 가입일을 표시한다.

```ts
interface ProfileHeaderProps {
  name: string;
  email: string;
  joinedAt: string; // 예: "2023년 5월"
}
```

### SettingsSection

설정 섹션 래퍼. 제목과 자식 컴포넌트를 감싼다. 섹션 간 구분선(`Separator`) 사용.

```ts
interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}
```

### SettingsItem

단일 설정 행. 라벨 + 선택적 우측 값 텍스트 + chevron 아이콘으로 구성.

```ts
interface SettingsItemProps {
  label: string;
  value?: string;        // 우측에 표시할 현재 값 (예: "한국어", "KRW")
  onClick?: () => void;  // 클릭 핸들러 (UI only, 실제 동작 없음)
  showChevron?: boolean; // 기본 true
  labelColor?: 'default' | 'danger'; // 로그아웃/계정삭제 시 coral/red
}
```

### SettingsToggle

토글 형태의 설정 행. 라벨 + 오른쪽 토글 스위치.

```ts
interface SettingsToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}
```

### ProfilePage

전체 페이지 조합 컴포넌트. 하드코딩된 목 데이터로 정적 UI를 렌더링한다.

---

## 페이지 섹션 구성

```
ProfileHeader
  └─ 아바타 원형 플레이스홀더 (bg-surface-container-high)
     + 수정(edit) 아이콘 버튼 (우하단 오버레이)
     + 이름: "김진서"
     + 가입일: "가입일: 2023년 5월"

SettingsSection "개인 정보"
  ├─ SettingsItem label="이름"     value="김진서"           showChevron
  ├─ SettingsItem label="이메일"   value="jinseo.kim@..."  showChevron
  └─ SettingsItem label="전화번호" value="010-1234-5678"   showChevron

SettingsSection "환경 설정"
  ├─ SettingsItem label="언어" value="한국어" showChevron
  └─ SettingsItem label="통화" value="KRW"   showChevron

SettingsSection "알림 설정"
  ├─ SettingsToggle label="푸시 알림"        defaultChecked=true
  └─ SettingsToggle label="마케팅 정보 수신" defaultChecked=false

SettingsSection "보안"
  ├─ SettingsItem  label="비밀번호 변경"  showChevron
  ├─ SettingsToggle label="생체 인증"    defaultChecked=false
  ├─ SettingsItem  label="로그아웃"      labelColor="danger"
  └─ SettingsItem  label="계정 삭제"     labelColor="danger"
```

---

## 디자인 토큰 (Vibrant Horizon)

| 용도 | 토큰 |
|------|------|
| 페이지 배경 | `bg-background` |
| 섹션 구분선 | `border-outline-variant` |
| 섹션 제목 | `text-on-surface-variant`, `text-label-md` |
| 행 라벨 | `text-on-surface`, `text-body-md` |
| 우측 값 텍스트 | `text-on-surface-variant` |
| chevron 아이콘 | `text-outline` (material-symbols: `chevron_right`) |
| 위험 항목 텍스트 | `text-secondary` (`#b52330`) |
| 토글 활성 | `bg-primary` (`#006a62`) |
| 토글 비활성 | `bg-surface-container-high` |

---

## 라우팅

`App.tsx`에 추가:
```tsx
<Route path="/profile" element={<ProfilePage />} />
```

---

## Storybook 스토리 목록

| 스토리 파일 | 스토리 |
|------------|--------|
| `ProfileHeader.stories.tsx` | Default |
| `SettingsSection.stories.tsx` | WithItems, WithToggles |
| `SettingsItem.stories.tsx` | Default, WithValue, DangerVariant |
| `SettingsToggle.stories.tsx` | Checked, Unchecked |
| `ProfilePage.stories.tsx` | FullPage |

---

## 제외 범위

- 실제 API 연동 없음
- 프로필 편집 기능 없음 (수정 버튼은 UI만)
- 로그아웃/계정삭제 실제 동작 없음
- 언어/통화 변경 실제 동작 없음
