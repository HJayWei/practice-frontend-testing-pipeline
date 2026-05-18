<script setup lang="ts">
import type { Todo } from '~/composables/useTodos'

defineProps<{ todos: Todo[] }>()
const emit = defineEmits<{
  toggle: [id: number]
  remove: [id: number]
}>()
</script>

<template>
  <ul v-if="todos.length">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="emit('toggle', $event)"
      @remove="emit('remove', $event)"
    />
  </ul>
  <p v-else>沒有待辦事項</p>
</template>
