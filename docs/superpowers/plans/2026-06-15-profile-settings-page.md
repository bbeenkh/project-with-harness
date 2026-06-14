# 프로필 설정 페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** stitch 디자인을 기반으로 프로필 설정 페이지 UI를 구현하고 `/profile` 라우트에 연결한다.

**Architecture:** `pages/profile/` 슬라이스 안에 4개의 단위 컴포넌트(SettingsItem, SettingsToggle, SettingsSection, ProfileHeader)를 만들고, ProfilePage에서 조합한다. 각 컴포넌트는 Vitest 단위 테스트와 Storybook 스토리를 함께 작성한다.

**Tech Stack:** React 19, TypeScript, Tailwind CSS (Vibrant Horizon), Vitest, @testing-library/react, Storybook 8, material-symbols-outlined 아이콘

---

## 파일 구조

| 동작 | 경로 |
|------|------|
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsItem.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsItem.test.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsItem.stories.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsToggle.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsToggle.test.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsToggle.stories.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsSection.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsSection.test.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/SettingsSection.stories.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/ProfileHeader.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/ProfileHeader.test.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/ProfileHeader.stories.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/ProfilePage.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/ProfilePage.test.tsx` |
| 생성 | `apps/frontend/src/pages/profile/ui/ProfilePage.stories.tsx` |
| 생성 | `apps/frontend/src/pages/profile/index.ts` |
| 수정 | `apps/frontend/src/App.tsx` |

---

## Task 1: SettingsItem 컴포넌트

가장 기본 단위. 라벨 + 선택적 우측 값 + chevron으로 구성된 단일 설정 행.

**Files:**
- Create: `apps/frontend/src/pages/profile/ui/SettingsItem.tsx`
- Create: `apps/frontend/src/pages/profile/ui/SettingsItem.test.tsx`
- Create: `apps/frontend/src/pages/profile/ui/SettingsItem.stories.tsx`

- [ ] **Step 1: 테스트 작성 (실패 확인용)**

`apps/frontend/src/pages/profile/ui/SettingsItem.test.tsx`를 생성한다:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SettingsItem from './SettingsItem'

describe('SettingsItem 컴포넌트', () => {
  it('라벨 텍스트가 렌더링된다', () => {
    render(<SettingsItem label="이름" />)
    expect(screen.getByText('이름')).toBeInTheDocument()
  })

  it('value가 전달되면 우측에 값 텍스트가 표시된다', () => {
    render(<SettingsItem label="언어" value="한국어" />)
    expect(screen.getByText('한국어')).toBeInTheDocument()
  })

  it('showChevron 기본값은 true이고 chevron 아이콘이 렌더링된다', () => {
    render(<SettingsItem label="이름" />)
    expect(screen.getByText('chevron_right')).toBeInTheDocument()
  })

  it('showChevron=false이면 chevron 아이콘이 렌더링되지 않는다', () => {
    render(<SettingsItem label="로그아웃" showChevron={false} />)
    expect(screen.queryByText('chevron_right')).not.toBeInTheDocument()
  })

  it('onClick 핸들러가 클릭 시 호출된다', () => {
    const handleClick = vi.fn()
    render(<SettingsItem label="비밀번호 변경" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('labelColor=danger이면 라벨에 danger 색상 클래스가 적용된다', () => {
    render(<SettingsItem label="로그아웃" labelColor="danger" showChevron={false} />)
    expect(screen.getByText('로그아웃')).toHaveClass('text-[#b52330]')
  })

  it('labelColor 미지정 시 기본 텍스트 색상이 적용된다', () => {
    render(<SettingsItem label="이름" />)
    expect(screen.getByText('이름')).not.toHaveClass('text-[#b52330]')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/SettingsItem.test.tsx
```

Expected: 모든 테스트 FAIL (모듈을 찾을 수 없음)

- [ ] **Step 3: SettingsItem 컴포넌트 구현**

`apps/frontend/src/pages/profile/ui/SettingsItem.tsx`를 생성한다:

