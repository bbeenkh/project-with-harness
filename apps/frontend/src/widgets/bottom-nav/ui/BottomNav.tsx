import { Link, useLocation } from 'react-router-dom'

/**
 * # BottomNav
 * ---
 * - 간단설명: 하단 고정 내비게이션 바 — 홈/내 예약/프로필 탭, 현재 경로에 따라 활성 탭 강조
 * - 제약사항: BrowserRouter 내부에서 사용해야 함
 * ---
 * @example
 * <BottomNav />
 */
const NAV_ITEMS = [
  { label: '홈', icon: 'home', path: '/' },
  { label: '내 예약', icon: 'calendar_month', path: '/my-bookings' },
  { label: '프로필', icon: 'person', path: '/profile' },
] as const

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-center h-[72px] max-w-[1200px] mx-auto px-margin-mobile">
        {NAV_ITEMS.map(({ label, icon, path }) => {
          const isActive = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
            >
              {/* 활성 탭: Teal 배경 칩으로 아이콘 강조 */}
              <div className={`px-4 py-1 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
              </div>
              <span className="font-inter text-label-sm">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
