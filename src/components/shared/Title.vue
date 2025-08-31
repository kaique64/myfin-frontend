<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <component :is="tag" :class="titleClasses">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TitleSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

interface Props {
  size?: TitleSize
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: string
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  margin?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'xl',
  tag: 'h1',
  color: 'text-gray-900',
  weight: 'bold',
})

const titleClasses = computed(() => {
  const sizeClasses: Record<TitleSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  }

  return `${sizeClasses[props.size]} ${weightClasses[props.weight]} ${props.color} ${props.margin}`
})
</script>
