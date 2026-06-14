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
    <div className="pt-16 pb-20 bg-[#fbf9f8] min-h-screen">
      {/* 탑 앱바 */}
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm h-16 flex items-center justify-between px-gutter">
        <button type="button" aria-label="메뉴" className="w-10 h-10 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>menu</span>
        </button>
        <span className="font-plus-jakarta text-headline-md font-bold text-on-surface">프로필</span>
        <button type="button" aria-label="검색" className="w-10 h-10 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>search</span>
        </button>
      </header>

      <ProfileHeader
        name="김진서"
        email="jinseo.kim@voyage.com"
        joinedAt="2023년 5월"
      />

      <div className="mt-lg">
        <SettingsSection title="개인 정보">
          <SettingsItem icon="person" label="이름" value="김진서" />
          <SettingsItem icon="mail" label="이메일" value="jinseo.kim@voyage.com" />
          <SettingsItem icon="phone" label="전화번호" value="010-1234-5678" />
        </SettingsSection>

        <SettingsSection title="환경 설정">
          <SettingsItem icon="language" label="언어" value="한국어" />
          <SettingsItem icon="currency_exchange" label="통화" value="KRW" />
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
          <SettingsItem icon="lock" label="비밀번호 변경" />
          <SettingsToggle
            label="생체 인증"
            checked={biometric}
            onChange={setBiometric}
          />
        </SettingsSection>

        {/* 하단 액션 */}
        <div className="px-gutter mt-lg flex flex-col items-center gap-md">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-sm py-md rounded-xl border border-[#006a62] text-[#006a62] font-inter text-body-md font-semibold hover:bg-[#e0f4f2] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            로그아웃
          </button>
          <button
            type="button"
            className="font-inter text-body-sm text-[#b52330] underline hover:opacity-80 transition-opacity"
          >
            계정 삭제
          </button>
        </div>
      </div>
    </div>
  )
}
