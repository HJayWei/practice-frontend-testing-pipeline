import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TodoList from '~/components/TodoList.vue'

const todos = [
  { id: 1, text: '買牛奶', completed: false },
  { id: 2, text: '去健身房', completed: true },
]

describe('TodoList', () => {
  it('渲染所有 todo 項目', async () => {
    const wrapper = await mountSuspended(TodoList, { props: { todos } })
    expect(wrapper.findAll('[data-testid="todo-item"]')).toHaveLength(2)
  })

  it('清單為空時顯示提示文字', async () => {
    const wrapper = await mountSuspended(TodoList, { props: { todos: [] } })
    expect(wrapper.text()).toContain('沒有待辦事項')
  })

  it('點擊 checkbox 向上 emit toggle 事件與 id', async () => {
    const wrapper = await mountSuspended(TodoList, { props: { todos } })
    await wrapper.findAll('input[type="checkbox"]')[0].trigger('change')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('toggle')![0]).toEqual([1])
  })

  it('點擊刪除按鈕向上 emit remove 事件與 id', async () => {
    const wrapper = await mountSuspended(TodoList, { props: { todos } })
    await wrapper.findAll('[data-testid="remove-btn"]')[1].trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')![0]).toEqual([2])
  })
})
