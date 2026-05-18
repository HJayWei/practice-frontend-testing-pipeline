import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('IndexPage', () => {
  it('renders heading', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.find('h1').text()).toBe('Hello Nuxt 4')
  })
})
