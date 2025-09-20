import type { Method } from "axios"

export interface RestCallParamsType<S> {
  url: string
  method?: Method
  payload?: S
  contentType?: string
  responseType?: null | string
  params?: object
  headers?: object
}
