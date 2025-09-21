<template>
  <CardContainer>
    <Title size="2xl" tag="h1">{{ texts.transaction.register.title }}</Title>
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
          <option value="transport">{{ texts.transaction.register.categories.transport }}</option>
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
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
      </div>

      <Button type="submit" variant="success" class="w-full cursor-pointer">
        {{ texts.transaction.register.save }}
      </Button>
    </form>
  </CardContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { texts } from '@/shared/texts'
import CardContainer from '../shared/card/CardContainer.vue'
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
}>()

const validationSchema = toTypedSchema(registerTransactionSchema)

const { handleSubmit, defineField, errors, setFieldValue } = useForm({
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

  const cleanValue = value.replace(/[^\d.,]/g, '')

  const limitedValue = cleanValue.slice(0, 15)

  rawAmount.value = limitedValue

  const numbersOnly = limitedValue.replace(/\D/g, '')

  let amountInCentavos: number | undefined = undefined

  if (!numbersOnly) {
    amountInCentavos = undefined
  } else {
    const hasDecimalSeparator = limitedValue.includes(',') || limitedValue.includes('.')

    if (hasDecimalSeparator) {
      const lastCommaIndex = limitedValue.lastIndexOf(',')
      const lastDotIndex = limitedValue.lastIndexOf('.')
      const lastSeparatorIndex = Math.max(lastCommaIndex, lastDotIndex)

      const integerPart = limitedValue.substring(0, lastSeparatorIndex).replace(/\D/g, '')
      const decimalPart = limitedValue
        .substring(lastSeparatorIndex + 1)
        .replace(/\D/g, '')
        .slice(0, 2)

      const integer = parseInt(integerPart) || 0
      const decimal = parseInt(decimalPart.padEnd(2, '0'))

      amountInCentavos = integer * 100 + decimal
    } else {
      const parsedNumber = parseInt(numbersOnly)
      amountInCentavos = parsedNumber > 0 ? parsedNumber : undefined
    }
  }

  setFieldValue('amount', amountInCentavos)
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
})
</script>
