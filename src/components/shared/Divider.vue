<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div :class="dividerClasses" :style="customStyle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type DividerOrientation = 'horizontal' | 'vertical'
type DividerSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

interface Props {
  orientation?: DividerOrientation
  size?: DividerSize
  color?: string
  margin?: string
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  size: 'base',
  color: '#E5E7EB',
  margin: 'my-4',
  customClass: '',
})

const dividerClasses = computed(() => {
  const baseClasses = 'border-0'

  const orientationClasses = {
    horizontal: 'w-full',
    vertical: 'h-full',
  }

  const sizeClasses: Record<DividerSize, string> = {
    xs: props.orientation === 'horizontal' ? 'h-px' : 'w-px',
    sm: props.orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    base: props.orientation === 'horizontal' ? 'h-px' : 'w-px',
    lg: props.orientation === 'horizontal' ? 'h-1' : 'w-1',
    xl: props.orientation === 'horizontal' ? 'h-1.5' : 'w-1.5',
  }

  return `${baseClasses} ${orientationClasses[props.orientation]} ${sizeClasses[props.size]} ${props.margin} ${props.customClass}`.trim()
})

const customStyle = computed(() => ({
  backgroundColor: props.color,
}))
</script>
