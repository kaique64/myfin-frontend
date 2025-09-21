import { describe, expect, it } from 'vitest'
import {
  registerTransactionSchema,
  initialValues,
  type TransactionForm,
} from '../../../src/schemas/transaction/registerTransactionSchema'
import { texts } from '../../../src/shared/texts'

describe('Given registerTransactionSchema', () => {
  describe('When validating valid transaction data', () => {
    it('Then it should accept valid income transaction', () => {
      const validIncomeData = {
        title: 'Salário',
        amount: 5000,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: 'Salário mensal',
      }

      const result = registerTransactionSchema.safeParse(validIncomeData)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data).toEqual(validIncomeData)
      }
    })

    it('Then it should accept valid expense transaction', () => {
      const validExpenseData = {
        title: 'Supermercado',
        amount: 150.5,
        type: 'expense' as const,
        category: 'food',
        paymentMethod: 'debit',
        date: '2024-01-15',
        description: 'Compras da semana',
      }

      const result = registerTransactionSchema.safeParse(validExpenseData)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data).toEqual(validExpenseData)
      }
    })

    it('Then it should accept transaction without description', () => {
      const validDataWithoutDescription = {
        title: 'Conta de luz',
        amount: 120,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'cash',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(validDataWithoutDescription)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.description).toBeUndefined()
      }
    })

    it('Then it should accept transaction with empty description', () => {
      const validDataWithEmptyDescription = {
        title: 'Medicamento',
        amount: 25.99,
        type: 'expense' as const,
        category: 'health',
        paymentMethod: 'credit',
        date: '2024-01-15',
        description: '',
      }

      const result = registerTransactionSchema.safeParse(validDataWithEmptyDescription)
      expect(result.success).toBe(true)
    })
  })

  describe('When validating title field', () => {
    it('Then it should reject empty title', () => {
      const dataWithEmptyTitle = {
        title: '',
        amount: 100,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithEmptyTitle)
      expect(result.success).toBe(false)

      if (!result.success) {
        const titleError = result.error.issues.find((issue) => issue.path[0] === 'title')
        expect(titleError?.message).toBe(texts.transaction.register.validation.titleRequired)
      }
    })

    it('Then it should reject missing title', () => {
      const dataWithoutTitle = {
        amount: 100,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithoutTitle)
      expect(result.success).toBe(false)

      if (!result.success) {
        const titleError = result.error.issues.find((issue) => issue.path[0] === 'title')
        expect(titleError).toBeDefined()
      }
    })

    it('Then it should accept valid title', () => {
      const dataWithValidTitle = {
        title: 'Valid Transaction Title',
        amount: 100,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithValidTitle)
      expect(result.success).toBe(true)
    })
  })

  describe('When validating amount field', () => {
    it('Then it should reject zero amount', () => {
      const dataWithZeroAmount = {
        title: 'Test Transaction',
        amount: 0,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithZeroAmount)
      expect(result.success).toBe(false)

      if (!result.success) {
        const amountError = result.error.issues.find((issue) => issue.path[0] === 'amount')
        expect(amountError?.message).toBe(
          texts.transaction.register.validation.amountGreaterThanZero,
        )
      }
    })

    it('Then it should reject negative amount', () => {
      const dataWithNegativeAmount = {
        title: 'Test Transaction',
        amount: -50,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithNegativeAmount)
      expect(result.success).toBe(false)

      if (!result.success) {
        const amountError = result.error.issues.find((issue) => issue.path[0] === 'amount')
        expect(amountError?.message).toBe(
          texts.transaction.register.validation.amountGreaterThanZero,
        )
      }
    })

    it('Then it should reject missing amount', () => {
      const dataWithoutAmount = {
        title: 'Test Transaction',
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithoutAmount)
      expect(result.success).toBe(false)

      if (!result.success) {
        const amountError = result.error.issues.find((issue) => issue.path[0] === 'amount')
        expect(amountError?.message).toBe(texts.transaction.register.validation.amountRequired)
      }
    })

    it('Then it should accept valid positive amount', () => {
      const dataWithValidAmount = {
        title: 'Test Transaction',
        amount: 100.5,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithValidAmount)
      expect(result.success).toBe(true)
    })

    it('Then it should accept decimal amounts', () => {
      const dataWithDecimalAmount = {
        title: 'Test Transaction',
        amount: 0.01,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithDecimalAmount)
      expect(result.success).toBe(true)
    })
  })

  describe('When validating type field', () => {
    it('Then it should accept income type', () => {
      const dataWithIncomeType = {
        title: 'Test Transaction',
        amount: 100,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithIncomeType)
      expect(result.success).toBe(true)
    })

    it('Then it should accept expense type', () => {
      const dataWithExpenseType = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithExpenseType)
      expect(result.success).toBe(true)
    })

    it('Then it should reject invalid type', () => {
      const dataWithInvalidType = {
        title: 'Test Transaction',
        amount: 100,
        type: 'invalid',
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithInvalidType)
      expect(result.success).toBe(false)

      if (!result.success) {
        const typeError = result.error.issues.find((issue) => issue.path[0] === 'type')
        expect(typeError).toBeDefined()
      }
    })

    it('Then it should reject missing type', () => {
      const dataWithoutType = {
        title: 'Test Transaction',
        amount: 100,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithoutType)
      expect(result.success).toBe(false)

      if (!result.success) {
        const typeError = result.error.issues.find((issue) => issue.path[0] === 'type')
        expect(typeError?.message).toBe(texts.transaction.register.validation.typeRequired)
      }
    })
  })

  describe('When validating category field', () => {
    const validCategories = ['food', 'transport', 'entertainment', 'health', 'other']

    validCategories.forEach((category) => {
      it(`Then it should accept ${category} category`, () => {
        const dataWithCategory = {
          title: 'Test Transaction',
          amount: 100,
          type: 'expense' as const,
          category,
          paymentMethod: 'pix',
          date: '2024-01-15',
        }

        const result = registerTransactionSchema.safeParse(dataWithCategory)
        expect(result.success).toBe(true)
      })
    })

    it('Then it should reject empty category', () => {
      const dataWithEmptyCategory = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: '',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithEmptyCategory)
      expect(result.success).toBe(false)

      if (!result.success) {
        const categoryError = result.error.issues.find((issue) => issue.path[0] === 'category')
        expect(categoryError?.message).toBe(texts.transaction.register.validation.categoryRequired)
      }
    })

    it('Then it should reject missing category', () => {
      const dataWithoutCategory = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithoutCategory)
      expect(result.success).toBe(false)

      if (!result.success) {
        const categoryError = result.error.issues.find((issue) => issue.path[0] === 'category')
        expect(categoryError).toBeDefined()
      }
    })
  })

  describe('When validating paymentMethod field', () => {
    const validPaymentMethods = ['cash', 'credit', 'debit', 'pix']

    validPaymentMethods.forEach((paymentMethod) => {
      it(`Then it should accept ${paymentMethod} payment method`, () => {
        const dataWithPaymentMethod = {
          title: 'Test Transaction',
          amount: 100,
          type: 'expense' as const,
          category: 'other',
          paymentMethod,
          date: '2024-01-15',
        }

        const result = registerTransactionSchema.safeParse(dataWithPaymentMethod)
        expect(result.success).toBe(true)
      })
    })

    it('Then it should reject empty payment method', () => {
      const dataWithEmptyPaymentMethod = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: '',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithEmptyPaymentMethod)
      expect(result.success).toBe(false)

      if (!result.success) {
        const paymentMethodError = result.error.issues.find(
          (issue) => issue.path[0] === 'paymentMethod',
        )
        expect(paymentMethodError?.message).toBe(
          texts.transaction.register.validation.paymentMethodRequired,
        )
      }
    })

    it('Then it should reject missing payment method', () => {
      const dataWithoutPaymentMethod = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithoutPaymentMethod)
      expect(result.success).toBe(false)

      if (!result.success) {
        const paymentMethodError = result.error.issues.find(
          (issue) => issue.path[0] === 'paymentMethod',
        )
        expect(paymentMethodError).toBeDefined()
      }
    })
  })

  describe('When validating date field', () => {
    it('Then it should accept valid date string', () => {
      const dataWithValidDate = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithValidDate)
      expect(result.success).toBe(true)
    })

    it('Then it should accept different date formats', () => {
      const dataWithDifferentDate = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '15/01/2024',
      }

      const result = registerTransactionSchema.safeParse(dataWithDifferentDate)
      expect(result.success).toBe(true)
    })

    it('Then it should reject empty date', () => {
      const dataWithEmptyDate = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '',
      }

      const result = registerTransactionSchema.safeParse(dataWithEmptyDate)
      expect(result.success).toBe(false)

      if (!result.success) {
        const dateError = result.error.issues.find((issue) => issue.path[0] === 'date')
        expect(dateError?.message).toBe(texts.transaction.register.validation.dateRequired)
      }
    })

    it('Then it should reject missing date', () => {
      const dataWithoutDate = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
      }

      const result = registerTransactionSchema.safeParse(dataWithoutDate)
      expect(result.success).toBe(false)

      if (!result.success) {
        const dateError = result.error.issues.find((issue) => issue.path[0] === 'date')
        expect(dateError).toBeDefined()
      }
    })
  })

  describe('When validating description field', () => {
    it('Then it should accept valid description', () => {
      const dataWithDescription = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: 'Test description',
      }

      const result = registerTransactionSchema.safeParse(dataWithDescription)
      expect(result.success).toBe(true)
    })

    it('Then it should accept empty description', () => {
      const dataWithEmptyDescription = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: '',
      }

      const result = registerTransactionSchema.safeParse(dataWithEmptyDescription)
      expect(result.success).toBe(true)
    })

    it('Then it should accept missing description', () => {
      const dataWithoutDescription = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
      }

      const result = registerTransactionSchema.safeParse(dataWithoutDescription)
      expect(result.success).toBe(true)
    })

    it('Then it should accept long description', () => {
      const longDescription = 'A'.repeat(1000)
      const dataWithLongDescription = {
        title: 'Test Transaction',
        amount: 100,
        type: 'expense' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: longDescription,
      }

      const result = registerTransactionSchema.safeParse(dataWithLongDescription)
      expect(result.success).toBe(true)
    })
  })

  describe('When validating multiple field errors', () => {
    it('Then it should return all validation errors', () => {
      const invalidData = {
        title: '',
        amount: 0,
        type: 'invalid',
        category: '',
        paymentMethod: '',
        date: '',
        description: 'This is valid',
      }

      const result = registerTransactionSchema.safeParse(invalidData)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues).toHaveLength(6) // All required fields should have errors

        const errorPaths = result.error.issues.map((issue) => issue.path[0])
        expect(errorPaths).toContain('title')
        expect(errorPaths).toContain('amount')
        expect(errorPaths).toContain('type')
        expect(errorPaths).toContain('category')
        expect(errorPaths).toContain('paymentMethod')
        expect(errorPaths).toContain('date')
      }
    })
  })
})

