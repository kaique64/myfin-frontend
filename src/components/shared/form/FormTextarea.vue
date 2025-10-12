<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :rows="rows"
      autocomplete="off"
      v-bind="$attrs"
      :class="[
        'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent resize-none',
        error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
      ]"
    ></textarea>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

