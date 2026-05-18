import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TodoInput from '~/components/TodoInput.vue'

describe('TodoInput', () => {
  it('渲染輸入框與新增按鈕', async () => {
    const wrapper = await mountSuspended(TodoInput)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="add-btn"]').exists()).toBe(true)
  })

  it('點擊新增按鈕 emit add 事件與輸入值', async () => {
    const wrapper = await mountSuspended(TodoInput)
    await wrapper.find('input[type="text"]').setValue('買牛奶')
    await wrapper.find('[data-testid="add-btn"]').trigger('click')
    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.emitted('add')![0]).toEqual(['買牛奶'])
  })

  it('新增後清空輸入框', async () => {
    const wrapper = await mountSuspended(TodoInput)
    const input = wrapper.find('input[type="text"]')
    await input.setValue('買牛奶')
    await wrapper.find('[data-testid="add-btn"]').trigger('click')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('Enter 鍵也可觸發新增', async () => {
    const wrapper = await mountSuspended(TodoInput)
    await wrapper.find('input[type="text"]').setValue('去健身房')
    await wrapper.find('input[type="text"]').trigger('keyup.enter')
    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.emitted('add')![0]).toEqual(['去健身房'])
  })

  it('輸入空白時不 emit add', async () => {
    const wrapper = await mountSuspended(TodoInput)
    await wrapper.find('input[type="text"]').setValue('   ')
    await wrapper.find('[data-testid="add-btn"]').trigger('click')
    expect(wrapper.emitted('add')).toBeFalsy()
  })
})
