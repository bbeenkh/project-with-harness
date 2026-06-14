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
