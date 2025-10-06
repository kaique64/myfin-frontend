/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HomeView from '../../src/views/HomeView.vue'
import type { TransactionDTO } from '../../src/shared/types/transaction'
import type { TransactionForm } from '../../src/schemas/transaction'

const getAllTransactionsMock = vi.fn().mockResolvedValue([])
const getTransactionDashboardMock = vi.fn().mockResolvedValue({})
const saveTransactionMock = vi.fn().mockResolvedValue({})
const deleteTransactionMock = vi.fn().mockResolvedValue({})

const confirmDialogOpenMock = vi.fn().mockResolvedValue(true)
const registerTransactionModalOpenMock = vi.fn()

vi.mock('../../src/components/dashboard/Dashboard.vue', () => ({
  default: {
    name: 'Dashboard',
    template: '<div class="dashboard-mock"></div>',
  },
}))

vi.mock('../../src/components/transaction/TransactionList.vue', () => ({
  default: {
    name: 'TransactionList',
    template: '<div class="transaction-list-mock"></div>',
    props: ['transactions', 'isLoading'],
  },
}))

vi.mock('../../src/components/shared/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div class="confirm-dialog-mock"></div>',
  },
}))

vi.mock('../../src/components/transaction/RegisterTransactionModal.vue', () => ({
  default: {
    name: 'RegisterTransactionModal',
    template: '<div class="register-transaction-modal-mock"></div>',
  },
}))

vi.mock('../../src/stores/transaction', () => ({
  useTransactionStore: () => ({
    transactions: [],
    isLoading: false,
    getAllTransactions: getAllTransactionsMock,
    getTransactionDashboard: getTransactionDashboardMock,
    saveTransaction: saveTransactionMock,
    deleteTransaction: deleteTransactionMock,
  }),
}))

const addNotificationMock = vi.fn()
vi.mock('../../src/composables/useNotifications', () => ({
  useNotifications: () => ({
    addNotification: addNotificationMock,
  }),
}))

