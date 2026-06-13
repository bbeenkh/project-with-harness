import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * # createQueryWrapper
 * ---
 * - 간단설명: React Query 훅 테스트용 QueryClientProvider 래퍼 팩토리
 * - 제약사항: retry: false로 설정해 테스트에서 재시도 방지
 * ---
 * @example
 * const wrapper = createQueryWrapper()
 * renderHook(() => useAccommodations({}), { wrapper })
 */
export const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
