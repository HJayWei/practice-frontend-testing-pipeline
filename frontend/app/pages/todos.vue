<script setup lang="ts">
import type { FilterType } from '~/composables/useTodos'

const { filter, filteredTodos, remainingCount, hasCompleted, addTodo, removeTodo, toggleTodo, clearCompleted } = useTodos()

const filters: { label: string; value: FilterType; testid: string }[] = [
  { label: '全部', value: 'all', testid: 'filter-all' },
  { label: '未完成', value: 'active', testid: 'filter-active' },
  { label: '已完成', value: 'completed', testid: 'filter-completed' },
]
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Todo List</h1>

    <TodoInput @add="addTodo" />

    <div class="flex gap-2 my-3">
      <button
        v-for="f in filters"
        :key="f.value"
        :data-testid="f.testid"
        :class="{ 'font-bold underline': filter === f.value }"
        @click="filter = f.value"
      >{{ f.label }}</button>
    </div>

    <p data-testid="remaining-count" class="text-sm text-gray-500 mb-2">
      剩餘 {{ remainingCount }} 筆
    </p>

    <TodoList
      :todos="filteredTodos"
      @toggle="toggleTodo"
      @remove="removeTodo"
    />

    <button
      v-if="hasCompleted"
      data-testid="clear-completed"
      class="mt-3 text-sm text-red-500 hover:underline"
      @click="clearCompleted"
    >清除已完成</button>
  </div>
</template>
