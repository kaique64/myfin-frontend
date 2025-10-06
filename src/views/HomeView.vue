<template>
  <div class="space-y-12">
    <Dashboard @addTransaction="openRegisterTransactionModal" />

    <TransactionList
      :transactions="transactions"
      :isLoading="isLoading"
      @edit="handleEditTransaction"
      @delete="handleDeleteTransaction"
    />

    <ConfirmDialog
      ref="confirmDialog"
      title="Delete Transaction"
      message="Are you sure you want to delete this transaction? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
    />

    <RegisterTransactionModal ref="registerTransactionModal" @submit="handleRegisterTransaction" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import type { CreateTransactionDTO, TransactionDTO } from '@/shared/types/transaction'
import TransactionList from '@/components/transaction/TransactionList.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import RegisterTransactionModal from '@/components/transaction/RegisterTransactionModal.vue'
import { useTransactionStore } from '@/stores/transaction'
import { useNotifications } from '@/composables/useNotifications'
import type { TransactionForm } from '@/schemas/transaction'

const transactionStore = useTransactionStore()
const { addNotification } = useNotifications()
const isDeletingTransaction = ref(false)
const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)
const registerTransactionModal = ref<InstanceType<typeof RegisterTransactionModal> | null>(null)

const transactions = computed(() => transactionStore.transactions)
const isLoading = computed(() => transactionStore.isLoading)

onMounted(async () => {
  try {
    await transactionStore.getAllTransactions()
  } catch (error) {
    console.log('error:', error)
    addNotification({
      message: 'Failed to load transactions',
      variant: 'danger',
    })
  }
})

function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

function openRegisterTransactionModal() {
  registerTransactionModal.value?.open()
}

async function handleRegisterTransaction(form: TransactionForm) {
  try {
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
    addNotification({
      message: 'Transaction saved successfully',
      variant: 'success',
    })
    await transactionStore.getAllTransactions()
    await transactionStore.getTransactionDashboard()
  } catch (error) {
    console.log('error:', error)
    addNotification({
      message: 'Failed to save transaction',
      variant: 'danger',
    })
  }
}

function handleEditTransaction(transaction: TransactionDTO) {
  console.log('Edit transaction:', transaction)
}

async function handleDeleteTransaction(transaction: TransactionDTO) {
  if (isDeletingTransaction.value) return

  const confirmed = await confirmDialog.value?.open()
  if (!confirmed) return

  try {
    isDeletingTransaction.value = true
    await transactionStore.deleteTransaction(transaction.id)
    addNotification({
      message: 'Transaction deleted successfully',
      variant: 'success',
    })
    await transactionStore.getAllTransactions()
    await transactionStore.getTransactionDashboard()
  } catch (error) {
    console.log('error:', error)
    addNotification({
      message: 'Failed to delete transaction',
      variant: 'danger',
    })
  } finally {
    isDeletingTransaction.value = false
  }
}
</script>
