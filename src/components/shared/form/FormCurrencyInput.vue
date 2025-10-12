<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      :value="formattedValue"
      @input="handleInput"
      @blur="$emit('blur')"
      type="text"
      autocomplete="off"
      :placeholder="placeholder"
      v-bind="$attrs"
      :class="[
        'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent',
        error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const formattedValue = computed(() => {
  if (props.modelValue === 0) return ''

  return props.modelValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  const num = Number(String(value).replace(/\D/g, '')) / 100

  emit('update:modelValue', num)

  // Format the input field
  const formattedAmount = `R$ ${num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  target.value = formattedAmount
}
</script>
