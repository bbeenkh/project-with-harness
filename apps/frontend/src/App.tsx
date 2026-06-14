import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/home'
import { AccommodationDetailPage } from './pages/accommodation-detail'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
