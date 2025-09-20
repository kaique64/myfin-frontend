import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, Method, ResponseType } from 'axios'
import type { RestCallParamsType } from './types/RestCallParamsType'

export abstract class AbstractRestClient {
  private GET: Method = 'GET';
  private POST: Method = 'POST';
  private PUT: Method = 'PUT';
  private PATCH: Method = 'PATCH';
  private DELETE: Method = 'DELETE';

  abstract baseUrl: string

  getFullUrl(url: string): string {
    if (this.baseUrl === '' || url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    return (
      this.baseUrl +
      (this.baseUrl.slice(-1) === '/' ? '' : '/') +
      (url.slice(0, 1) === '/' ? url.slice(1) : url)
    )
  }

  get<T>(param: RestCallParamsType<null>): Promise<AxiosResponse<T> | null> {
    const fullUrl = this.getFullUrl(param.url)

    return this.executeRestCall({
      url: fullUrl,
      method: this.GET,
      payload: null,
      contentType: param.contentType,
      responseType: param.responseType,
      params: param.params,
      headers: param.headers,
    })
  }

  post<T, S>(param: RestCallParamsType<S>): Promise<AxiosResponse<T> | null> {
    const fullUrl = this.getFullUrl(param.url)

    return this.executeRestCall({
      url: fullUrl,
      method: this.POST,
      payload: param.payload,
      contentType: param.contentType,
      responseType: param.responseType,
      params: param.params,
    })
  }

  put<T, S>(param: RestCallParamsType<S>): Promise<AxiosResponse<T> | null> {
    const fullUrl = this.getFullUrl(param.url)

    return this.executeRestCall({
      url: fullUrl,
      method: this.PUT,
      payload: param.payload,
      contentType: param.contentType,
      responseType: param.responseType,
      params: param.params,
    })
  }

  patch<T, S>(param: RestCallParamsType<S>): Promise<AxiosResponse<T> | null> {
    const fullUrl = this.getFullUrl(param.url)

    return this.executeRestCall({
      url: fullUrl,
      method: this.PATCH,
      payload: param.payload,
      contentType: param.contentType,
      responseType: param.responseType,
      params: param.params,
    })
  }

  delete<T>(param: RestCallParamsType<null>): Promise<AxiosResponse<T> | null> {
    const fullUrl = this.getFullUrl(param.url)

    return this.executeRestCall({
      url: fullUrl,
      method: this.DELETE,
      contentType: param.contentType,
      responseType: param.responseType,
      params: param.params,
    })
  }

  private async executeRestCall<T, S>(
    param: RestCallParamsType<S>,
  ): Promise<AxiosResponse<T> | null> {
    param.contentType = param.contentType || 'application/json'

    let response: AxiosResponse<T> | null = null

    const requestParam: AxiosRequestConfig = {
      url: param.url,
      method: param.method,
      responseType: param.responseType as ResponseType | undefined,
      params: param.params,
      withCredentials: false,
      data: param.payload,
    }

    try {
      response = await axios.request(requestParam)
    } catch (error: unknown) {
      AbstractRestClient.handleError(error, param.url)
    }

    return response
  }

  private static async handleError(error: unknown, url: string) {
    console.log(JSON.stringify(error))
    console.log(JSON.stringify(url))
  }
}