```tsx
/**
 * # SettingsItem
 * ---
 * - 간단설명: 설정 목록의 단일 행 컴포넌트 — 라벨, 선택적 현재값, chevron 아이콘으로 구성
 * - 제약사항: onClick 미전달 시에도 버튼 역할로 렌더링됨 (접근성)
 * ---
 * @param label - 항목 라벨 텍스트
 * @param value - 우측에 표시할 현재 값 (예: "한국어")
 * @param onClick - 클릭 핸들러
 * @param showChevron - chevron 아이콘 표시 여부, 기본값 true
 * @param labelColor - 라벨 색상 ('default' | 'danger'), 기본값 'default'
 * ---
 * @example
 * <SettingsItem label="언어" value="한국어" onClick={() => {}} />
 * <SettingsItem label="로그아웃" labelColor="danger" showChevron={false} />
 */
export interface SettingsItemProps {
  label: string
  value?: string
  onClick?: () => void
  showChevron?: boolean
  labelColor?: 'default' | 'danger'
}

export default function SettingsItem({
  label,
  value,
  onClick,
  showChevron = true,
  labelColor = 'default',
}: SettingsItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-gutter py-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
    >
      <span
        className={`font-inter text-body-md ${labelColor === 'danger' ? 'text-[#b52330]' : 'text-on-surface'}`}
      >
        {label}
      </span>
      <div className="flex items-center gap-xs">
        {value && (
          <span className="font-inter text-body-sm text-on-surface-variant">{value}</span>
        )}
        {showChevron && (
          <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>
            chevron_right
          </span>
        )}
      </div>
    </button>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/SettingsItem.test.tsx
```

Expected: 7개 테스트 모두 PASS

- [ ] **Step 5: Storybook 스토리 작성**

`apps/frontend/src/pages/profile/ui/SettingsItem.stories.tsx`를 생성한다:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import SettingsItem from './SettingsItem'

