<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-gray-500/50" id="backdrop" @click="cancel"></div>

    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 z-10 max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <Title size="2xl" tag="h1">{{ texts.transaction.edit.title }}</Title>
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
          <FormInput
            id="title"
            :label="texts.transaction.register.transactionTitle"
            v-model="titleField"
            v-bind="titleAttrs"
            :placeholder="texts.transaction.register.transactionTitlePlaceholder"
            :error="errors.title"
          />

          <FormCurrencyInput
            id="value"
            :label="texts.transaction.register.value"
            v-model="amountField"
            :placeholder="texts.transaction.register.valuePlaceholder"
            :error="errors.amount"
            @blur="amountAttrs.onBlur"
          />

          <FormSelect
            id="type"
            :label="texts.transaction.register.type"
            v-model="typeField"
            v-bind="typeAttrs"
            :error="errors.type"
          >
            <option value="income">{{ texts.transaction.register.income }}</option>
            <option value="expense">{{ texts.transaction.register.expense }}</option>
          </FormSelect>

          <FormSelect
            id="category"
            :label="texts.transaction.register.category"
            v-model="categoryField"
            v-bind="categoryAttrs"
            :error="errors.category"
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
          </FormSelect>

          <FormSelect
            id="paymentMethod"
            :label="texts.transaction.register.paymentMethod"
            v-model="paymentMethodField"
            v-bind="paymentMethodAttrs"
            :error="errors.paymentMethod"
          >
            <option value="cash">{{ texts.transaction.register.paymentMethods.cash }}</option>
            <option value="credit">{{ texts.transaction.register.paymentMethods.credit }}</option>
            <option value="debit">{{ texts.transaction.register.paymentMethods.debit }}</option>
            <option value="pix">{{ texts.transaction.register.paymentMethods.pix }}</option>
          </FormSelect>

          <FormInput
            id="date"
            :label="texts.transaction.register.date"
            v-model="dateField"
            v-bind="dateAttrs"
            type="date"
            :error="errors.date"
          />

          <FormTextarea
            id="description"
            :label="texts.transaction.register.description"
            v-model="descriptionField"
            v-bind="descriptionAttrs"
            :placeholder="texts.transaction.register.descriptionPlaceholder"
            :error="errors.description"
          />

          <div class="flex justify-end gap-3">
            <Button type="button" variant="primary" @click="cancel">
              {{ texts.transaction.register.cancel }}
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
import { ref, onUnmounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { texts } from '@/shared/texts'
import Title from '../shared/Title.vue'
import Divider from '../shared/Divider.vue'
import Button from '../shared/Button.vue'
import FormInput from '../shared/form/FormInput.vue'
import FormSelect from '../shared/form/FormSelect.vue'
import FormTextarea from '../shared/form/FormTextarea.vue'
import FormCurrencyInput from '../shared/form/FormCurrencyInput.vue'
import type { TransactionType, TransactionDTO } from '../../shared/types/transaction'
import {
  registerTransactionSchema,
  initialValues,
  type TransactionForm,
} from '@/schemas/transaction'

const emit = defineEmits<{
  submit: [form: TransactionForm & { id: string }]
  cancel: []
}>()

const isOpen = ref(false)
const currentTransaction = ref<TransactionDTO | null>(null)

const validationSchema = toTypedSchema(registerTransactionSchema)

const { handleSubmit, defineField, errors, resetForm, setValues } = useForm({
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
const [amountField, amountAttrs] = defineField('amount', {
  validateOnModelUpdate: false,
  validateOnBlur: true,
})

const onSubmit = handleSubmit((values) => {
  if (!currentTransaction.value) return

  const formData = {
    id: currentTransaction.value.id,
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

function open(transaction: TransactionDTO) {
  resetForm()
  currentTransaction.value = transaction

  setValues({
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type as TransactionType,
    category: transaction.category,
    paymentMethod: transaction.paymentMethod,
    date: transaction.date,
    description: transaction.description || '',
  })

  isOpen.value = true
}

function close() {
  isOpen.value = false
  currentTransaction.value = null
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
