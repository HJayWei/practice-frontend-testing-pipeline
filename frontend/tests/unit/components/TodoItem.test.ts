import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TodoItem from '~/components/TodoItem.vue'

const todo = { id: 1, text: '買牛奶', completed: false }
const completedTodo = { id: 2, text: '去健身房', completed: true }

describe('TodoItem', () => {
  it('顯示 todo 文字', async () => {
    const wrapper = await mountSuspended(TodoItem, { props: { todo } })
    expect(wrapper.text()).toContain('買牛奶')
  })

  it('未完成時無刪除線樣式', async () => {
    const wrapper = await mountSuspended(TodoItem, { props: { todo } })
    expect(wrapper.find('[data-testid="todo-text"]').classes()).not.toContain('line-through')
  })

  it('已完成時有刪除線樣式', async () => {
    const wrapper = await mountSuspended(TodoItem, { props: { todo: completedTodo } })
    expect(wrapper.find('[data-testid="todo-text"]').classes()).toContain('line-through')
  })

  it('checkbox 反映 completed 狀態', async () => {
    const wrapper = await mountSuspended(TodoItem, { props: { todo: completedTodo } })
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('點擊 checkbox 觸發 toggle emit', async () => {
    const wrapper = await mountSuspended(TodoItem, { props: { todo } })
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('toggle')![0]).toEqual([1])
  })

  it('點擊刪除按鈕觸發 remove emit', async () => {
    const wrapper = await mountSuspended(TodoItem, { props: { todo } })
    await wrapper.find('[data-testid="remove-btn"]').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')![0]).toEqual([1])
  })
})
