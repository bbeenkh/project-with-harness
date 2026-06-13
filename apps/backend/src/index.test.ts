import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Accommodation, Booking } from './db.js'

vi.mock('./db.js', () => {
  const accommodations: Accommodation[] = [
    {
      id: 1,
      name: '제주 오션뷰 펜션',
      location: '제주',
      pricePerNight: 150000,
      available: true,
      rating: 4.8,
      amenities: ['수영장'],
      imageUrl: 'https://example.com/1.jpg',
    },
    {
      id: 2,
      name: '교토 전통 료칸',
      location: '교토',
      pricePerNight: 280000,
      available: true,
      rating: 4.9,
      amenities: ['온천'],
      imageUrl: 'https://example.com/2.jpg',
    },
  ]
  return {
    db: {
      data: { accommodations, bookings: [] as Booking[] },
      read: vi.fn().mockResolvedValue(undefined),
      write: vi.fn().mockResolvedValue(undefined),
    },
  }
})

import app from './index.js'
import { db } from './db.js'

beforeEach(() => {
  db.data.bookings = []
})

describe('GET /accommodations', () => {
  it('전체 목록을 반환한다', async () => {
    const res = await app.request('/accommodations')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(2)
  })

  it('location 파라미터로 필터링한다', async () => {
    const res = await app.request('/accommodations?location=제주')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].location).toBe('제주')
  })

  it('keyword 파라미터로 숙소명 검색한다', async () => {
    const res = await app.request('/accommodations?keyword=료칸')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('교토 전통 료칸')
  })
})
