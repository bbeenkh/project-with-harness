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

describe('GET /accommodations/:id', () => {
  it('존재하는 id이면 숙소 객체를 반환한다', async () => {
    const res = await app.request('/accommodations/1')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(1)
    expect(body.name).toBe('제주 오션뷰 펜션')
  })

  it('없는 id이면 404를 반환한다', async () => {
    const res = await app.request('/accommodations/999')
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})

describe('POST /bookings', () => {
  it('정상 요청이면 201과 예약 객체를 반환한다', async () => {
    const res = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-01',
        checkOut: '2026-07-03',
      }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.bookingNumber).toMatch(/^V-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    expect(body.status).toBe('confirmed')
    expect(body.totalPrice).toBe(300000) // 150000 × 2박
    expect(body.guestName).toBe('홍길동')
  })

  it('중복 일정이면 409를 반환한다', async () => {
    db.data.bookings = [
      {
        id: 1,
        bookingNumber: 'V-AAAA-BBBB',
        accommodationId: 1,
        guestName: '이미예약',
        checkIn: '2026-07-01',
        checkOut: '2026-07-05',
        status: 'confirmed',
        totalPrice: 600000,
      },
    ]
    const res = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-03',
        checkOut: '2026-07-07',
      }),
    })
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})

describe('GET /bookings/:bookingNumber', () => {
  beforeEach(() => {
    db.data.bookings = [
      {
        id: 1,
        bookingNumber: 'V-TEST-1234',
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-01',
        checkOut: '2026-07-03',
        status: 'confirmed',
        totalPrice: 300000,
      },
    ]
  })

  it('존재하는 bookingNumber이면 예약 객체를 반환한다', async () => {
    const res = await app.request('/bookings/V-TEST-1234')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.bookingNumber).toBe('V-TEST-1234')
    expect(body.guestName).toBe('홍길동')
  })

  it('없는 bookingNumber이면 404를 반환한다', async () => {
    const res = await app.request('/bookings/V-NONE-0000')
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})

describe('PATCH /bookings/:id/cancel', () => {
  beforeEach(() => {
    db.data.bookings = [
      {
        id: 100,
        bookingNumber: 'V-CANC-TEST',
        accommodationId: 1,
        guestName: '홍길동',
        checkIn: '2026-07-01',
        checkOut: '2026-07-03',
        status: 'confirmed',
        totalPrice: 300000,
      },
    ]
  })

  it('정상 취소: 200과 업데이트된 예약 객체를 반환한다', async () => {
    const res = await app.request('/bookings/100/cancel', { method: 'PATCH' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('cancelled')
    expect(body.id).toBe(100)
  })

  it('이미 취소된 예약은 400을 반환한다', async () => {
    db.data.bookings[0].status = 'cancelled'
    const res = await app.request('/bookings/100/cancel', { method: 'PATCH' })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('없는 id이면 404를 반환한다', async () => {
    const res = await app.request('/bookings/999/cancel', { method: 'PATCH' })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
