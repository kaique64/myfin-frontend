/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TransactionList from '../../../src/components/transaction/TransactionList.vue'
import TransactionItem from '../../../src/components/transaction/TransactionItem.vue'
import type { TransactionDTO } from '../../../src/shared/types/transaction'

vi.mock('../../../src/components/transaction/TransactionItem.vue', () => ({
  default: {
    name: 'TransactionItem',
    props: ['title', 'subtitle', 'amount', 'type', 'currency'],
    template: '<div data-testid="transaction-item"></div>',
  },
}))

interface TransactionListProps {
  transactions: TransactionDTO[]
  isLoading: boolean
}

const mockTransactions: TransactionDTO[] = [
  {
    id: '1',
    title: 'Salary',
    amount: 500000,
    currency: 'BRL',
    type: 'income',
    category: 'Salary',
    paymentMethod: 'transfer',
    description: 'Monthly salary',
    date: '01/01/2025',
    timestamp: 1735689600,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Groceries',
    amount: 15000,
    currency: 'BRL',
    type: 'expense',
    category: 'Food',
    paymentMethod: 'credit',
    description: 'Weekly groceries',
    date: '02/01/2025',
    timestamp: 1735776000,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
]

const factory = (props: Partial<TransactionListProps> = {}) => {
  const defaultProps: TransactionListProps = {
    transactions: [],
    isLoading: false,
  }

  return mount(TransactionList, {
    props: { ...defaultProps, ...props },
    global: {
      stubs: {
        TransactionItem: true,
      },
    },
  })
}

describe('Given a TransactionList component', () => {
  describe('When rendered with loading state', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ isLoading: true })
    })

    it('Then it should display loading message', () => {
      expect(wrapper.text()).toContain('Loading transactions...')
    })

    it('Then it should not display empty state message', () => {
      expect(wrapper.text()).not.toContain('No transactions found')
    })

    it('Then it should not render transaction items', () => {
      expect(wrapper.findAllComponents(TransactionItem)).toHaveLength(0)
    })
  })

  describe('When rendered with empty transactions', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ transactions: [], isLoading: false })
    })

    it('Then it should display empty state message', () => {
      expect(wrapper.text()).toContain('No transactions found')
    })

    it('Then it should not display loading message', () => {
      expect(wrapper.text()).not.toContain('Loading transactions...')
    })

    it('Then it should not render transaction items', () => {
      expect(wrapper.findAllComponents(TransactionItem)).toHaveLength(0)
    })
  })

  describe('When rendered with transactions', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ transactions: mockTransactions, isLoading: false })
    })

    it('Then it should render the correct number of transaction items', () => {
      expect(wrapper.findAllComponents(TransactionItem)).toHaveLength(mockTransactions.length)
    })

    it('Then it should not display loading message', () => {
      expect(wrapper.text()).not.toContain('Loading transactions...')
    })

    it('Then it should not display empty state message', () => {
      expect(wrapper.text()).not.toContain('No transactions found')
    })

    it('Then it should display the title', () => {
      expect(wrapper.text()).toContain('Transactions')
    })
  })

  describe('When transaction item emits edit event', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ transactions: mockTransactions })

      const transactionItems = wrapper.findAllComponents(TransactionItem)
      transactionItems[0].vm.$emit('edit', mockTransactions[0])
    })

    it('Then it should forward the edit event with the transaction', () => {
      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')![0][0]).toEqual(mockTransactions[0])
    })
  })

  describe('When transaction item emits delete event', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ transactions: mockTransactions })

      const transactionItems = wrapper.findAllComponents(TransactionItem)
      transactionItems[0].vm.$emit('delete', mockTransactions[0])
    })

    it('Then it should forward the delete event with the transaction', () => {
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')![0][0]).toEqual(mockTransactions[0])
    })
  })

  describe('When transactions prop changes', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory({ transactions: [] })
      await wrapper.setProps({ transactions: mockTransactions })
    })

    it('Then it should update and render the new transactions', () => {
      expect(wrapper.findAllComponents(TransactionItem)).toHaveLength(mockTransactions.length)
    })
  })

  describe('When isLoading prop changes', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory({ transactions: mockTransactions, isLoading: false })
      await wrapper.setProps({ isLoading: true })
    })

    it('Then it should show loading state', () => {
      expect(wrapper.text()).toContain('Loading transactions...')
    })

    it('Then it should not render transaction items', () => {
      expect(wrapper.findAllComponents(TransactionItem)).toHaveLength(0)
    })
  })

  describe('When passing props to TransactionItem', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = mount(TransactionList, {
        props: {
          transactions: mockTransactions,
          isLoading: false,
        },
      })
    })

    it('Then it should pass correct title to TransactionItem', () => {
      const items = wrapper.findAllComponents(TransactionItem)
      expect(items[0].props('title')).toBe(mockTransactions[0].title)
      expect(items[1].props('title')).toBe(mockTransactions[1].title)
    })

    it('Then it should pass correct subtitle to TransactionItem', () => {
      const items = wrapper.findAllComponents(TransactionItem)
      expect(items[0].props('subtitle')).toBe(
        `${mockTransactions[0].category} • ${mockTransactions[0].date}`,
      )
      expect(items[1].props('subtitle')).toBe(
        `${mockTransactions[1].category} • ${mockTransactions[1].date}`,
      )
    })

    it('Then it should pass formatted amount to TransactionItem', () => {
      const items = wrapper.findAllComponents(TransactionItem)
      expect(items[0].props('amount')).toBe(mockTransactions[0].amount)
      expect(items[1].props('amount')).toBe(mockTransactions[1].amount)
    })

    it('Then it should pass correct type to TransactionItem', () => {
      const items = wrapper.findAllComponents(TransactionItem)
      expect(items[0].props('type')).toBe(mockTransactions[0].type)
      expect(items[1].props('type')).toBe(mockTransactions[1].type)
    })

    it('Then it should pass correct currency to TransactionItem', () => {
      const items = wrapper.findAllComponents(TransactionItem)
      expect(items[0].props('currency')).toBe(mockTransactions[0].currency)
      expect(items[1].props('currency')).toBe(mockTransactions[1].currency)
    })
  })

  describe('When rendered with mixed transaction types', () => {
    const mixedTransactions = [
      {
        ...mockTransactions[0],
        type: 'income',
      },
      {
        ...mockTransactions[1],
        type: 'expense',
      },
      {
        ...mockTransactions[0],
        id: '3',
        type: 'neutral',
      },
    ]

    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ transactions: mixedTransactions })
    })

    it('Then it should render all transaction types correctly', () => {
      const items = wrapper.findAllComponents(TransactionItem)
      expect(items).toHaveLength(3)
      expect(items[0].props('type')).toBe('income')
      expect(items[1].props('type')).toBe('expense')
      expect(items[2].props('type')).toBe('neutral')
    })
  })

  describe('When rendered with transactions with different currencies', () => {
    const multiCurrencyTransactions = [
      {
        ...mockTransactions[0],
        currency: 'BRL',
      },
      {
        ...mockTransactions[1],
        currency: 'USD',
      },
    ]

    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ transactions: multiCurrencyTransactions })
    })

    it('Then it should pass the correct currency to each TransactionItem', () => {
      const items = wrapper.findAllComponents(TransactionItem)
      expect(items[0].props('currency')).toBe('BRL')
      expect(items[1].props('currency')).toBe('USD')
    })
  })
})
