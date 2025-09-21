import { z } from 'zod'
import { texts } from '@/shared/texts'
import type { TransactionType } from '@/shared/types/transaction'

export interface TransactionForm {
  title: string
  amount: number
  type: TransactionType
  category: string
  paymentMethod: string
  date: string
  description?: string
}

export const registerTransactionSchema = z.object({
  title: z.string().min(1, texts.transaction.register.validation.titleRequired),
  amount: z
    .number({
      required_error: texts.transaction.register.validation.amountRequired,
    })
    .gt(0, texts.transaction.register.validation.amountGreaterThanZero),
  type: z.enum(['income', 'expense'], {
    required_error: texts.transaction.register.validation.typeRequired,
  }),
  category: z.string().min(1, texts.transaction.register.validation.categoryRequired),
  paymentMethod: z.string().min(1, texts.transaction.register.validation.paymentMethodRequired),
  date: z.string().min(1, texts.transaction.register.validation.dateRequired),
  description: z.string().optional(),
})

export const initialValues = {
  title: '',
  amount: undefined,
  type: 'income' as 'income' | 'expense',
  category: 'food',
  paymentMethod: 'cash',
  date: '',
  description: '',
}
