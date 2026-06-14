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
    <div className="flex flex-col items-center py-2xl px-gutter bg-white">
      {/* 아바타 (120px, 흰색 border 4px, shadow) */}
      <div className="relative mb-3">
        <div
          data-testid="avatar-placeholder"
          className="w-[120px] h-[120px] rounded-full bg-surface-container-high border-4 border-white shadow-md flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '56px' }}>
            person
          </span>
        </div>
        {/* 수정 버튼 (FAB 스타일, Coral, 32px) */}
        <button
          type="button"
          aria-label="프로필 수정"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#ff5a5f] flex items-center justify-center shadow-md"
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>
            edit
          </span>
        </button>
      </div>

      {/* 이름 (Bold, 다크 그레이) */}
      <h1 className="font-plus-jakarta text-headline-md font-bold text-on-surface mb-1">{name}</h1>

      {/* 가입일 (뮤트 그레이) */}
      <p className="font-inter text-body-sm text-[#6b7280]">가입일: {joinedAt}</p>
    </div>
  )
}
