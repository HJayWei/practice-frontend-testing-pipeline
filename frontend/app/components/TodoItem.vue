<script setup lang="ts">
import type { Todo } from '~/composables/useTodos'

defineProps<{ todo: Todo }>()
const emit = defineEmits<{
  toggle: [id: number]
  remove: [id: number]
}>()
</script>

<template>
  <li data-testid="todo-item" class="flex items-center gap-2 py-1">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="emit('toggle', todo.id)"
    />
    <span
      data-testid="todo-text"
      :class="{ 'line-through text-gray-400': todo.completed }"
    >{{ todo.text }}</span>
    <button
      data-testid="remove-btn"
      @click="emit('remove', todo.id)"
    >刪除</button>
  </li>
</template>
