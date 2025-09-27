<template>
  <TransactionListSkeleton v-if="isLoading" />

  <div v-else class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800">Transactions</h2>
    </div>

    <div v-if="transactions.length === 0" class="p-6 text-center">
      <p class="text-gray-500">No transactions found</p>
    </div>

    <div v-else>
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction.id"
        :title="transaction.title"
        :subtitle="`${transaction.category} • ${transaction.date}`"
        :amount="transaction.amount"
        :type="transaction.type"
        :currency="transaction.currency"
        @edit="$emit('edit', transaction)"
        @delete="$emit('delete', transaction)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TransactionDTO } from '@/shared/types/transaction'
import TransactionItem from '@/components/transaction/TransactionItem.vue'
import TransactionListSkeleton from './TransactionListSkeleton.vue';

defineProps<{
  transactions: TransactionDTO[]
  isLoading: boolean
}>()

defineEmits<{
  edit: [transaction: TransactionDTO]
  delete: [transaction: TransactionDTO]
}>()
</script>
