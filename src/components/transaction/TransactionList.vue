<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800">Transactions</h2>
    </div>

    <div v-if="isLoading" class="p-6 text-center">
      <p class="text-gray-500">Loading transactions...</p>
    </div>

    <div v-else-if="transactions.length === 0" class="p-6 text-center">
      <p class="text-gray-500">No transactions found</p>
    </div>

    <div v-else>
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction.id"
        :title="transaction.title"
        :subtitle="`${transaction.category} • ${transaction.date}`"
        :amount="formatAmountFromCentavos(transaction.amount)"
        :type="transaction.type as TransactionType"
        :currency="transaction.currency"
        @edit="$emit('edit', transaction)"
        @delete="$emit('delete', transaction)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TransactionDTO, TransactionType } from '@/shared/types/transaction'
import TransactionItem from '@/components/transaction/TransactionItem.vue'

defineProps<{
  transactions: TransactionDTO[]
  isLoading: boolean
}>()

defineEmits<{
  edit: [transaction: TransactionDTO]
  delete: [transaction: TransactionDTO]
}>()

function formatAmountFromCentavos(amount: number) {
  return amount / 100
}
</script>
