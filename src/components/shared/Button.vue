<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Variant } from './types/variant';

interface Props {
  variant?: Variant
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses: Record<Variant, string> = {
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white', 
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    info: 'bg-cyan-600 hover:bg-cyan-700 text-white'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]}`
})
</script>

<style scoped>
.bg-green-600 {
  background-color: #16A34A;
}

.hover\:bg-green-700:hover {
  background-color: #15803D;
}

.bg-red-500 {
  background-color: #EF4444;
}

.hover\:bg-red-600:hover {
  background-color: #DC2626;
}

.bg-yellow-500 {
  background-color: #EAB308;
}

.hover\:bg-yellow-600:hover {
  background-color: #CA8A04;
}
</style>