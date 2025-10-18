import { describe, expect, it, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionStore } from '../../../src/stores/transaction'
import { CreateTransactionDTO } from '../../../src/shared/types/transaction'

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

vi.mock('../../../src/http/clients/transaction/TransactionRestClient', () => {
  return {
    TransactionRestClient: vi.fn().mockImplementation(() => {
      return {
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDelete,
      }
    }),
  }
})

describe('Given useTransactionStore', () => {
  let store: ReturnType<typeof useTransactionStore>

  beforeEach(() => {
    vi.clearAllMocks()

    setActivePinia(createPinia())

    store = useTransactionStore()
  })

  describe('When initializing the store', () => {
    it('Then it should have empty transactions array', () => {
      expect(store.transactions).toEqual([])
    })

    it('Then it should have isLoading set to false', () => {
      expect(store.isLoading).toBe(false)
    })

    it('Then it should have transactionDashboard set to null', () => {
      expect(store.transactionDashboard).toBeNull()
    })
  })

  describe('When calling getAllTransactions', () => {
    it('Then it should fetch transactions and update the store', async () => {
      const mockTransactions = [
        {
          id: '1',
          amount: 5000,
          title: 'Salary',
          currency: 'BRL',
          type: 'income',
          category: 'salary',
          paymentMethod: 'transfer',
          description: 'Monthly salary',
          date: '15/01/2024',
          timestamp: 1705334400,
          createdAt: '2024-01-15T12:00:00Z',
          updatedAt: '2024-01-15T12:00:00Z',
        },
        {
          id: '2',
          amount: 150,
          title: 'Groceries',
          currency: 'BRL',
          type: 'expense',
          category: 'food',
          paymentMethod: 'credit',
          description: 'Weekly groceries',
          date: '16/01/2024',
          timestamp: 1705420800,
          createdAt: '2024-01-16T12:00:00Z',
          updatedAt: '2024-01-16T12:00:00Z',
        },
      ]

      const mockResponse = {
        data: {
          data: mockTransactions,
          filters: {
            category: '',
            title: '',
          },
          pagination: {
            count: 2,
            limit: 10,
            skip: 0,
          },
        },
      }

      mockGet.mockResolvedValueOnce(mockResponse)

      await store.getAllTransactions()

      expect(mockGet).toHaveBeenCalledWith({
        url: '/transactions',
      })

      expect(store.transactions).toEqual(mockTransactions)
      expect(store.isLoading).toBe(false)
    })

    it('Then it should handle API errors gracefully', async () => {
      const error = new Error('API Error')
      mockGet.mockRejectedValueOnce(error)

      await expect(store.getAllTransactions()).rejects.toThrow()

      expect(store.isLoading).toBe(false)

      expect(store.transactions).toEqual([])
    })

    it('Then it should set isLoading while fetching', async () => {
      mockGet.mockImplementationOnce(() => {
        expect(store.isLoading).toBe(true)
        return Promise.resolve({ data: { data: [] } })
      })

      await store.getAllTransactions()
      expect(store.isLoading).toBe(false)
    })
  })

  describe('When calling saveTransaction', () => {
    it('Then it should create a transaction and refresh the list', async () => {
      const newTransaction: CreateTransactionDTO = {
        amount: 100,
        title: 'Coffee',
        currency: 'BRL',
        type: 'expense',
        category: 'food',
        paymentMethod: 'cash',
        description: 'Morning coffee',
        date: '17/01/2024',
      }

      const createdTransaction = {
        id: '3',
        ...newTransaction,
        timestamp: 1705507200,
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      }

      mockPost.mockResolvedValueOnce({
        data: createdTransaction,
      })

      mockGet.mockResolvedValueOnce({
        data: {
          data: [createdTransaction],
          filters: { category: '', title: '' },
          pagination: { count: 1, limit: 10, skip: 0 },
        },
      })

      const result = await store.saveTransaction(newTransaction)

      expect(mockPost).toHaveBeenCalledWith({
        url: '/transactions',
        payload: newTransaction,
      })

      expect(mockGet).toHaveBeenCalledWith({
        url: '/transactions',
      })

      expect(result).toEqual(createdTransaction)
    })

    it('Then it should handle API errors when saving', async () => {
      const newTransaction: CreateTransactionDTO = {
        amount: 100,
        title: 'Coffee',
        currency: 'BRL',
        type: 'expense',
        category: 'food',
        paymentMethod: 'cash',
        description: 'Morning coffee',
        date: '17/01/2024',
      }

      const error = new Error('API Error')
      mockPost.mockRejectedValueOnce(error)

      await expect(store.saveTransaction(newTransaction)).rejects.toThrow()
    })
  })

  describe('When calling updateTransaction', () => {
    it('Then it should update a transaction and refresh the list', async () => {
      const transactionId = '1'
      const updatedTransaction = {
        amount: 120,
        title: 'Updated Coffee',
        currency: 'BRL',
        type: 'expense',
        category: 'food',
        paymentMethod: 'cash',
        description: 'Updated morning coffee',
        date: '17/01/2024',
      }

      const responseTransaction = {
        id: transactionId,
        ...updatedTransaction,
        timestamp: 1705507200,
        createdAt: '2024-01-17T10:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      }

      mockPut.mockResolvedValueOnce({
        data: responseTransaction,
      })

      mockGet.mockResolvedValueOnce({
        data: {
          data: [responseTransaction],
          filters: { category: '', title: '' },
          pagination: { count: 1, limit: 10, skip: 0 },
        },
      })

      const result = await store.updateTransaction(transactionId, updatedTransaction)

      expect(mockPut).toHaveBeenCalledWith({
        url: `/transactions/${transactionId}`,
        payload: updatedTransaction,
      })

      expect(mockGet).toHaveBeenCalledWith({
        url: '/transactions',
      })

      expect(result).toEqual(responseTransaction)
    })

    it('Then it should handle API errors when updating', async () => {
      const transactionId = '1'
      const updatedTransaction = {
        amount: 120,
        title: 'Updated Coffee',
        currency: 'BRL',
        type: 'expense',
        category: 'food',
        paymentMethod: 'cash',
        description: 'Updated morning coffee',
        date: '17/01/2024',
      }

      const error = new Error('API Error')
      mockPut.mockRejectedValueOnce(error)

      await expect(store.updateTransaction(transactionId, updatedTransaction)).rejects.toThrow()
    })
  })

  describe('When calling deleteTransaction', () => {
    it('Then it should delete a transaction and refresh the list', async () => {
      mockDelete.mockResolvedValueOnce({
        status: 204,
      })

      mockGet.mockResolvedValueOnce({
        data: {
          data: [],
          filters: { category: '', title: '' },
          pagination: { count: 0, limit: 10, skip: 0 },
        },
      })

      await store.deleteTransaction('1')

      expect(mockDelete).toHaveBeenCalledWith({
        url: '/transactions/1',
      })

      expect(mockGet).toHaveBeenCalledWith({
        url: '/transactions',
      })
    })

    it('Then it should handle API errors when deleting', async () => {
      const error = new Error('API Error')
      mockDelete.mockRejectedValueOnce(error)

      await expect(store.deleteTransaction('1')).rejects.toThrow()
    })
  })

  describe('When calling getTransactionDashboard', () => {
    it('Then it should fetch dashboard data and update the store', async () => {
      const mockDashboardData = {
        incomeAmount: 5000,
        expenseAmount: 1500,
        totalAmount: 3500,
      }

      const mockTransactionsData = {
        data: [{ id: 1, type: 'income', amount: 500 }],
      }

      const expected = {
        ...mockTransactionsData,
        ...mockDashboardData,
      }

      mockGet.mockResolvedValueOnce({
        data: mockDashboardData,
      })
      mockGet.mockResolvedValueOnce({ data: mockTransactionsData })

      await store.getTransactionDashboard()

      expect(mockGet).toHaveBeenCalledWith({
        url: '/transactions/dashboard',
      })

      expect(mockGet).toHaveBeenCalledWith({
        url: '/transactions?skip=0&limit=0',
      })

      expect(store.transactionDashboard).toEqual({
        ...mockDashboardData,
        transactions: mockTransactionsData.data,
      })
      expect(store.isLoading).toBe(false)
    })

    it('Then it should handle API errors gracefully', async () => {
      const error = new Error('API Error')
      mockGet.mockRejectedValueOnce(error)

      await expect(store.getTransactionDashboard()).rejects.toThrow()

      expect(store.isLoading).toBe(false)
      expect(store.transactionDashboard).toBeNull()
    })

    it('Then it should set isLoading while fetching', async () => {
      mockGet.mockImplementationOnce(() => {
        expect(store.isLoading).toBe(true)
        return Promise.resolve({ data: { incomeAmount: 0, expenseAmount: 0, totalAmount: 0 } })
      })

      await store.getTransactionDashboard()
      expect(store.isLoading).toBe(false)
    })

    it('Then it should handle empty response data', async () => {
      const mockResponse = {
        data: null,
      }

      mockGet.mockResolvedValueOnce(mockResponse)

      await store.getTransactionDashboard()

      expect(mockGet).toHaveBeenCalledWith({
        url: '/transactions/dashboard',
      })

      expect(store.transactionDashboard).toBeNull()
      expect(store.isLoading).toBe(false)
    })
  })
})
