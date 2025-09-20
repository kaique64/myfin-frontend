<template>
  <CardContainer>
    <Title size="2xl" tag="h1">{{ texts.transaction.register.title }}</Title>
    <Divider size="xs" />

    <form @submit.prevent="handleSubmit" class="space-y-6 mt-6">
      <div>
        <label for="value" class="block text-sm font-medium text-gray-700 mb-2">
          {{ texts.transaction.register.value }}
        </label>
        <input
          id="value"
          v-model="form.value"
          type="text"
          :placeholder="texts.transaction.register.valuePlaceholder"
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

      <Button type="submit" variant="success" size="lg" class="w-full cursor-pointer">
        {{ texts.transaction.register.save }}
      </Button>
    </form>
  </CardContainer>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { texts } from '@/shared/texts'
import CardContainer from '../shared/card/CardContainer.vue'
import Title from '../shared/Title.vue'
import Divider from '../shared/Divider.vue'
import Button from '../shared/Button.vue'

export interface TransactionForm {
  value: string
  type: 'income' | 'expense'
  category: string
  paymentMethod: string
  date: string
  description: string
}

const emit = defineEmits<{
  submit: [form: TransactionForm]
}>()

const form = reactive<TransactionForm>({
  value: '',
  type: 'income',
  category: 'food',
  paymentMethod: 'cash',
  date: '',
  description: '',
})

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
