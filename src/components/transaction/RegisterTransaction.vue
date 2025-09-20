<template>
  <CardContainer>
    <Title size="2xl" tag="h1">{{ texts.transaction.register.title }}</Title>
    <Divider size="xs" />

    <form @submit.prevent="handleSubmit" class="space-y-6 mt-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.transactionTitle }}
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          :placeholder="texts.transaction.register.transactionTitlePlaceholder"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label for="value" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.value }}
        </label>
        <input
          id="value"
          v-model="formattedAmount"
          type="text"
          :placeholder="texts.transaction.register.valuePlaceholder"
          @input="handleAmountInput"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.type }}
        </label>
        <select
          id="type"
          v-model="form.type"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="income">{{ texts.transaction.register.income }}</option>
          <option value="expense">{{ texts.transaction.register.expense }}</option>
        </select>
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.category }}
        </label>
        <select
          id="category"
          v-model="form.category"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="food">{{ texts.transaction.register.categories.food }}</option>
          <option value="transport">{{ texts.transaction.register.categories.transport }}</option>
          <option value="entertainment">
            {{ texts.transaction.register.categories.entertainment }}
          </option>
          <option value="health">{{ texts.transaction.register.categories.health }}</option>
          <option value="other">{{ texts.transaction.register.categories.other }}</option>
        </select>
      </div>

      <div>
        <label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.paymentMethod }}
        </label>
        <select
          id="paymentMethod"
          v-model="form.paymentMethod"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="cash">{{ texts.transaction.register.paymentMethods.cash }}</option>
          <option value="credit">{{ texts.transaction.register.paymentMethods.credit }}</option>
          <option value="debit">{{ texts.transaction.register.paymentMethods.debit }}</option>
          <option value="pix">{{ texts.transaction.register.paymentMethods.pix }}</option>
        </select>
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.date }}
        </label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.description }}
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          :placeholder="texts.transaction.register.descriptionPlaceholder"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
      </div>

      <Button type="submit" variant="success" class="w-full cursor-pointer">
        {{ texts.transaction.register.save }}
      </Button>
    </form>
  </CardContainer>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { texts } from '@/shared/texts'
import CardContainer from '../shared/card/CardContainer.vue'
import Title from '../shared/Title.vue'
import Divider from '../shared/Divider.vue'
import Button from '../shared/Button.vue'
import type { TransactionType } from '../../shared/types/transaction'

export interface TransactionForm {
  title: string
  amount: number
  type: TransactionType
  category: string
  paymentMethod: string
  date: string
  description: string
}

const emit = defineEmits<{
  submit: [form: TransactionForm]
}>()

const form = reactive<TransactionForm>({
  title: '',
  amount: 0,
  type: 'income',
  category: 'food',
  paymentMethod: 'cash',
  date: '',
  description: '',
})

const rawAmount = ref('')

const formattedAmount = computed({
  get() {
    if (!rawAmount.value) return ''

    // Remove todos os caracteres não numéricos para calcular o valor em centavos
    const numbers = rawAmount.value.replace(/\D/g, '')

    if (!numbers) return ''

    // Converte para centavos (valor inteiro)
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

  // Remove caracteres não numéricos exceto vírgula e ponto
  const cleanValue = value.replace(/[^\d.,]/g, '')

  // Limita o tamanho para evitar problemas de precisão (máximo 15 dígitos)
  const limitedValue = cleanValue.slice(0, 15)

  rawAmount.value = limitedValue

  // Para form.amount, convertemos para centavos
  const numbersOnly = limitedValue.replace(/\D/g, '')

  if (!numbersOnly) {
    form.amount = 0
  } else {
    // Se tem separador decimal (vírgula ou ponto)
    const hasDecimalSeparator = limitedValue.includes(',') || limitedValue.includes('.')

    if (hasDecimalSeparator) {
      // Encontra a posição do último separador decimal
      const lastCommaIndex = limitedValue.lastIndexOf(',')
      const lastDotIndex = limitedValue.lastIndexOf('.')
      const lastSeparatorIndex = Math.max(lastCommaIndex, lastDotIndex)

      // Separa a parte inteira da decimal
      const integerPart = limitedValue.substring(0, lastSeparatorIndex).replace(/\D/g, '')
      const decimalPart = limitedValue
        .substring(lastSeparatorIndex + 1)
        .replace(/\D/g, '')
        .slice(0, 2) // máximo 2 casas decimais

      // Converte para centavos
      const integer = parseInt(integerPart) || 0
      const decimal = parseInt(decimalPart.padEnd(2, '0'))

      form.amount = integer * 100 + decimal
    } else {
      // Sem separador decimal, trata como centavos
      form.amount = parseInt(numbersOnly) || 0
    }
  }
}

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