const meta: Meta<typeof SettingsItem> = {
  title: 'Pages/Profile/SettingsItem',
  component: SettingsItem,
  tags: ['autodocs'],
  argTypes: {
    labelColor: { control: 'select', options: ['default', 'danger'] },
    showChevron: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SettingsItem>

/** 기본 항목 (chevron만) */
export const Default: Story = {
  args: { label: '이름', showChevron: true },
}

/** 현재 값이 있는 항목 */
export const WithValue: Story = {
  args: { label: '언어', value: '한국어', showChevron: true },
}

/** 위험 액션 항목 (로그아웃/삭제) */
export const DangerVariant: Story = {
  args: { label: '로그아웃', labelColor: 'danger', showChevron: false },
}
```

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/pages/profile/ui/SettingsItem.tsx \
        apps/frontend/src/pages/profile/ui/SettingsItem.test.tsx \
        apps/frontend/src/pages/profile/ui/SettingsItem.stories.tsx
git commit -m "feat: SettingsItem 컴포넌트 구현, 테스트 및 스토리 작성 (LWPW-36)"
```

---

## Task 2: SettingsToggle 컴포넌트

토글 스위치가 있는 설정 행.

**Files:**
- Create: `apps/frontend/src/pages/profile/ui/SettingsToggle.tsx`
- Create: `apps/frontend/src/pages/profile/ui/SettingsToggle.test.tsx`
- Create: `apps/frontend/src/pages/profile/ui/SettingsToggle.stories.tsx`

- [ ] **Step 1: 테스트 작성 (실패 확인용)**

`apps/frontend/src/pages/profile/ui/SettingsToggle.test.tsx`를 생성한다:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SettingsToggle from './SettingsToggle'

describe('SettingsToggle 컴포넌트', () => {
  it('라벨 텍스트가 렌더링된다', () => {
    render(<SettingsToggle label="푸시 알림" checked={false} onChange={vi.fn()} />)
    expect(screen.getByText('푸시 알림')).toBeInTheDocument()
  })

  it('checked=true이면 토글이 활성 상태로 렌더링된다', () => {
    render(<SettingsToggle label="푸시 알림" checked={true} onChange={vi.fn()} />)
    const toggle = screen.getByRole('checkbox')
    expect(toggle).toBeChecked()
  })

  it('checked=false이면 토글이 비활성 상태로 렌더링된다', () => {
    render(<SettingsToggle label="마케팅 정보 수신" checked={false} onChange={vi.fn()} />)
    const toggle = screen.getByRole('checkbox')
    expect(toggle).not.toBeChecked()
  })

  it('토글 클릭 시 onChange가 반전된 값으로 호출된다', () => {
    const handleChange = vi.fn()
    render(<SettingsToggle label="푸시 알림" checked={false} onChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('활성 상태일 때 토글이 primary 색상 클래스를 가진다', () => {
    render(<SettingsToggle label="푸시 알림" checked={true} onChange={vi.fn()} />)
    const track = screen.getByTestId('toggle-track')
    expect(track).toHaveClass('bg-[#006a62]')
  })

  it('비활성 상태일 때 토글이 surface 색상 클래스를 가진다', () => {
    render(<SettingsToggle label="마케팅 정보 수신" checked={false} onChange={vi.fn()} />)
    const track = screen.getByTestId('toggle-track')
    expect(track).toHaveClass('bg-[#eae8e7]')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/SettingsToggle.test.tsx
```

Expected: 모든 테스트 FAIL

- [ ] **Step 3: SettingsToggle 컴포넌트 구현**

`apps/frontend/src/pages/profile/ui/SettingsToggle.tsx`를 생성한다:

```tsx
/**
 * # SettingsToggle
 * ---
 * - 간단설명: 토글 스위치가 있는 설정 행 컴포넌트
 * - 제약사항: 상태는 외부에서 제어(controlled). onChange 필수
 * ---
 * @param label - 항목 라벨 텍스트
 * @param checked - 토글 활성 여부
 * @param onChange - 토글 변경 핸들러 (새 값 전달)
 * ---
 * @example
 * const [on, setOn] = useState(false)
 * <SettingsToggle label="푸시 알림" checked={on} onChange={setOn} />
 */
export interface SettingsToggleProps {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}

export default function SettingsToggle({ label, checked, onChange }: SettingsToggleProps) {
  return (
    <label className="w-full flex items-center justify-between px-gutter py-md bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-colors">
      <span className="font-inter text-body-md text-on-surface">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          role="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          data-testid="toggle-track"
          className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#006a62]' : 'bg-[#eae8e7]'}`}
        />
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    </label>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/SettingsToggle.test.tsx
```

Expected: 6개 테스트 모두 PASS

- [ ] **Step 5: Storybook 스토리 작성**

`apps/frontend/src/pages/profile/ui/SettingsToggle.stories.tsx`를 생성한다:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import SettingsToggle from './SettingsToggle'

const meta: Meta<typeof SettingsToggle> = {
  title: 'Pages/Profile/SettingsToggle',
  component: SettingsToggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsToggle>

/** 활성 상태 */
export const Checked: Story = {
  args: { label: '푸시 알림', checked: true, onChange: () => {} },
}

/** 비활성 상태 */
export const Unchecked: Story = {
  args: { label: '마케팅 정보 수신', checked: false, onChange: () => {} },
}
```

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/pages/profile/ui/SettingsToggle.tsx \
        apps/frontend/src/pages/profile/ui/SettingsToggle.test.tsx \
        apps/frontend/src/pages/profile/ui/SettingsToggle.stories.tsx
git commit -m "feat: SettingsToggle 컴포넌트 구현, 테스트 및 스토리 작성 (LWPW-36)"
```

---

## Task 3: SettingsSection 컴포넌트

섹션 제목 + 자식 컴포넌트를 감싸는 래퍼.

**Files:**
- Create: `apps/frontend/src/pages/profile/ui/SettingsSection.tsx`
- Create: `apps/frontend/src/pages/profile/ui/SettingsSection.test.tsx`
- Create: `apps/frontend/src/pages/profile/ui/SettingsSection.stories.tsx`

- [ ] **Step 1: 테스트 작성 (실패 확인용)**

`apps/frontend/src/pages/profile/ui/SettingsSection.test.tsx`를 생성한다:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SettingsSection from './SettingsSection'

describe('SettingsSection 컴포넌트', () => {
  it('섹션 제목이 렌더링된다', () => {
    render(<SettingsSection title="개인 정보"><div /></SettingsSection>)
    expect(screen.getByText('개인 정보')).toBeInTheDocument()
  })

  it('children이 렌더링된다', () => {
    render(
      <SettingsSection title="알림 설정">
        <div>푸시 알림 항목</div>
      </SettingsSection>
    )
    expect(screen.getByText('푸시 알림 항목')).toBeInTheDocument()
  })

  it('섹션 제목에 on-surface-variant 색상 클래스가 적용된다', () => {
    render(<SettingsSection title="환경 설정"><div /></SettingsSection>)
    expect(screen.getByText('환경 설정')).toHaveClass('text-on-surface-variant')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/SettingsSection.test.tsx
```

Expected: 모든 테스트 FAIL

- [ ] **Step 3: SettingsSection 컴포넌트 구현**

`apps/frontend/src/pages/profile/ui/SettingsSection.tsx`를 생성한다:

```tsx
import type { ReactNode } from 'react'
import Separator from '../../../shared/ui/primitive/Separator'

/**
 * # SettingsSection
 * ---
 * - 간단설명: 설정 섹션 래퍼 — 제목 레이블과 자식 항목들을 그룹핑
 * - 제약사항: children으로 SettingsItem 또는 SettingsToggle을 전달할 것
 * ---
 * @param title - 섹션 제목 텍스트
 * @param children - 섹션 내 항목들 (SettingsItem | SettingsToggle)
 * ---
 * @example
 * <SettingsSection title="알림 설정">
 *   <SettingsToggle label="푸시 알림" checked={true} onChange={() => {}} />
 * </SettingsSection>
 */
export interface SettingsSectionProps {
  title: string
  children: ReactNode
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section>
      <div className="px-gutter pt-lg pb-xs">
        <span className="font-inter text-label-md text-on-surface-variant uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden">
        {children}
      </div>
      <Separator className="mx-gutter" />
    </section>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/SettingsSection.test.tsx
```

Expected: 3개 테스트 모두 PASS

- [ ] **Step 5: Storybook 스토리 작성**

`apps/frontend/src/pages/profile/ui/SettingsSection.stories.tsx`를 생성한다:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import SettingsSection from './SettingsSection'
import SettingsItem from './SettingsItem'
import SettingsToggle from './SettingsToggle'

const meta: Meta<typeof SettingsSection> = {
  title: 'Pages/Profile/SettingsSection',
  component: SettingsSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsSection>

/** 항목 목록이 있는 섹션 */
export const WithItems: Story = {
  render: () => (
    <SettingsSection title="개인 정보">
      <SettingsItem label="이름" value="김진서" />
      <SettingsItem label="이메일" value="jinseo.kim@voyage.com" />
      <SettingsItem label="전화번호" value="010-1234-5678" />
    </SettingsSection>
  ),
}

/** 토글 목록이 있는 섹션 */
export const WithToggles: Story = {
  render: () => (
    <SettingsSection title="알림 설정">
      <SettingsToggle label="푸시 알림" checked={true} onChange={() => {}} />
      <SettingsToggle label="마케팅 정보 수신" checked={false} onChange={() => {}} />
    </SettingsSection>
  ),
}
```

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/pages/profile/ui/SettingsSection.tsx \
        apps/frontend/src/pages/profile/ui/SettingsSection.test.tsx \
        apps/frontend/src/pages/profile/ui/SettingsSection.stories.tsx
git commit -m "feat: SettingsSection 컴포넌트 구현, 테스트 및 스토리 작성 (LWPW-36)"
```

---

## Task 4: ProfileHeader 컴포넌트

프로필 상단 영역 (아바타 + 이름 + 가입일).

**Files:**
- Create: `apps/frontend/src/pages/profile/ui/ProfileHeader.tsx`
- Create: `apps/frontend/src/pages/profile/ui/ProfileHeader.test.tsx`
- Create: `apps/frontend/src/pages/profile/ui/ProfileHeader.stories.tsx`

- [ ] **Step 1: 테스트 작성 (실패 확인용)**

`apps/frontend/src/pages/profile/ui/ProfileHeader.test.tsx`를 생성한다:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProfileHeader from './ProfileHeader'

describe('ProfileHeader 컴포넌트', () => {
  const defaultProps = {
    name: '김진서',
    email: 'jinseo.kim@voyage.com',
    joinedAt: '2023년 5월',
  }

  it('이름이 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByText('김진서')).toBeInTheDocument()
  })

  it('가입일이 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByText('가입일: 2023년 5월')).toBeInTheDocument()
  })

  it('아바타 플레이스홀더가 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByTestId('avatar-placeholder')).toBeInTheDocument()
  })

  it('수정 버튼이 렌더링된다', () => {
    render(<ProfileHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /프로필 수정/ })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/ProfileHeader.test.tsx
```

Expected: 모든 테스트 FAIL

- [ ] **Step 3: ProfileHeader 컴포넌트 구현**

`apps/frontend/src/pages/profile/ui/ProfileHeader.tsx`를 생성한다:

```tsx
/**
 * # ProfileHeader
 * ---
 * - 간단설명: 프로필 페이지 상단 — 아바타 플레이스홀더, 수정 버튼, 이름, 가입일 표시
 * - 제약사항: 아바타 이미지 없이 원형 플레이스홀더로 표시 (UI only)
 * ---
 * @param name - 사용자 이름
 * @param email - 사용자 이메일 (현재 미표시, 미래 확장용)
 * @param joinedAt - 가입일 문자열 (예: "2023년 5월")
 * ---
 * @example
 * <ProfileHeader name="김진서" email="kim@voyage.com" joinedAt="2023년 5월" />
 */
export interface ProfileHeaderProps {
  name: string
  email: string
  joinedAt: string
}

export default function ProfileHeader({ name, joinedAt }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center py-2xl px-gutter bg-surface-container-lowest">
      {/* 아바타 */}
      <div className="relative mb-md">
        <div
          data-testid="avatar-placeholder"
          className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-primary-container flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '48px' }}>
            person
          </span>
        </div>
        {/* 수정 버튼 */}
        <button
          type="button"
          aria-label="프로필 수정"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow"
        >
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '16px' }}>
            edit
          </span>
        </button>
      </div>

      {/* 이름 */}
      <h1 className="font-plus-jakarta text-headline-md text-on-surface mb-xs">{name}</h1>

      {/* 가입일 */}
      <p className="font-inter text-body-sm text-on-surface-variant">가입일: {joinedAt}</p>
    </div>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/ProfileHeader.test.tsx
```

Expected: 4개 테스트 모두 PASS

- [ ] **Step 5: Storybook 스토리 작성**

`apps/frontend/src/pages/profile/ui/ProfileHeader.stories.tsx`를 생성한다:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import ProfileHeader from './ProfileHeader'

const meta: Meta<typeof ProfileHeader> = {
  title: 'Pages/Profile/ProfileHeader',
  component: ProfileHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProfileHeader>

/** 기본 프로필 헤더 */
export const Default: Story = {
  args: {
    name: '김진서',
    email: 'jinseo.kim@voyage.com',
    joinedAt: '2023년 5월',
  },
}
```

- [ ] **Step 6: 커밋**

```bash
git add apps/frontend/src/pages/profile/ui/ProfileHeader.tsx \
        apps/frontend/src/pages/profile/ui/ProfileHeader.test.tsx \
        apps/frontend/src/pages/profile/ui/ProfileHeader.stories.tsx
git commit -m "feat: ProfileHeader 컴포넌트 구현, 테스트 및 스토리 작성 (LWPW-36)"
```

---

## Task 5: ProfilePage 조합 + 라우트 연결

모든 컴포넌트를 조합해 완성된 페이지를 만들고 `/profile` 라우트에 연결한다.

**Files:**
- Create: `apps/frontend/src/pages/profile/ui/ProfilePage.tsx`
- Create: `apps/frontend/src/pages/profile/ui/ProfilePage.test.tsx`
- Create: `apps/frontend/src/pages/profile/ui/ProfilePage.stories.tsx`
- Create: `apps/frontend/src/pages/profile/index.ts`
- Modify: `apps/frontend/src/App.tsx`

- [ ] **Step 1: 테스트 작성 (실패 확인용)**

`apps/frontend/src/pages/profile/ui/ProfilePage.test.tsx`를 생성한다:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './ProfilePage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  )

describe('ProfilePage', () => {
  it('프로필 헤더(이름)가 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('김진서')).toBeInTheDocument()
  })

  it('가입일이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('가입일: 2023년 5월')).toBeInTheDocument()
  })

  it('개인 정보 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('개인 정보')).toBeInTheDocument()
    expect(screen.getByText('이름')).toBeInTheDocument()
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByText('전화번호')).toBeInTheDocument()
  })

  it('환경 설정 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('환경 설정')).toBeInTheDocument()
    expect(screen.getByText('언어')).toBeInTheDocument()
    expect(screen.getByText('통화')).toBeInTheDocument()
  })

  it('알림 설정 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('알림 설정')).toBeInTheDocument()
    expect(screen.getByText('푸시 알림')).toBeInTheDocument()
    expect(screen.getByText('마케팅 정보 수신')).toBeInTheDocument()
  })

  it('보안 섹션이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('보안')).toBeInTheDocument()
    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument()
    expect(screen.getByText('생체 인증')).toBeInTheDocument()
    expect(screen.getByText('로그아웃')).toBeInTheDocument()
    expect(screen.getByText('계정 삭제')).toBeInTheDocument()
  })

  it('푸시 알림 토글을 클릭하면 상태가 변경된다', () => {
    renderPage()
    const checkboxes = screen.getAllByRole('checkbox')
    const pushToggle = checkboxes[0] // 푸시 알림 (첫 번째 토글)
    expect(pushToggle).toBeChecked()
    fireEvent.click(pushToggle)
    expect(pushToggle).not.toBeChecked()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/ProfilePage.test.tsx
```

Expected: 모든 테스트 FAIL

- [ ] **Step 3: ProfilePage 구현**

`apps/frontend/src/pages/profile/ui/ProfilePage.tsx`를 생성한다:

```tsx
import { useState } from 'react'
import ProfileHeader from './ProfileHeader'
import SettingsSection from './SettingsSection'
import SettingsItem from './SettingsItem'
import SettingsToggle from './SettingsToggle'

/**
 * # ProfilePage
 * ---
 * - 간단설명: 프로필 및 설정 페이지 — stitch 디자인 기반 UI 전용 구현 (API 연동 없음)
 * - 제약사항: 목 데이터로 정적 렌더링, /profile 라우트에서 사용
 * ---
 * @example
 * <Route path="/profile" element={<ProfilePage />} />
 */
export default function ProfilePage() {
  const [pushNotification, setPushNotification] = useState(true)
  const [marketingNotification, setMarketingNotification] = useState(false)
  const [biometric, setBiometric] = useState(false)

  return (
    <div className="pt-16 pb-16 bg-background min-h-screen">
      {/* 앱바 */}
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm flex items-center px-gutter h-16">
        <span className="font-plus-jakarta text-headline-md text-on-surface">프로필</span>
      </header>

      <ProfileHeader
        name="김진서"
        email="jinseo.kim@voyage.com"
        joinedAt="2023년 5월"
      />

      <div className="mt-lg">
        <SettingsSection title="개인 정보">
          <SettingsItem label="이름" value="김진서" />
          <SettingsItem label="이메일" value="jinseo.kim@voyage.com" />
          <SettingsItem label="전화번호" value="010-1234-5678" />
        </SettingsSection>

        <SettingsSection title="환경 설정">
          <SettingsItem label="언어" value="한국어" />
          <SettingsItem label="통화" value="KRW" />
        </SettingsSection>

        <SettingsSection title="알림 설정">
          <SettingsToggle
            label="푸시 알림"
            checked={pushNotification}
            onChange={setPushNotification}
          />
          <SettingsToggle
            label="마케팅 정보 수신"
            checked={marketingNotification}
            onChange={setMarketingNotification}
          />
        </SettingsSection>

        <SettingsSection title="보안">
          <SettingsItem label="비밀번호 변경" />
          <SettingsToggle
            label="생체 인증"
            checked={biometric}
            onChange={setBiometric}
          />
          <SettingsItem label="로그아웃" labelColor="danger" showChevron={false} />
          <SettingsItem label="계정 삭제" labelColor="danger" showChevron={false} />
        </SettingsSection>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
pnpm -F frontend test:run apps/frontend/src/pages/profile/ui/ProfilePage.test.tsx
```

Expected: 7개 테스트 모두 PASS

- [ ] **Step 5: index.ts 생성**

`apps/frontend/src/pages/profile/index.ts`를 생성한다:

```ts
export { default as ProfilePage } from './ui/ProfilePage'
```

- [ ] **Step 6: App.tsx에 /profile 라우트 추가**

`apps/frontend/src/App.tsx`를 수정한다:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/home'
import { AccommodationDetailPage } from './pages/accommodation-detail'
import { MyBookingsPage } from './pages/my-bookings'
import { ProfilePage } from './pages/profile'
import { BottomNav } from './widgets/bottom-nav'

const queryClient = new QueryClient()

/**
 * # App
 * ---
 * - 간단설명: 라우터 + QueryClient 설정, 공통 BottomNav 레이아웃 적용
 * ---
 * @example
 * <App />
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

- [ ] **Step 7: Storybook 스토리 작성**

`apps/frontend/src/pages/profile/ui/ProfilePage.stories.tsx`를 생성한다:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './ProfilePage'

const meta: Meta<typeof ProfilePage> = {
  title: 'Pages/Profile/ProfilePage',
  component: ProfilePage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProfilePage>

/** 프로필 설정 전체 페이지 */
export const FullPage: Story = {}
```

- [ ] **Step 8: 전체 테스트 실행**

```bash
pnpm -F frontend test:run
```

Expected: 모든 테스트 PASS

- [ ] **Step 9: 커밋**

```bash
git add apps/frontend/src/pages/profile/ apps/frontend/src/App.tsx
git commit -m "feat: ProfilePage 조합 및 /profile 라우트 연결 (LWPW-36)"
```
