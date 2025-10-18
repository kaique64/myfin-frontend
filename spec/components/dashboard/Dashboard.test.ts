import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import Dashboard from '../../../src/components/dashboard/Dashboard.vue'
import { texts } from '../../../src/shared/texts'

type DashboardWrapper = VueWrapper<ComponentPublicInstance & InstanceType<typeof Dashboard>>

const mockGetTransactionDashboard = vi.fn()
const mockAddNotification = vi.fn()

const mockTransactionStore = {
  transactionDashboard: null as {
    incomeAmount: number
    expenseAmount: number
    totalAmount: number
  } | null,
  getTransactionDashboard: mockGetTransactionDashboard,
}

vi.mock('../../../src/stores/transaction', () => ({
  useTransactionStore: () => mockTransactionStore,
}))

vi.mock('../../../src/composables/useNotifications', () => ({
  useNotifications: () => ({
    addNotification: mockAddNotification,
  }),
}))

const factory = (overrides = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(Dashboard, {
    global: {
      plugins: [pinia],
    },
    ...overrides,
  }) as DashboardWrapper
}

describe('Given a Dashboard component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTransactionStore.transactionDashboard = null
  })

  describe('When rendered with default state', () => {
    let wrapper: DashboardWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should render the dashboard title', () => {
      const title = wrapper.find('h1')
      expect(title.exists()).toBe(true)
    })

    it('Then it should display the correct dashboard title text', () => {
      const title = wrapper.find('h1')
      expect(title.text()).toBe(texts.dashboard.title)
    })

    it('Then it should render the CardContainer wrapper', () => {
      const cardContainer = wrapper.findComponent({ name: 'CardContainer' })
      expect(cardContainer.exists()).toBe(true)
    })

    it('Then it should render the Divider component', () => {
      const divider = wrapper.findComponent({ name: 'Divider' })
      expect(divider.exists()).toBe(true)
    })

    it('Then it should render the Divider component with correct size prop', () => {
      const divider = wrapper.findComponent({ name: 'Divider' })
      expect(divider.props('size')).toBe('xs')
    })

    it('Then it should render the Title component', () => {
      const title = wrapper.findComponent({ name: 'Title' })
      expect(title.exists()).toBe(true)
    })

    it('Then it should render the Title component with correct size prop', () => {
      const title = wrapper.findComponent({ name: 'Title' })
      expect(title.props('size')).toBe('2xl')
    })

    it('Then it should render the Title component with correct tag prop', () => {
      const title = wrapper.findComponent({ name: 'Title' })
      expect(title.props('tag')).toBe('h1')
    })

    it('Then it should render three CardInfo components', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      expect(cardInfos).toHaveLength(3)
    })

    it('Then it should call getTransactionDashboard on mount', () => {
      expect(mockGetTransactionDashboard).toHaveBeenCalledOnce()
    })
  })

  describe('When rendering CardInfo components with no dashboard data', () => {
    let wrapper: DashboardWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should render the current balance card with correct title', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const currentBalanceCard = cardInfos[0]
      expect(currentBalanceCard.props('title')).toBe(texts.dashboard.currentBalance)
    })

    it('Then it should render the current balance card with default value', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const currentBalanceCard = cardInfos[0]
      expect(currentBalanceCard.props('value')).toBe(0)
    })

    it('Then it should render the current balance card with correct variant', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const currentBalanceCard = cardInfos[0]
      expect(currentBalanceCard.props('variant')).toBe('info')
    })

    it('Then it should render the income card with correct title', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const incomeCard = cardInfos[1]
      expect(incomeCard.props('title')).toBe(texts.dashboard.income)
    })

    it('Then it should render the income card with default value', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const incomeCard = cardInfos[1]
      expect(incomeCard.props('value')).toBe(0)
    })

    it('Then it should render the income card with correct variant', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const incomeCard = cardInfos[1]
      expect(incomeCard.props('variant')).toBe('success')
    })

    it('Then it should render the expenses card with correct title', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const expensesCard = cardInfos[2]
      expect(expensesCard.props('title')).toBe(texts.dashboard.expenses)
    })

    it('Then it should render the expenses card with default value', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const expensesCard = cardInfos[2]
      expect(expensesCard.props('value')).toBe(0)
    })

    it('Then it should render the expenses card with correct variant', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const expensesCard = cardInfos[2]
      expect(expensesCard.props('variant')).toBe('danger')
    })
  })

  describe('When checking the grid layout', () => {
    let wrapper: DashboardWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should apply correct grid classes for responsive layout', () => {
      const gridContainer = wrapper.find(
        '.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-3.gap-6.mt-6',
      )
      expect(gridContainer.exists()).toBe(true)
    })

    it('Then it should contain all three CardInfo components within the grid', () => {
      const gridContainer = wrapper.find('.grid')
      const cardInfosInGrid = gridContainer.findAllComponents({ name: 'CardInfo' })
      expect(cardInfosInGrid).toHaveLength(3)
    })
  })

  describe('When checking component structure', () => {
    let wrapper: DashboardWrapper
    let cardContainer: VueWrapper<ComponentPublicInstance>
    let cardTitle: VueWrapper<ComponentPublicInstance>
    let cardDivider: VueWrapper<ComponentPublicInstance>
    let cardInfos: VueWrapper<ComponentPublicInstance>[]

    beforeEach(() => {
      wrapper = factory()
      cardContainer = wrapper.findComponent({ name: 'CardContainer' })
      cardTitle = cardContainer.findComponent({ name: 'Title' })
      cardDivider = cardContainer.findComponent({ name: 'Divider' })
      cardInfos = cardContainer.findAllComponents({ name: 'CardInfo' })
    })

    it('Then it should have CardContainer as the root component', () => {
      expect(cardContainer.exists()).toBe(true)
    })

    it('Then it should have Title inside CardContainer', () => {
      expect(cardTitle.exists()).toBe(true)
    })

    it('Then it should have Divider inside CardContainer', () => {
      expect(cardDivider.exists()).toBe(true)
    })

    it('Then it should have all CardInfo components inside CardContainer', () => {
      expect(cardInfos).toHaveLength(3)
    })
  })

  describe('When rendering with dashboard data', () => {
    beforeEach(() => {
      mockTransactionStore.transactionDashboard = {
        incomeAmount: 5000,
        expenseAmount: 1200,
        totalAmount: 3800,
      }
    })

    it('Then it should render the current balance card with correct value from store', async () => {
      const wrapper = factory()
      await wrapper.vm.$nextTick()

      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const currentBalanceCard = cardInfos[0]
      expect(currentBalanceCard.props('value')).toBe(3800)
    })

    it('Then it should render the income card with correct value from store', async () => {
      const wrapper = factory()
      await wrapper.vm.$nextTick()

      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const incomeCard = cardInfos[1]
      expect(incomeCard.props('value')).toBe(5000)
    })

    it('Then it should render the expenses card with correct value from store', async () => {
      const wrapper = factory()
      await wrapper.vm.$nextTick()

      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const expensesCard = cardInfos[2]
      expect(expensesCard.props('value')).toBe(1200)
    })
  })

  describe('When getTransactionDashboard succeeds', () => {
    beforeEach(() => {
      mockGetTransactionDashboard.mockResolvedValue(undefined)
    })

    it('Then it should not show error notification', async () => {
      const wrapper = factory()
      await wrapper.vm.$nextTick()

      expect(mockAddNotification).not.toHaveBeenCalled()
    })
  })

  describe('When getTransactionDashboard fails', () => {
    const mockError = new Error('API Error')

    beforeEach(() => {
      mockGetTransactionDashboard.mockRejectedValue(mockError)
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('Then it should show error notification', async () => {
      factory()
      // Wait for the async onMounted to complete
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(mockAddNotification).toHaveBeenCalledWith({
        message: 'Error fetching dashboard data',
        variant: 'danger',
      })
    })

    it('Then it should log error to console', async () => {
      factory()
      // Wait for the async onMounted to complete
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(console.error).toHaveBeenCalledWith('Error fetching dashboard data:', mockError)
    })
  })
})
