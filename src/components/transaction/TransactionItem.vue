<template>
  <div
    :class="[
      'flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150',
      clickable && 'cursor-pointer',
    ]"
    @click="handleClick"
  >
    <div class="flex-1 w-1">
      <h3 class="truncate text-sm font-medium text-gray-900 mb-1">
        {{ title }}
      </h3>
      <p class="truncate text-xs text-gray-500">
        {{ subtitle }}
      </p>
    </div>
    <div class="flex flex-col items-end gap-2">
      <p :class="['text-lg font-semibold', amountColorClass]">
        {{ formattedAmount }}
      </p>

      <div v-if="showActions" class="flex gap-2">
        <button
          v-if="showEditButton"
          @click.stop="handleEdit"
          :class="[
            'px-3 py-1 text-xs font-medium rounded transition-colors duration-150',
            'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
            'cursor-pointer',
          ]"
        >
          {{ editButtonText }}
        </button>
        <button
          v-if="showDeleteButton"
          @click.stop="handleDelete"
          :class="[
            'px-3 py-1 text-xs font-medium rounded transition-colors duration-150',
            'bg-red-100 text-red-700 hover:bg-red-200',
            'cursor-pointer',
          ]"
        >
          {{ deleteButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TransactionType } from '../../shared/types/transaction'

export interface TransactionItemProps {
  title: string
  subtitle: string
  amount: number
  type?: TransactionType
  currency?: string
  locale?: string
  showCurrency?: boolean
  showActions?: boolean
  showEditButton?: boolean
  showDeleteButton?: boolean
  editButtonText?: string
  deleteButtonText?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<TransactionItemProps>(), {
  type: 'expense',
  currency: 'BRL',
  locale: 'pt-BR',
  showCurrency: true,
  showActions: true,
  showEditButton: true,
  showDeleteButton: true,
  editButtonText: 'Editar',
  deleteButtonText: 'Excluir',
  clickable: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  edit: [event: MouseEvent]
  delete: [event: MouseEvent]
}>()

const amountColorClass = computed(() => {
  const colors = {
    income: 'text-green-600',
    expense: 'text-red-600',
    neutral: 'text-gray-900',
  }
  return colors[props.type]
})

const formattedAmount = computed(() => {
  const prefix = props.type === 'expense' ? '- ' : props.type === 'income' ? '+ ' : ''

  if (!props.showCurrency) {
    return prefix + Math.abs(props.amount).toLocaleString(props.locale)
  }

  const formatted = new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
  }).format(Math.abs(props.amount))

  return prefix + formatted
})

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}

const handleEdit = (event: MouseEvent) => {
  emit('edit', event)
}

const handleDelete = (event: MouseEvent) => {
  emit('delete', event)
}
</script>
