<template>
  <div class="space-y-12">
    <Dashboard />
    <RegisterTransaction @submit="handleRegisterTransaction" />
  </div>
</template>

<script setup lang="ts">
import Dashboard from '@/components/dashboard/Dashboard.vue'
import type { CreateTransactionDTO } from '@/shared/types/transaction'
import RegisterTransaction, {
  type TransactionForm,
} from '@/components/transaction/RegisterTransaction.vue'
import { useTransactionStore } from '@/stores/transaction'

const transactionStore = useTransactionStore()

function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

async function handleRegisterTransaction(form: TransactionForm) {
  const transaction: CreateTransactionDTO = {
    amount: form.amount,
    title: form.title || 'Transação',
    currency: 'BRL',
    type: form.type,
    category: form.category,
    paymentMethod: form.paymentMethod,
    description: form.description,
    date: formatDate(form.date),
  }

  await transactionStore.saveTransaction(transaction)
}
</script>
