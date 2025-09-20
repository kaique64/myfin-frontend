export interface TransactionDTO {
  _id: string
  amount: number
  title: string
  currency: string
  type: string
  category: string
  paymentMethod: string
  description: string
  date: string
  timestamp: number
  createdAt: string
  updatedAt: string
}

export type CreateTransactionDTO = Omit<TransactionDTO, '_id' | 'createdAt' | 'updatedAt' | 'timestamp'>

export type TransactionType = 'income' | 'expense' | 'neutral'
