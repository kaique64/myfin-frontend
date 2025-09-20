<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Transition
    :enter-active-class="enterActiveClass"
    :enter-from-class="enterFromClass"
    :enter-to-class="enterToClass"
    :leave-active-class="leaveActiveClass"
    :leave-from-class="leaveFromClass"
    :leave-to-class="leaveToClass"
  >
    <div v-if="visible" :class="notificationClasses">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <slot>{{ message }}</slot>
        </div>
        <button
          v-if="showCloseButton"
          @click="emit('close')"
          class="ml-3 flex-shrink-0 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-200"
          aria-label="Fechar notificação"
        >
          <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import type { Variant } from '../types/variant'

type NotificationPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

interface Props {
  visible?: boolean
  message?: string
  variant?: Variant
  position?: NotificationPosition
  duration?: number
  customClass?: string
  showCloseButton?: boolean
  enterActiveClass?: string
  enterFromClass?: string
  enterToClass?: string
  leaveActiveClass?: string
  leaveFromClass?: string
  leaveToClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  message: '',
  variant: 'primary',
  position: 'bottom-right',
  duration: 3000,
  customClass: '',
  showCloseButton: true,
  enterActiveClass: 'transform transition duration-300 ease-out',
  enterFromClass: 'translate-y-8 opacity-0 scale-95',
  enterToClass: 'translate-y-0 opacity-100 scale-100',
  leaveActiveClass: 'transform transition duration-200 ease-in',
  leaveFromClass: 'translate-y-0 opacity-100 scale-100',
  leaveToClass: 'translate-y-8 opacity-0 scale-95',
})

const emit = defineEmits<{
  close: []
}>()

let timeoutId: ReturnType<typeof setTimeout> | null = null

const notificationClasses = computed(() => {
  const baseClasses = 'px-4 py-2 rounded shadow-lg text-white relative max-w-sm w-full'

  const variantClasses: Record<Variant, string> = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
  }

  return `${baseClasses} ${variantClasses[props.variant]} ${props.customClass}`.trim()
})

// Auto-close functionality
watch(
  () => props.visible,
  (newVisible) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    if (newVisible && props.duration > 0) {
      timeoutId = setTimeout(() => {
        emit('close')
      }, props.duration)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>
