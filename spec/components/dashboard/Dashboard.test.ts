import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import Dashboard from '../../../src/components/dashboard/Dashboard.vue'
import { texts } from '../../../src/shared/texts'

type DashboardWrapper = VueWrapper<ComponentPublicInstance & InstanceType<typeof Dashboard>>

const factory = () => {
  return mount(Dashboard) as DashboardWrapper
}

describe('Given a Dashboard component', () => {
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
  })

  describe('When rendering CardInfo components', () => {
    let wrapper: DashboardWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should render the current balance card with correct title', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const currentBalanceCard = cardInfos[0]
      expect(currentBalanceCard.props('title')).toBe(texts.dashboard.currentBalance)
    })

    it('Then it should render the current balance card with correct value', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const currentBalanceCard = cardInfos[0]
      expect(currentBalanceCard.props('value')).toBe(320)
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

    it('Then it should render the income card with correct value', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const incomeCard = cardInfos[1]
      expect(incomeCard.props('value')).toBe(15000)
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

    it('Then it should render the expenses card with correct value', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const expensesCard = cardInfos[2]
      expect(expensesCard.props('value')).toBe(12)
    })

    it('Then it should render the expenses card with correct variant', () => {
      const cardInfos = wrapper.findAllComponents({ name: 'CardInfo' })
      const expensesCard = cardInfos[2]
      expect(expensesCard.props('variant')).toBe('danger')
    })
  })

  describe('When rendering the chart section', () => {
    let wrapper: DashboardWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should render the chart container with correct styling', () => {
      const chartContainer = wrapper.find('.mt-8.p-6.bg-white.rounded-lg.border.border-gray-200')
      expect(chartContainer.exists()).toBe(true)
    })

    it('Then it should render the chart title element', () => {
      const chartTitle = wrapper.find('h2')
      expect(chartTitle.exists()).toBe(true)
    })

    it('Then it should display the correct chart title text', () => {
      const chartTitle = wrapper.find('h2')
      expect(chartTitle.text()).toBe(texts.dashboard.charts.chartTitle)
    })

    it('Then it should apply text-xl class to chart title', () => {
      const chartTitle = wrapper.find('h2')
      expect(chartTitle.classes()).toContain('text-xl')
    })

    it('Then it should apply font-semibold class to chart title', () => {
      const chartTitle = wrapper.find('h2')
      expect(chartTitle.classes()).toContain('font-semibold')
    })

    it('Then it should apply text-gray-700 class to chart title', () => {
      const chartTitle = wrapper.find('h2')
      expect(chartTitle.classes()).toContain('text-gray-700')
    })

    it('Then it should apply text-center class to chart title', () => {
      const chartTitle = wrapper.find('h2')
      expect(chartTitle.classes()).toContain('text-center')
    })

    it('Then it should apply mb-6 class to chart title', () => {
      const chartTitle = wrapper.find('h2')
      expect(chartTitle.classes()).toContain('mb-6')
    })

    it('Then it should render the chart placeholder text element', () => {
      const placeholderText = wrapper.find('p.text-sm')
      expect(placeholderText.exists()).toBe(true)
    })

    it('Then it should display the correct chart placeholder text', () => {
      const placeholderText = wrapper.find('p.text-sm')
      expect(placeholderText.text()).toBe(texts.dashboard.charts.chartPlaceholder)
    })

    it('Then it should render the chart placeholder container', () => {
      const placeholderContainer = wrapper.find('.flex.justify-center.items-center.h-64')
      expect(placeholderContainer.exists()).toBe(true)
    })

    it('Then it should render the text container within placeholder', () => {
      const placeholderContainer = wrapper.find('.flex.justify-center.items-center.h-64')
      const textContainer = placeholderContainer.find('.text-gray-400.text-center')
      expect(textContainer.exists()).toBe(true)
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
    let cardContainer: VueWrapper<ComponentPublicInstance>;
    let cardTitle: VueWrapper<ComponentPublicInstance>;
    let cardDivider: VueWrapper<ComponentPublicInstance>;
    let cardInfos: VueWrapper<ComponentPublicInstance>[];

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
})
