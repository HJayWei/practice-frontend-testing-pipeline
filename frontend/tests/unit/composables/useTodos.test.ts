import { describe, it, expect, beforeEach } from 'vitest'
import { useTodos } from '~/composables/useTodos'

describe('useTodos', () => {
  let todos: ReturnType<typeof useTodos>

  beforeEach(() => {
    todos = useTodos()
  })

  describe('addTodo', () => {
    it('新增一筆 todo', () => {
      todos.addTodo('買牛奶')
      expect(todos.todos.value).toHaveLength(1)
      expect(todos.todos.value[0].text).toBe('買牛奶')
      expect(todos.todos.value[0].completed).toBe(false)
    })

    it('新增多筆 todo，每筆 id 唯一', () => {
      todos.addTodo('買牛奶')
      todos.addTodo('去健身房')
      const ids = todos.todos.value.map((t) => t.id)
      expect(new Set(ids).size).toBe(2)
    })

    it('忽略空白字串', () => {
      todos.addTodo('   ')
      expect(todos.todos.value).toHaveLength(0)
    })
  })

  describe('removeTodo', () => {
    it('依 id 刪除 todo', () => {
      todos.addTodo('買牛奶')
      const id = todos.todos.value[0].id
      todos.removeTodo(id)
      expect(todos.todos.value).toHaveLength(0)
    })

    it('id 不存在時不拋出錯誤', () => {
      expect(() => todos.removeTodo(999)).not.toThrow()
    })
  })

  describe('toggleTodo', () => {
    it('將 completed 從 false 切換為 true', () => {
      todos.addTodo('買牛奶')
      const id = todos.todos.value[0].id
      todos.toggleTodo(id)
      expect(todos.todos.value[0].completed).toBe(true)
    })

    it('再次切換回 false', () => {
      todos.addTodo('買牛奶')
      const id = todos.todos.value[0].id
      todos.toggleTodo(id)
      todos.toggleTodo(id)
      expect(todos.todos.value[0].completed).toBe(false)
    })
  })

  describe('filteredTodos', () => {
    beforeEach(() => {
      todos.addTodo('買牛奶')
      todos.addTodo('去健身房')
      todos.toggleTodo(todos.todos.value[0].id)
    })

    it('filter 為 all 時回傳全部', () => {
      todos.filter.value = 'all'
      expect(todos.filteredTodos.value).toHaveLength(2)
    })

    it('filter 為 active 時只回傳未完成', () => {
      todos.filter.value = 'active'
      expect(todos.filteredTodos.value).toHaveLength(1)
      expect(todos.filteredTodos.value[0].text).toBe('去健身房')
    })

    it('filter 為 completed 時只回傳已完成', () => {
      todos.filter.value = 'completed'
      expect(todos.filteredTodos.value).toHaveLength(1)
      expect(todos.filteredTodos.value[0].text).toBe('買牛奶')
    })
  })

  describe('remainingCount', () => {
    it('初始為 0', () => {
      expect(todos.remainingCount.value).toBe(0)
    })

    it('新增後計算未完成筆數', () => {
      todos.addTodo('買牛奶')
      todos.addTodo('去健身房')
      expect(todos.remainingCount.value).toBe(2)
    })

    it('完成一筆後減少', () => {
      todos.addTodo('買牛奶')
      todos.addTodo('去健身房')
      todos.toggleTodo(todos.todos.value[0].id)
      expect(todos.remainingCount.value).toBe(1)
    })
  })
})
