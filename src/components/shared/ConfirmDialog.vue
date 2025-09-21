<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="cancel"></div>

    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ message }}</p>

        <div class="flex justify-end gap-3">
          <button
            @click="cancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirm"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ConfirmDialogProps {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  title: 'Confirm',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary',
})

const isOpen = ref(false)
let resolvePromise: (value: boolean) => void

function open(): Promise<boolean> {
  isOpen.value = true
  return new Promise<boolean>((resolve) => {
    resolvePromise = resolve
  })
}

function confirm() {
  isOpen.value = false
  resolvePromise(true)
}

function cancel() {
  isOpen.value = false
  resolvePromise(false)
}

defineExpose({
  open,
})
</script>
