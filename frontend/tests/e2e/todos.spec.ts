import { test, expect } from '@playwright/test'

test.describe('Todos 頁面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos')
    // 等待 Vue 在 Nuxt root element 完成 hydration，確保 v-model 事件監聽器已掛載
    await page.waitForFunction(
      () => !!(document.getElementById('__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__,
      { timeout: 15000 },
    )
  })

  test('顯示頁面標題與空清單提示', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Todo List')
    await expect(page.getByText('沒有待辦事項')).toBeVisible()
    await expect(page.getByTestId('remaining-count')).toContainText('0')
  })

  test('新增一筆 todo', async ({ page }) => {
    await page.fill('input[type="text"]', '買牛奶')
    await page.getByTestId('add-btn').click()

    await expect(page.getByTestId('todo-item')).toHaveCount(1)
    await expect(page.getByText('買牛奶')).toBeVisible()
    await expect(page.getByTestId('remaining-count')).toContainText('1')
  })

  test('Enter 鍵新增 todo', async ({ page }) => {
    await page.fill('input[type="text"]', '去健身房')
    await page.keyboard.press('Enter')

    await expect(page.getByTestId('todo-item')).toHaveCount(1)
  })

  test('勾選 checkbox 完成 todo，剩餘計數歸零', async ({ page }) => {
    await page.fill('input[type="text"]', '買牛奶')
    await page.getByTestId('add-btn').click()

    await page.locator('input[type="checkbox"]').click()

    await expect(page.getByTestId('todo-text')).toHaveClass(/line-through/)
    await expect(page.getByTestId('remaining-count')).toContainText('0')
  })

  test('刪除 todo，清單回到空狀態', async ({ page }) => {
    await page.fill('input[type="text"]', '買牛奶')
    await page.getByTestId('add-btn').click()

    await page.getByTestId('remove-btn').click()

    await expect(page.getByTestId('todo-item')).toHaveCount(0)
    await expect(page.getByText('沒有待辦事項')).toBeVisible()
  })

  test('filter 切換完整流程', async ({ page }) => {
    await page.fill('input[type="text"]', '買牛奶')
    await page.getByTestId('add-btn').click()
    await page.fill('input[type="text"]', '去健身房')
    await page.getByTestId('add-btn').click()

    await page.locator('input[type="checkbox"]').first().click()

    await page.getByTestId('filter-active').click()
    await expect(page.getByTestId('todo-item')).toHaveCount(1)
    await expect(page.getByText('去健身房')).toBeVisible()

    await page.getByTestId('filter-completed').click()
    await expect(page.getByTestId('todo-item')).toHaveCount(1)
    await expect(page.getByText('買牛奶')).toBeVisible()

    await page.getByTestId('filter-all').click()
    await expect(page.getByTestId('todo-item')).toHaveCount(2)
  })
})
