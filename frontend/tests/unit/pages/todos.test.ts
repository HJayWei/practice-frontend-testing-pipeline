import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TodosPage from '~/pages/todos.vue'

describe('TodosPage', () => {
  describe('初始狀態', () => {
    it('顯示頁面標題', async () => {
      const wrapper = await mountSuspended(TodosPage)
      expect(wrapper.find('h1').text()).toBe('Todo List')
    })

    it('初始清單為空，顯示提示文字', async () => {
      const wrapper = await mountSuspended(TodosPage)
      expect(wrapper.text()).toContain('沒有待辦事項')
    })

    it('顯示剩餘計數為 0', async () => {
      const wrapper = await mountSuspended(TodosPage)
      expect(wrapper.find('[data-testid="remaining-count"]').text()).toContain('0')
    })
  })

  describe('新增 todo', () => {
    it('輸入後點擊新增，清單出現一筆', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await wrapper.find('input[type="text"]').setValue('買牛奶')
      await wrapper.find('[data-testid="add-btn"]').trigger('click')
      expect(wrapper.findAll('[data-testid="todo-item"]')).toHaveLength(1)
      expect(wrapper.text()).toContain('買牛奶')
    })

    it('新增後剩餘計數增加', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await wrapper.find('input[type="text"]').setValue('買牛奶')
      await wrapper.find('[data-testid="add-btn"]').trigger('click')
      expect(wrapper.find('[data-testid="remaining-count"]').text()).toContain('1')
    })
  })

  describe('完成與刪除', () => {
    it('勾選 checkbox 後文字出現刪除線', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await wrapper.find('input[type="text"]').setValue('買牛奶')
      await wrapper.find('[data-testid="add-btn"]').trigger('click')
      await wrapper.find('input[type="checkbox"]').trigger('change')
      expect(wrapper.find('[data-testid="todo-text"]').classes()).toContain('line-through')
    })

    it('勾選後剩餘計數歸零', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await wrapper.find('input[type="text"]').setValue('買牛奶')
      await wrapper.find('[data-testid="add-btn"]').trigger('click')
      await wrapper.find('input[type="checkbox"]').trigger('change')
      expect(wrapper.find('[data-testid="remaining-count"]').text()).toContain('0')
    })

    it('點擊刪除按鈕移除項目', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await wrapper.find('input[type="text"]').setValue('買牛奶')
      await wrapper.find('[data-testid="add-btn"]').trigger('click')
      await wrapper.find('[data-testid="remove-btn"]').trigger('click')
      expect(wrapper.findAll('[data-testid="todo-item"]')).toHaveLength(0)
    })
  })

  describe('filter 切換', () => {
    async function setupWithTwoTodos(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
      await wrapper.find('input[type="text"]').setValue('買牛奶')
      await wrapper.find('[data-testid="add-btn"]').trigger('click')
      await wrapper.find('input[type="text"]').setValue('去健身房')
      await wrapper.find('[data-testid="add-btn"]').trigger('click')
      await wrapper.find('input[type="checkbox"]').trigger('change')
    }

    it('filter=all 顯示全部', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await setupWithTwoTodos(wrapper)
      await wrapper.find('[data-testid="filter-all"]').trigger('click')
      expect(wrapper.findAll('[data-testid="todo-item"]')).toHaveLength(2)
    })

    it('filter=active 只顯示未完成', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await setupWithTwoTodos(wrapper)
      await wrapper.find('[data-testid="filter-active"]').trigger('click')
      expect(wrapper.findAll('[data-testid="todo-item"]')).toHaveLength(1)
      expect(wrapper.text()).toContain('去健身房')
    })

    it('filter=completed 只顯示已完成', async () => {
      const wrapper = await mountSuspended(TodosPage)
      await setupWithTwoTodos(wrapper)
      await wrapper.find('[data-testid="filter-completed"]').trigger('click')
      expect(wrapper.findAll('[data-testid="todo-item"]')).toHaveLength(1)
      expect(wrapper.text()).toContain('買牛奶')
    })
  })
})
