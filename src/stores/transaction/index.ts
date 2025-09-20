import { TransactionRestClient } from '@/http/clients/transaction/TransactionRestClient'
import { defineStore } from 'pinia'
import type { CreateTransactionDTO, TransactionDTO } from '../../shared/types/transaction'

export const useTransactionStore = defineStore('transaction', () => {
  const transactionRestClient = new TransactionRestClient()

  async function saveTransaction(
    transaction: CreateTransactionDTO,
  ): Promise<TransactionDTO | undefined> {
    try {
      const response = await transactionRestClient.post<TransactionDTO, CreateTransactionDTO>({
        url: '/transactions',
        payload: transaction,
      })

      return response?.data
    } catch (error) {
      throw error
    }
  }

  return { saveTransaction }
})