const mockTransactions: TransactionDTO[] = [
  {
    id: '1',
    amount: 100,
    title: 'Test Transaction',
    currency: 'BRL',
    type: 'income',
    category: 'salary',
    paymentMethod: 'pix',
    date: '01/01/2023',
    timestamp: 1672531200000,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
]

const mockTransactionForm: TransactionForm = {
  title: 'New Transaction',
  amount: 150,
  type: 'expense',
  category: 'food',
  paymentMethod: 'credit',
  date: '2023-02-15',
  description: 'Test description',
}

const factory = () => {
  const wrapper = mount(HomeView)

  const vm = wrapper.vm as any
  if (vm.confirmDialog) {
    vm.confirmDialog.open = confirmDialogOpenMock
  }
  if (vm.registerTransactionModal) {
    vm.registerTransactionModal.open = registerTransactionModalOpenMock
  }

  return wrapper
}

describe('Given a HomeView component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('When the component is mounted', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await flushPromises()
    })

    it('Then it should render the Dashboard component', () => {
      expect(wrapper.find('.dashboard-mock').exists()).toBe(true)
    })

    it('Then it should render the TransactionList component', () => {
      expect(wrapper.find('.transaction-list-mock').exists()).toBe(true)
    })

    it('Then it should render the ConfirmDialog component', () => {
      expect(wrapper.find('.confirm-dialog-mock').exists()).toBe(true)
    })

    it('Then it should render the RegisterTransactionModal component', () => {
      expect(wrapper.find('.register-transaction-modal-mock').exists()).toBe(true)
    })

    it('Then it should call getAllTransactions from the store', () => {
      expect(getAllTransactionsMock).toHaveBeenCalled()
    })
  })

  describe('When addTransaction event is emitted from Dashboard', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await flushPromises()

      const dashboard = wrapper.findComponent({ name: 'Dashboard' })
      dashboard.vm.$emit('addTransaction')
      await wrapper.vm.$nextTick()
    })

    it('Then it should open the RegisterTransactionModal', () => {
      expect(registerTransactionModalOpenMock).toHaveBeenCalled()
    })
  })

  describe('When a transaction form is submitted', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await flushPromises()

      const modal = wrapper.findComponent({ name: 'RegisterTransactionModal' })
      modal.vm.$emit('submit', mockTransactionForm)
      await flushPromises()
    })

    it('Then it should call saveTransaction from the store', () => {
      expect(saveTransactionMock).toHaveBeenCalled()
    })

    it('Then it should call getAllTransactions from the store', () => {
      expect(getAllTransactionsMock).toHaveBeenCalled()
    })

    it('Then it should call getTransactionDashboard from the store', () => {
      expect(getTransactionDashboardMock).toHaveBeenCalled()
    })

    it('Then it should show a success notification', () => {
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Transaction saved successfully',
        variant: 'success',
      })
    })
  })

  describe('When saveTransaction fails', () => {
    let wrapper: ReturnType<typeof factory>
    let consoleLogSpy: any

    beforeEach(async () => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      saveTransactionMock.mockRejectedValueOnce(new Error('Failed to save'))

      wrapper = factory()
      await flushPromises()

      const modal = wrapper.findComponent({ name: 'RegisterTransactionModal' })
      modal.vm.$emit('submit', mockTransactionForm)
      await flushPromises()
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('Then it should show an error notification', () => {
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Failed to save transaction',
        variant: 'danger',
      })
    })

    it('Then it should log the error', () => {
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('When delete event is emitted from TransactionList', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await flushPromises()

      const transactionList = wrapper.findComponent({ name: 'TransactionList' })
      transactionList.vm.$emit('delete', mockTransactions[0])
      await flushPromises()
    })

    it('Then it should open the ConfirmDialog', () => {
      expect(confirmDialogOpenMock).toHaveBeenCalled()
    })

    it('Then it should call deleteTransaction from the store', () => {
      expect(deleteTransactionMock).toHaveBeenCalledWith('1')
    })

    it('Then it should call getAllTransactions from the store', () => {
      expect(getAllTransactionsMock).toHaveBeenCalled()
    })

    it('Then it should call getTransactionDashboard from the store', () => {
      expect(getTransactionDashboardMock).toHaveBeenCalled()
    })

    it('Then it should show a success notification', () => {
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Transaction deleted successfully',
        variant: 'success',
      })
    })
  })

  describe('When ConfirmDialog returns false', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      confirmDialogOpenMock.mockResolvedValueOnce(false)

      wrapper = factory()
      await flushPromises()

      const transactionList = wrapper.findComponent({ name: 'TransactionList' })
      transactionList.vm.$emit('delete', mockTransactions[0])
      await flushPromises()
    })

    it('Then it should not call deleteTransaction from the store', () => {
      expect(deleteTransactionMock).not.toHaveBeenCalled()
    })
  })

  describe('When deleteTransaction fails', () => {
    let wrapper: ReturnType<typeof factory>
    let consoleLogSpy: any

    beforeEach(async () => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      deleteTransactionMock.mockRejectedValueOnce(new Error('Failed to delete'))

      wrapper = factory()
      await flushPromises()

      const transactionList = wrapper.findComponent({ name: 'TransactionList' })
      transactionList.vm.$emit('delete', mockTransactions[0])
      await flushPromises()
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('Then it should show an error notification', () => {
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Failed to delete transaction',
        variant: 'danger',
      })
    })

    it('Then it should log the error', () => {
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('Then it should set isDeletingTransaction back to false', () => {
      expect((wrapper.vm as any).isDeletingTransaction).toBe(false)
    })
  })

  describe('When edit event is emitted from TransactionList', () => {
    let wrapper: ReturnType<typeof factory>
    let consoleLogSpy: any

    beforeEach(async () => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      wrapper = factory()
      await flushPromises()

      const transactionList = wrapper.findComponent({ name: 'TransactionList' })
      transactionList.vm.$emit('edit', mockTransactions[0])
      await wrapper.vm.$nextTick()
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('Then it should log the transaction to be edited', () => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Edit transaction:', mockTransactions[0])
    })
  })

  describe('When formatDate is called', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should format the date correctly', () => {
      const result = (wrapper.vm as any).formatDate('2023-01-15')
      expect(result).toBe('15/01/2023')
    })
  })

  describe('When getAllTransactions fails on mount', () => {
    let wrapper: ReturnType<typeof factory>
    let consoleLogSpy: any

    beforeEach(async () => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      getAllTransactionsMock.mockRejectedValueOnce(new Error('Failed to load'))

      wrapper = factory()
      await flushPromises()
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('Then it should show an error notification', () => {
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Failed to load transactions',
        variant: 'danger',
      })
    })

    it('Then it should log the error', () => {
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })
})