describe('Given initialValues', () => {
  describe('When checking default values', () => {
    it('Then it should have correct structure', () => {
      expect(initialValues).toEqual({
        title: '',
        amount: undefined,
        type: 'income',
        category: 'food',
        paymentMethod: 'cash',
        date: '',
        description: '',
      })
    })

    it('Then it should have title as empty string', () => {
      expect(initialValues.title).toBe('')
    })

    it('Then it should have amount as undefined', () => {
      expect(initialValues.amount).toBeUndefined()
    })

    it('Then it should have income as default type', () => {
      expect(initialValues.type).toBe('income')
    })

    it('Then it should have food as default category', () => {
      expect(initialValues.category).toBe('food')
    })

    it('Then it should have cash as default payment method', () => {
      expect(initialValues.paymentMethod).toBe('cash')
    })

    it('Then it should have empty date', () => {
      expect(initialValues.date).toBe('')
    })

    it('Then it should have empty description', () => {
      expect(initialValues.description).toBe('')
    })
  })

  describe('When using with schema validation', () => {
    it('Then it should fail validation due to missing required fields', () => {
      const result = registerTransactionSchema.safeParse(initialValues)
      expect(result.success).toBe(false)

      if (!result.success) {
        const errorPaths = result.error.issues.map((issue) => issue.path[0])
        expect(errorPaths).toContain('title')
        expect(errorPaths).toContain('amount')
        expect(errorPaths).toContain('date')
      }
    })
  })
})

describe('Given TransactionForm type', () => {
  describe('When checking type compatibility', () => {
    it('Then it should match valid transaction data structure', () => {
      const validTransaction: TransactionForm = {
        title: 'Test Transaction',
        amount: 100,
        type: 'income',
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: 'Test description',
      }

      expect(validTransaction.title).toBe('Test Transaction')
      expect(validTransaction.amount).toBe(100)
      expect(validTransaction.type).toBe('income')
      expect(validTransaction.category).toBe('other')
      expect(validTransaction.paymentMethod).toBe('pix')
      expect(validTransaction.date).toBe('2024-01-15')
      expect(validTransaction.description).toBe('Test description')
    })

    it('Then it should work with schema validation result', () => {
      const validData = {
        title: 'Test Transaction',
        amount: 100,
        type: 'income' as const,
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: 'Test description',
      }

      const result = registerTransactionSchema.safeParse(validData)
      expect(result.success).toBe(true)

      if (result.success) {
        const transaction: TransactionForm = result.data
        expect(transaction).toEqual(validData)
      }
    })
  })
})
