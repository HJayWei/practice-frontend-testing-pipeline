import { ref, computed } from 'vue'

export type FilterType = 'all' | 'active' | 'completed'

export interface Todo {
  id: number
  text: string
  completed: boolean
}

export function useTodos() {
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')
  let nextId = 1

  function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    todos.value.push({ id: nextId++, text: trimmed, completed: false })
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  const filteredTodos = computed(() => {
    if (filter.value === 'active') return todos.value.filter((t) => !t.completed)
    if (filter.value === 'completed') return todos.value.filter((t) => t.completed)
    return todos.value
  })

  const remainingCount = computed(() => todos.value.filter((t) => !t.completed).length)

  return { todos, filter, filteredTodos, remainingCount, addTodo, removeTodo, toggleTodo }
}
