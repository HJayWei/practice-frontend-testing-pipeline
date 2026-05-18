<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const emit = defineEmits<{ add: [text: string] }>()

function submit() {
  const trimmed = text.value.trim()
  if (!trimmed) return
  emit('add', trimmed)
  text.value = ''
}
</script>

<template>
  <div class="flex gap-2">
    <input
      v-model="text"
      type="text"
      placeholder="新增待辦事項..."
      @keyup.enter="submit"
    />
    <button data-testid="add-btn" @click="submit">新增</button>
  </div>
</template>
