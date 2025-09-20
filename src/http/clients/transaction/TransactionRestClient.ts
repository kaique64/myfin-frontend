import { AbstractRestClient } from "../AbstractRestClient";

export class TransactionRestClient extends AbstractRestClient {
  baseUrl = import.meta.env.VITE_TRANSACTION_API_BASE_URL
}