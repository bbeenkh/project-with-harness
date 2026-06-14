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
