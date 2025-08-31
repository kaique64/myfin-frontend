<template>
  <div
    :class="[
      'rounded-lg p-6 shadow-sm border-l-4 transition-all duration-200 hover:shadow-md',
      variantClasses,
    ]"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 :class="['text-sm font-medium mb-2', titleColorClass]">
          {{ title }}
        </h3>
        <p :class="['text-2xl font-bold', valueColorClass]">
          {{ formattedValue }}
        </p>
      </div>
    </div>

    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-100">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Variant } from './types/variant'

export interface CardInfoProps {
  title: string
  value: number | string
  variant?: Variant
  currency?: string
  showCurrency?: boolean
  locale?: string
}

const props = withDefaults(defineProps<CardInfoProps>(), {
  variant: 'primary',
  currency: 'BRL',
  showCurrency: true,
  locale: 'pt-BR',
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-blue-50 border-l-blue-500',
    success: 'bg-green-50 border-l-green-500',
    danger: 'bg-red-50 border-l-red-500',
    warning: 'bg-yellow-50 border-l-yellow-500',
    info: 'bg-cyan-50 border-l-cyan-500',
  }
  return variants[props.variant]
})

const titleColorClass = computed(() => {
  const colors = {
    primary: 'text-blue-700',
    success: 'text-green-700',
    danger: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-cyan-700',
  }
  return colors[props.variant]
})

const valueColorClass = computed(() => {
  const colors = {
    primary: 'text-blue-900',
    success: 'text-green-900',
    danger: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-cyan-900',
  }
  return colors[props.variant]
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') {
    return props.value
  }

  if (!props.showCurrency) {
    return props.value.toLocaleString(props.locale)
  }

  return new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
  }).format(props.value)
})
</script>
