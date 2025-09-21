import { describe, expect, it, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionStore } from '../../../src/stores/transaction'

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockDelete = vi.fn()

vi.mock('../../../src/http/clients/transaction/TransactionRestClient', () => {
  return {
    TransactionRestClient: vi.fn().mockImplementation(() => {
      return {
        get: mockGet,
        post: mockPost,
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
      const newTransaction = {
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
      const newTransaction = {
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
})
