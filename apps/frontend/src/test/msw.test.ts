import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, describe, it, expect } from 'vitest'

const server = setupServer(
  http.get('/api/items', () =>
    HttpResponse.json([
      { id: 1, name: '아이템1' },
      { id: 2, name: '아이템2' },
    ])
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('MSW 목 서버', () => {
  it('GET /api/items 요청 시 목 데이터를 반환한다', async () => {
    const res = await fetch('/api/items')
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0]).toEqual({ id: 1, name: '아이템1' })
  })

  it('런타임 핸들러 오버라이드가 동작한다', async () => {
    server.use(
      http.get('/api/items', () => HttpResponse.json([{ id: 99, name: '오버라이드' }]))
    )

    const res = await fetch('/api/items')
    const data = await res.json()

    expect(data).toHaveLength(1)
    expect(data[0].name).toBe('오버라이드')
  })
})
