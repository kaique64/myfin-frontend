export interface TransactionDTO {
  id: string
  amount: number
  title: string
  currency: string
  type: string
  category: string
  paymentMethod: string
  description?: string
  date: string
  timestamp: number
  createdAt: string
  updatedAt: string
}

export type CreateTransactionDTO = Omit<
  TransactionDTO,
  'id' | 'createdAt' | 'updatedAt' | 'timestamp'
>

export type TransactionType = 'income' | 'expense' | 'neutral'
