import { describe, expect, it, vi, beforeEach, afterEach, MockedFunction } from 'vitest'
import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { AbstractRestClient } from '../../../src/http/clients/AbstractRestClient'
import type { RestCallParamsType } from '../../../src/http/clients/types/RestCallParamsType'

class TestRestClient extends AbstractRestClient {
  baseUrl = 'https://api.example.com'
}

vi.mock('axios', () => ({
  default: {
    request: vi.fn(),
  },
}))

describe('Given AbstractRestClient', () => {
  let testClient: TestRestClient
  let mockAxiosRequest: MockedFunction<typeof axios.request>

  beforeEach(() => {
    testClient = new TestRestClient()
    mockAxiosRequest = vi.mocked(axios.request)
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('When getting full URL', () => {
    it('Then it should return the URL as-is when baseUrl is empty', () => {
      testClient.baseUrl = ''
      const url = 'https://external.api.com/endpoint'

      const result = testClient.getFullUrl(url)

      expect(result).toBe(url)
    })

    it('Then it should return the URL as-is when URL starts with http://', () => {
      const url = 'http://external.api.com/endpoint'

      const result = testClient.getFullUrl(url)

      expect(result).toBe(url)
    })

    it('Then it should return the URL as-is when URL starts with https://', () => {
      const url = 'https://external.api.com/endpoint'

      const result = testClient.getFullUrl(url)

      expect(result).toBe(url)
    })

    it('Then it should combine baseUrl and relative URL with slash', () => {
      testClient.baseUrl = 'https://api.example.com'
      const url = 'users'

      const result = testClient.getFullUrl(url)

      expect(result).toBe('https://api.example.com/users')
    })

    it('Then it should combine baseUrl ending with slash and relative URL', () => {
      testClient.baseUrl = 'https://api.example.com/'
      const url = 'users'

      const result = testClient.getFullUrl(url)

      expect(result).toBe('https://api.example.com/users')
    })

    it('Then it should handle URL starting with slash', () => {
      testClient.baseUrl = 'https://api.example.com'
      const url = '/users'

      const result = testClient.getFullUrl(url)

      expect(result).toBe('https://api.example.com/users')
    })

    it('Then it should handle both baseUrl ending with slash and URL starting with slash', () => {
      testClient.baseUrl = 'https://api.example.com/'
      const url = '/users'

      const result = testClient.getFullUrl(url)

      expect(result).toBe('https://api.example.com/users')
    })
  })

  describe('When making GET requests', () => {
    it('Then it should execute GET request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<null> = {
        url: 'users/1',
        params: { include: 'profile' },
        headers: { Authorization: 'Bearer token' },
        contentType: 'application/json',
        responseType: 'json',
      }

      const result = await testClient.get(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/users/1',
        method: 'GET',
        responseType: 'json',
        params: { include: 'profile' },
        withCredentials: false,
        data: null,
      })

      expect(result).toEqual(mockResponse)
    })

    it('Then it should handle GET request errors gracefully', async () => {
      const error = new Error('Network Error')
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<null> = {
        url: 'users/1',
      }

      const result = await testClient.get(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(error))
      expect(console.log).toHaveBeenCalledWith(JSON.stringify('https://api.example.com/users/1'))
    })
  })

  describe('When making POST requests', () => {
    it('Then it should execute POST request with payload', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 2, name: 'Created User' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const payload = { name: 'New User', email: 'user@example.com' }
      const params: RestCallParamsType<typeof payload> = {
        url: 'users',
        payload,
        contentType: 'application/json',
        params: { validateEmail: true },
      }

      const result = await testClient.post(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/users',
        method: 'POST',
        responseType: undefined,
        params: { validateEmail: true },
        withCredentials: false,
        data: payload,
      })

      expect(result).toEqual(mockResponse)
    })

    it('Then it should handle POST request errors gracefully', async () => {
      const error = { response: { status: 400, data: { message: 'Bad Request' } } }
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<{ name: string }> = {
        url: 'users',
        payload: { name: 'Invalid User' },
      }

      const result = await testClient.post(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(error))
    })
  })

  describe('When making PUT requests', () => {
    it('Then it should execute PUT request with payload', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'Updated User' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const payload = { name: 'Updated User', email: 'updated@example.com' }
      const params: RestCallParamsType<typeof payload> = {
        url: 'users/1',
        payload,
        contentType: 'application/json',
        responseType: 'json',
      }

      const result = await testClient.put(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/users/1',
        method: 'PUT',
        responseType: 'json',
        params: undefined,
        withCredentials: false,
        data: payload,
      })

      expect(result).toEqual(mockResponse)
    })

    it('Then it should handle PUT request errors gracefully', async () => {
      const error = new Error('Server Error')
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<{ name: string }> = {
        url: 'users/1',
        payload: { name: 'Updated User' },
      }

      const result = await testClient.put(params)

      expect(result).toBeNull()
    })
  })

  describe('When making PATCH requests', () => {
    it('Then it should execute PATCH request with payload', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'Patched User' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const payload = { name: 'Patched User' }
      const params: RestCallParamsType<typeof payload> = {
        url: 'users/1',
        payload,
        contentType: 'application/json',
        responseType: 'json',
      }

      const result = await testClient.patch(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/users/1',
        method: 'PATCH',
        responseType: 'json',
        params: undefined,
        withCredentials: false,
        data: payload,
      })

      expect(result).toEqual(mockResponse)
    })

    it('Then it should handle PATCH request errors gracefully', async () => {
      const error = { message: 'Network timeout' }
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<{ email: string }> = {
        url: 'users/1',
        payload: { email: 'new@example.com' },
      }

      const result = await testClient.patch(params)

      expect(result).toBeNull()
    })
  })

  describe('When making DELETE requests', () => {
    it('Then it should execute DELETE request without payload', async () => {
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
        url: 'users/1',
        contentType: 'application/json',
        params: { force: true },
      }

      const result = await testClient.delete(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/users/1',
        method: 'DELETE',
        responseType: undefined,
        params: { force: true },
        withCredentials: false,
        data: undefined,
      })

      expect(result).toEqual(mockResponse)
    })

    it('Then it should handle DELETE request errors gracefully', async () => {
      const error = { response: { status: 404, statusText: 'Not Found' } }
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<null> = {
        url: 'users/999',
      }

      const result = await testClient.delete(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(error))
    })
  })

  describe('When setting default content type', () => {
    it('Then it should set default content type to application/json', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<{ name: string }> = {
        url: 'users',
        payload: { name: 'Test User' },
      }

      await testClient.post(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { name: 'Test User' },
        }),
      )
    })

    it('Then it should preserve custom content type when provided', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<string> = {
        url: 'users',
        payload: 'raw text data',
        contentType: 'text/plain',
      }

      await testClient.post(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          data: 'raw text data',
        }),
      )
    })
  })

  describe('When handling request configuration', () => {
    it('Then it should set withCredentials to false', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<null> = {
        url: 'users',
      }

      await testClient.get(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: false,
        }),
      )
    })

    it('Then it should handle all request parameters correctly', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const params: RestCallParamsType<{ data: string }> = {
        url: 'complex-endpoint',
        payload: { data: 'test' },
        contentType: 'application/json',
        responseType: 'blob',
        params: { filter: 'active', sort: 'name' },
        headers: { 'Custom-Header': 'value' },
      }

      await testClient.post(params)

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/complex-endpoint',
        method: 'POST',
        responseType: 'blob',
        params: { filter: 'active', sort: 'name' },
        withCredentials: false,
        data: { data: 'test' },
      })
    })
  })

  describe('When handling different base URL scenarios', () => {
    it('Then it should work with different concrete implementations', () => {
      class CustomRestClient extends AbstractRestClient {
        baseUrl = 'https://custom.api.com/v1'
      }

      const customClient = new CustomRestClient()
      const result = customClient.getFullUrl('endpoint')

      expect(result).toBe('https://custom.api.com/v1/endpoint')
    })

    it('Then it should handle empty base URL correctly', () => {
      class EmptyBaseUrlClient extends AbstractRestClient {
        baseUrl = ''
      }

      const emptyClient = new EmptyBaseUrlClient()
      const result = emptyClient.getFullUrl('https://external.com/api')

      expect(result).toBe('https://external.com/api')
    })
  })

  describe('When testing error handling', () => {
    it('Then it should log error details when request fails', async () => {
      const error = {
        message: 'Request failed',
        response: {
          status: 500,
          data: { error: 'Internal Server Error' },
        },
      }

      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<null> = {
        url: 'failing-endpoint',
      }

      const result = await testClient.get(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenNthCalledWith(1, JSON.stringify(error))
      expect(console.log).toHaveBeenNthCalledWith(
        2,
        JSON.stringify('https://api.example.com/failing-endpoint'),
      )
    })

    it('Then it should handle unknown error types', async () => {
      const error = 'string error'
      mockAxiosRequest.mockRejectedValueOnce(error)

      const params: RestCallParamsType<null> = {
        url: 'error-endpoint',
      }

      const result = await testClient.get(params)

      expect(result).toBeNull()
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(error))
    })
  })

  describe('When testing HTTP methods', () => {
    it('Then it should support all standard HTTP methods', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValue(mockResponse)

      await testClient.get({ url: 'test' })
      expect(mockAxiosRequest).toHaveBeenLastCalledWith(expect.objectContaining({ method: 'GET' }))

      await testClient.post({ url: 'test', payload: {} })
      expect(mockAxiosRequest).toHaveBeenLastCalledWith(expect.objectContaining({ method: 'POST' }))

      await testClient.put({ url: 'test', payload: {} })
      expect(mockAxiosRequest).toHaveBeenLastCalledWith(expect.objectContaining({ method: 'PUT' }))

      await testClient.patch({ url: 'test', payload: {} })
      expect(mockAxiosRequest).toHaveBeenLastCalledWith(
        expect.objectContaining({ method: 'PATCH' }),
      )

      await testClient.delete({ url: 'test' })
      expect(mockAxiosRequest).toHaveBeenLastCalledWith(
        expect.objectContaining({ method: 'DELETE' }),
      )

      expect(mockAxiosRequest).toHaveBeenCalledTimes(5)
    })
  })

  describe('When testing type safety', () => {
    it('Then it should work with typed responses and payloads', async () => {
      interface User {
        id: number
        name: string
        email: string
      }

      interface CreateUserPayload {
        name: string
        email: string
      }

      const mockResponse: AxiosResponse<User> = {
        data: { id: 1, name: 'Test User', email: 'test@example.com' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        request: {},
      }

      mockAxiosRequest.mockResolvedValueOnce(mockResponse)

      const payload: CreateUserPayload = {
        name: 'Test User',
        email: 'test@example.com',
      }

      const params: RestCallParamsType<CreateUserPayload> = {
        url: 'users',
        payload,
      }

      const result = await testClient.post<User, CreateUserPayload>(params)

      expect(result).toEqual(mockResponse)
      expect(result?.data.id).toBe(1)
      expect(result?.data.name).toBe('Test User')
      expect(result?.data.email).toBe('test@example.com')
    })
  })
})
