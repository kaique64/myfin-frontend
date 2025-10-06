<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-gray-500/50" id="backdrop" @click="cancel"></div>

    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 z-10 max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <Title size="2xl" tag="h1">{{ texts.transaction.register.title }}</Title>
          <button @click="cancel" class="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <Divider size="xs" />

        <form @submit="onSubmit" class="space-y-6 mt-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              {{ texts.transaction.register.transactionTitle }}
            </label>
            <input
              id="title"
              v-model="titleField"
              v-bind="titleAttrs"
              type="text"
              autocomplete="off"
              :placeholder="texts.transaction.register.transactionTitlePlaceholder"
              :class="[
                'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent',
                errors.title
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <div>
            <label for="value" class="block text-sm font-medium text-gray-700 mb-2">
              {{ texts.transaction.register.value }}
            </label>
            <input
              id="value"
              v-model="formattedAmount"
              type="text"
              autocomplete="off"
              :placeholder="texts.transaction.register.valuePlaceholder"
              @input="handleAmountInput"
              @blur="amountAttrs.onBlur"
              :class="[
                'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent',
                errors.amount
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            />
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount }}</p>
          </div>

          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
              {{ texts.transaction.register.type }}
            </label>
            <select
              id="type"
              v-model="typeField"
              v-bind="typeAttrs"
              :class="[
                'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent',
                errors.type
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="income">{{ texts.transaction.register.income }}</option>
              <option value="expense">{{ texts.transaction.register.expense }}</option>
            </select>
            <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              {{ texts.transaction.register.category }}
            </label>
            <select
              id="category"
              v-model="categoryField"
              v-bind="categoryAttrs"
              :class="[
                'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent',
                errors.category
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="food">{{ texts.transaction.register.categories.food }}</option>
              <option value="transport">
                {{ texts.transaction.register.categories.transport }}
              </option>
              <option value="entertainment">
                {{ texts.transaction.register.categories.entertainment }}
              </option>
              <option value="health">{{ texts.transaction.register.categories.health }}</option>
              <option value="other">{{ texts.transaction.register.categories.other }}</option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
          </div>

          <div>
            <label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-2">
              {{ texts.transaction.register.paymentMethod }}
            </label>
            <select
              id="paymentMethod"
              v-model="paymentMethodField"
              v-bind="paymentMethodAttrs"
              :class="[
                'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent',
                errors.paymentMethod
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="cash">{{ texts.transaction.register.paymentMethods.cash }}</option>
              <option value="credit">{{ texts.transaction.register.paymentMethods.credit }}</option>
              <option value="debit">{{ texts.transaction.register.paymentMethods.debit }}</option>
              <option value="pix">{{ texts.transaction.register.paymentMethods.pix }}</option>
            </select>
            <p v-if="errors.paymentMethod" class="mt-1 text-sm text-red-600">
              {{ errors.paymentMethod }}
            </p>
          </div>

          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
              {{ texts.transaction.register.date }}
            </label>
            <input
              id="date"
              v-model="dateField"
              v-bind="dateAttrs"
              type="date"
              autocomplete="off"
              :class="[
                'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent',
                errors.date
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            />
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              {{ texts.transaction.register.description }}
            </label>
            <textarea
              id="description"
              v-model="descriptionField"
              v-bind="descriptionAttrs"
              rows="4"
              autocomplete="off"
              :placeholder="texts.transaction.register.descriptionPlaceholder"
              :class="[
                'w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent resize-none',
                errors.description
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">
              {{ errors.description }}
            </p>
          </div>

          <div class="flex justify-end gap-3">
            <Button type="button" variant="primary" @click="cancel">
              {{ texts.transaction.register.cancel || 'Cancel' }}
            </Button>
            <Button type="submit" variant="success">
              {{ texts.transaction.register.save }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { texts } from '@/shared/texts'
import Title from '../shared/Title.vue'
import Divider from '../shared/Divider.vue'
import Button from '../shared/Button.vue'
import type { TransactionType } from '../../shared/types/transaction'
import {
  registerTransactionSchema,
  initialValues,
  type TransactionForm,
} from '@/schemas/transaction'

const emit = defineEmits<{
  submit: [form: TransactionForm]
  cancel: []
}>()

const isOpen = ref(false)

const validationSchema = toTypedSchema(registerTransactionSchema)

const { handleSubmit, defineField, errors, setFieldValue, resetForm } = useForm({
  validationSchema,
  validateOnMount: false,
  initialValues,
})

const [titleField, titleAttrs] = defineField('title', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})
const [typeField, typeAttrs] = defineField('type', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})
const [categoryField, categoryAttrs] = defineField('category', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})
const [paymentMethodField, paymentMethodAttrs] = defineField('paymentMethod', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})
const [dateField, dateAttrs] = defineField('date', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})
const [descriptionField, descriptionAttrs] = defineField('description', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [amountField, amountAttrs] = defineField('amount', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})

const rawAmount = ref('')

const formattedAmount = computed({
  get() {
    if (!rawAmount.value) return ''

    const numbers = rawAmount.value.replace(/\D/g, '')

    if (!numbers) return ''

    const centavos = parseInt(numbers) || 0
    const value = centavos / 100

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  },
  set(value: string) {
    rawAmount.value = value
  },
})

const handleAmountInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  const num = Number(String(value).replace(/\D/g, '')) / 100
  const amount = `R$ ${num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  rawAmount.value = amount

  setFieldValue('amount', num)
}

const onSubmit = handleSubmit((values) => {
  const formData: TransactionForm = {
    title: values.title,
    amount: values.amount || 0,
    type: values.type as TransactionType,
    category: values.category,
    paymentMethod: values.paymentMethod,
    date: values.date,
    description: values.description || '',
  }

  emit('submit', formData)
  close()
})

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    cancel()
  }
}

function open() {
  resetForm()
  rawAmount.value = ''
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function cancel() {
  close()
  emit('cancel')
}

watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeyDown)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

defineExpose({
  open,
  close,
})
</script>

