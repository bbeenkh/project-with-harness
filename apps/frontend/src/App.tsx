import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Hello from React + Vite</h1>
    </QueryClientProvider>
  )
}
