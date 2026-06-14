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
