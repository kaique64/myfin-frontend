import { describe, expect, it, vi, beforeEach, afterEach, MockedFunction } from 'vitest'
import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { TransactionRestClient } from '../../../../src/http/clients/transaction/TransactionRestClient'
import type { RestCallParamsType } from '../../../../src/http/clients/types/RestCallParamsType'

vi.mock('axios', () => ({
  default: {
    request: vi.fn(),
  },
}))

describe('Given TransactionRestClient', () => {
  let transactionClient: TransactionRestClient
  let mockAxiosRequest: MockedFunction<typeof axios.request>

  beforeEach(() => {
    transactionClient = new TransactionRestClient()
    mockAxiosRequest = vi.mocked(axios.request)
    vi.clearAllMocks()

    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('When initializing the client', () => {
    it('Then it should set baseUrl from environment variable', () => {
      expect(transactionClient.baseUrl).toBeDefined()
      expect(typeof transactionClient.baseUrl).toBe('string')
    })

    it('Then it should inherit from AbstractRestClient', () => {
      expect(transactionClient).toBeInstanceOf(TransactionRestClient)
      expect(transactionClient.get).toBeDefined()
      expect(transactionClient.post).toBeDefined()
      expect(transactionClient.put).toBeDefined()
      expect(transactionClient.patch).toBeDefined()
      expect(transactionClient.delete).toBeDefined()
      expect(transactionClient.getFullUrl).toBeDefined()
    })
  })

  describe('When building URLs', () => {
    it('Then it should combine baseUrl with relative paths correctly', () => {
      const result = transactionClient.getFullUrl('transactions')
      expect(result).toBe(`${transactionClient.baseUrl}/transactions`)
    })

    it('Then it should handle paths starting with slash', () => {
      const result = transactionClient.getFullUrl('/transactions/123')
      expect(result).toBe(`${transactionClient.baseUrl}/transactions/123`)
    })

    it('Then it should handle complex paths', () => {
      const result = transactionClient.getFullUrl('transactions/123/details')
      expect(result).toBe(`${transactionClient.baseUrl}/transactions/123/details`)
    })

    it('Then it should return absolute URLs as-is', () => {
      const externalUrl = 'https://external-api.com/endpoint'
      const result = transactionClient.getFullUrl(externalUrl)
      expect(result).toBe(externalUrl)
    })
  })

  describe('When making GET requests for transactions', () => {
    it('Then it should fetch all transactions', async () => {
      const mockTransactions = [
        { id: 1, title: 'Salary', amount: 5000, type: 'income' },
        { id: 2, title: 'Groceries', amount: 150, type: 'expense' },
      ]

      const mockResponse: AxiosResponse = {
        data: mockTransactions,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<null> = {
        url: 'transactions',
        params: { limit: 10, offset: 0 },
      }

      const result = await transactionClient.get(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: `${transactionClient.baseUrl}/transactions`,
        method: 'GET',
        responseType: undefined,
        params: { limit: 10, offset: 0 },
        withCredentials: false,
        data: null,
      })

      expect(result).toEqual(mockResponse)
      expect(result?.data).toEqual(mockTransactions)
    })

    it('Then it should fetch a specific transaction by ID', async () => {
      const mockTransaction = {
        id: 1,
        title: 'Salary',
        amount: 5000,
        type: 'income',
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: 'Monthly salary',
      }

      const mockResponse: AxiosResponse = {
        data: mockTransaction,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<null> = {
        url: 'transactions/1',
      }

      const result = await transactionClient.get(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: `${transactionClient.baseUrl}/transactions/1`,
        method: 'GET',
        responseType: undefined,
        params: undefined,
        withCredentials: false,
        data: null,
      })

      expect(result?.data).toEqual(mockTransaction)
    })

    it('Then it should handle GET request errors gracefully', async () => {
      const error = { response: { status: 404, data: { message: 'Transaction not found' } } }
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<null> = {
        url: 'transactions/999',
      }

      const result = await transactionClient.get(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(error))
    })
  })

  describe('When making POST requests to create transactions', () => {
    it('Then it should create a new transaction', async () => {
      const newTransaction = {
        title: 'Coffee',
        amount: 5.5,
        type: 'expense' as const,
        category: 'food',
        paymentMethod: 'credit',
        date: '2024-01-15',
        description: 'Morning coffee',
      }

      const createdTransaction = {
        id: 3,
        ...newTransaction,
        createdAt: '2024-01-15T10:00:00Z',
      }

      const mockResponse: AxiosResponse = {
        data: createdTransaction,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<typeof newTransaction> = {
        url: 'transactions',
        payload: newTransaction,
        contentType: 'application/json',
      }

      const result = await transactionClient.post(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: `${transactionClient.baseUrl}/transactions`,
        method: 'POST',
        responseType: undefined,
        params: undefined,
        withCredentials: false,
        data: newTransaction,
      })

      expect(result?.data).toEqual(createdTransaction)
      expect(result?.status).toBe(201)
    })

    it('Then it should handle validation errors when creating transactions', async () => {
      const invalidTransaction = {
        title: '',
        amount: -10,
        type: 'invalid' as 'income' | 'expense',
      }

      const error = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: {
              title: 'Title is required',
              amount: 'Amount must be greater than zero',
              type: 'Invalid transaction type',
            },
          },
        },
      }

      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<typeof invalidTransaction> = {
        url: 'transactions',
        payload: invalidTransaction,
      }

      const result = await transactionClient.post(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(error))
    })
  })

  describe('When making PUT requests to update transactions', () => {
    it('Then it should update an existing transaction', async () => {
      const updatedTransaction = {
        title: 'Updated Coffee',
        amount: 6.0,
        type: 'expense' as const,
        category: 'food',
        paymentMethod: 'debit',
        date: '2024-01-15',
        description: 'Updated morning coffee',
      }

      const responseData = { id: 3, ...updatedTransaction, updatedAt: '2024-01-15T11:00:00Z' }

      const mockResponse: AxiosResponse = {
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<typeof updatedTransaction> = {
        url: 'transactions/3',
        payload: updatedTransaction,
      }

      const result = await transactionClient.put(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: `${transactionClient.baseUrl}/transactions/3`,
        method: 'PUT',
        responseType: undefined,
        params: undefined,
        withCredentials: false,
        data: updatedTransaction,
      })

      expect(result?.data).toEqual(responseData)
      expect(result?.status).toBe(200)
    })

    it('Then it should handle PUT request errors gracefully', async () => {
      const error = { response: { status: 404, statusText: 'Not Found' } }
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<{ title: string }> = {
        url: 'transactions/999',
        payload: { title: 'Non-existent transaction' },
      }

      const result = await transactionClient.put(params)

      expect(result).toBeNull()
    })
  })

  describe('When making PATCH requests to partially update transactions', () => {
    it('Then it should partially update a transaction', async () => {
      const partialUpdate = { amount: 7.5 }

      const responseData = {
        id: 3,
        title: 'Coffee',
        amount: 7.5,
        type: 'expense',
        category: 'food',
        paymentMethod: 'credit',
        date: '2024-01-15',
        description: 'Morning coffee',
        updatedAt: '2024-01-15T12:00:00Z',
      }

      const mockResponse: AxiosResponse = {
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<typeof partialUpdate> = {
        url: 'transactions/3',
        payload: partialUpdate,
      }

      const result = await transactionClient.patch(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: `${transactionClient.baseUrl}/transactions/3`,
        method: 'PATCH',
        responseType: undefined,
        params: undefined,
        withCredentials: false,
        data: partialUpdate,
      })

      expect(result?.data).toEqual(responseData)
    })
  })

  describe('When making DELETE requests to remove transactions', () => {
    it('Then it should delete a transaction', async () => {
      const mockResponse: AxiosResponse = {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<null> = {
        url: 'transactions/3',
      }

      const result = await transactionClient.delete(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: `${transactionClient.baseUrl}/transactions/3`,
        method: 'DELETE',
        responseType: undefined,
        params: undefined,
        withCredentials: false,
        data: undefined,
      })

      expect(result?.status).toBe(204)
    })

    it('Then it should handle DELETE request errors gracefully', async () => {
      const error = { response: { status: 404, statusText: 'Not Found' } }
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<null> = {
        url: 'transactions/999',
      }

      const result = await transactionClient.delete(params)

      expect(result).toBeNull()
    })
  })

  describe('When testing type safety', () => {
    it('Then it should work with typed transaction interfaces', async () => {
      interface Transaction {
        id: number
        title: string
        amount: number
        type: 'income' | 'expense'
        category: string
        paymentMethod: string
        date: string
        description?: string
      }

      interface CreateTransactionPayload {
        title: string
        amount: number
        type: 'income' | 'expense'
        category: string
        paymentMethod: string
        date: string
        description?: string
      }

      const mockTransaction: Transaction = {
        id: 1,
        title: 'Test Transaction',
        amount: 100,
        type: 'income',
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: 'Test description',
      }

      const mockResponse: AxiosResponse<Transaction> = {
        data: mockTransaction,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const payload: CreateTransactionPayload = {
        title: 'Test Transaction',
        amount: 100,
        type: 'income',
        category: 'other',
        paymentMethod: 'pix',
        date: '2024-01-15',
        description: 'Test description',
      }

      const params: RestCallParamsType<CreateTransactionPayload> = {
        url: 'transactions',
        payload,
      }

      const result = await transactionClient.post<Transaction, CreateTransactionPayload>(params)

      expect(result?.data).toEqual(mockTransaction)
      expect(result?.status).toBe(201)
    })
  })

  describe('When testing real-world transaction scenarios', () => {
    it('Then it should handle filtering transactions by date range', async () => {
      const mockTransactions = [
        { id: 1, title: 'January Salary', amount: 5000, type: 'income', date: '2024-01-01' },
        { id: 2, title: 'January Rent', amount: 1200, type: 'expense', date: '2024-01-05' },
      ]

      const mockResponse: AxiosResponse = {
        data: mockTransactions,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<null> = {
        url: 'transactions',
        params: {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          type: 'all',
        },
      }

      const result = await transactionClient.get(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            type: 'all',
          },
        }),
      )

      expect(result?.data).toHaveLength(2)
    })

    it('Then it should handle pagination for large transaction lists', async () => {
      const mockPaginatedResponse = {
        data: [
          { id: 1, title: 'Transaction 1', amount: 100 },
          { id: 2, title: 'Transaction 2', amount: 200 },
        ],
        pagination: {
          page: 1,
          limit: 2,
          total: 100,
          totalPages: 50,
        },
      }

      const mockResponse: AxiosResponse = {
        data: mockPaginatedResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<null> = {
        url: 'transactions',
        params: {
          page: 1,
          limit: 2,
          sortBy: 'date',
          sortOrder: 'desc',
        },
      }

      const result = await transactionClient.get(params)

      expect(result?.data).toEqual(mockPaginatedResponse)
    })

    it('Then it should handle network errors', async () => {
      const networkError = new Error('Network Error')
      mockAxiosRequest.mockRejectedValueOnce(networkError)

      const params: RestCallParamsType<null> = {
        url: 'transactions',
      }

      const result = await transactionClient.get(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(networkError))
    })

    it('Then it should handle server errors', async () => {
      const serverError = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Database connection failed' },
        },
      }
      mockAxiosRequest.mockRejectedValueOnce(serverError)

      const params: RestCallParamsType<{ title: string }> = {
        url: 'transactions',
        payload: { title: 'Test Transaction' },
      }

      const result = await transactionClient.post(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(serverError))
    })
  })
})
