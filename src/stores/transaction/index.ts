import { TransactionRestClient } from '@/http/clients/transaction/TransactionRestClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CreateTransactionDTO, TransactionDTO } from '../../shared/types/transaction'

export interface TransactionsResponse {
  data: TransactionDTO[]
  filters: {
    category: string
    title: string
  }
  pagination: {
    count: number
    limit: number
    skip: number
  }
}

export interface TransactionDashboardResponse {
  incomeAmount: number
  expenseAmount: number
  totalAmount: number
}

export const useTransactionStore = defineStore('transaction', () => {
  const transactionRestClient = new TransactionRestClient()
  const transactions = ref<TransactionDTO[]>([])
  const transactionDashboard = ref<TransactionDashboardResponse | null>(null)
  const isLoading = ref(false)

  async function saveTransaction(
    transaction: CreateTransactionDTO,
  ): Promise<TransactionDTO | undefined> {
    try {
      const response = await transactionRestClient.post<TransactionDTO, CreateTransactionDTO>({
        url: '/transactions',
        payload: transaction,
      })

      await getAllTransactions()

      return response?.data
    } catch (error) {
      throw error
    }
  }

  async function getAllTransactions(): Promise<void> {
    try {
      isLoading.value = true
      const response = await transactionRestClient.get<TransactionsResponse>({
        url: '/transactions',
      })

      if (response?.data) {
        transactions.value = response.data.data
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTransaction(id: string): Promise<void> {
    try {
      await transactionRestClient.delete({
        url: `/transactions/${id}`,
      })

      await getAllTransactions()
    } catch (error) {
      throw error
    }
  }

  async function getTransactionDashboard(): Promise<void> {
    try {
      isLoading.value = true

      const response = await transactionRestClient.get<TransactionDashboardResponse>({
        url: '/transactions/dashboard',
      })

      if (response?.data) {
        transactionDashboard.value = response.data
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    saveTransaction,
    getAllTransactions,
    getTransactionDashboard,
    deleteTransaction,
    transactions,
    transactionDashboard,
    isLoading,
  }
})
