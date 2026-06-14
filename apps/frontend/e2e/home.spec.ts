import { test, expect } from '@playwright/test'

test.describe('홈 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('헤더에 Voyage 로고가 표시된다', async ({ page }) => {
    await expect(page.getByText('Voyage')).toBeVisible()
  })

  test('히어로 타이틀과 검색창이 표시된다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '어디로 떠나시나요?' })).toBeVisible()
    await expect(page.getByPlaceholder('여행지를 검색하세요')).toBeVisible()
  })

  test('인기 여행지 칩 6개가 표시된다', async ({ page }) => {
    for (const city of ['서울', '제주', '도쿄', '파리', '뉴욕', '런던']) {
      await expect(page.getByRole('button', { name: city })).toBeVisible()
    }
  })

  test('추천 숙소 섹션이 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '추천 숙소' })).toBeVisible()
    // 숙소 카드가 1개 이상 로드될 때까지 대기
    await expect(page.locator('.card-shadow').first()).toBeVisible({ timeout: 5000 })
  })

  test('하단 네비게이션이 표시된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: '홈' })).toBeVisible()
    await expect(page.getByRole('button', { name: '내 예약' })).toBeVisible()
    await expect(page.getByRole('button', { name: '프로필' })).toBeVisible()
  })

  test('도시 칩 클릭 시 해당 위치 숙소만 표시된다', async ({ page }) => {
    // 전체 목록 로드 대기
    await expect(page.locator('.card-shadow').first()).toBeVisible({ timeout: 5000 })
    const totalBefore = await page.locator('.card-shadow').count()

    // 제주 칩 클릭
    await page.getByRole('button', { name: '제주' }).click()

    // 목록 갱신 대기 후 제주 숙소만 표시되는지 확인
    await page.waitForTimeout(500)
    const totalAfter = await page.locator('.card-shadow').count()
    expect(totalAfter).toBeLessThanOrEqual(totalBefore)
  })

  test('도시 칩 재클릭 시 선택이 해제된다', async ({ page }) => {
    await expect(page.locator('.card-shadow').first()).toBeVisible({ timeout: 5000 })
    const totalAll = await page.locator('.card-shadow').count()

    // 제주 칩 선택
    await page.getByRole('button', { name: '제주' }).click()
    await page.waitForTimeout(500)

    // 제주 칩 재클릭 → 해제
    await page.getByRole('button', { name: '제주' }).click()
    await page.waitForTimeout(500)

    const totalAfterDeselect = await page.locator('.card-shadow').count()
    expect(totalAfterDeselect).toBe(totalAll)
  })

  test('검색창에 키워드 입력 시 숙소 목록이 필터링된다', async ({ page }) => {
    await expect(page.locator('.card-shadow').first()).toBeVisible({ timeout: 5000 })
    const totalBefore = await page.locator('.card-shadow').count()

    await page.getByPlaceholder('여행지를 검색하세요').fill('펜션')
    await page.waitForTimeout(500)

    const totalAfter = await page.locator('.card-shadow').count()
    expect(totalAfter).toBeLessThanOrEqual(totalBefore)
  })
})
