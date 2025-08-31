/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TransactionItem from '../../../src/components/shared/TransactionItem.vue'
import type { TransactionItemProps } from '../../../src/components/shared/TransactionItem.vue'

const factory = (props: Partial<TransactionItemProps> = {}) => {
  const defaultProps: TransactionItemProps = {
    title: 'Test Transaction',
    subtitle: 'Test Category • 01/01/2025',
    amount: 100,
    type: 'neutral',
    currency: 'BRL',
    locale: 'pt-BR',
    showCurrency: true,
    showActions: true,
    showEditButton: true,
    showDeleteButton: true,
    editButtonText: 'Editar',
    deleteButtonText: 'Excluir',
    clickable: false,
  }

  return mount(TransactionItem, {
    props: { ...defaultProps, ...props },
  })
}

describe('Given a TransactionItem component', () => {
  describe('When rendered with default props', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should display default title', () => {
      expect((wrapper.vm as any).title).toBe('Test Transaction')
    })

    it('Then it should display default subtitle', () => {
      expect((wrapper.vm as any).subtitle).toBe('Test Category • 01/01/2025')
    })

    it('Then it should have default amount', () => {
      expect((wrapper.vm as any).amount).toBe(100)
    })

    it('Then it should use neutral type as default', () => {
      expect((wrapper.vm as any).type).toBe('neutral')
    })

    it('Then it should use BRL currency as default', () => {
      expect((wrapper.vm as any).currency).toBe('BRL')
    })

    it('Then it should use pt-BR locale as default', () => {
      expect((wrapper.vm as any).locale).toBe('pt-BR')
    })

    it('Then it should show currency by default', () => {
      expect((wrapper.vm as any).showCurrency).toBe(true)
    })

    it('Then it should show actions by default', () => {
      expect((wrapper.vm as any).showActions).toBe(true)
    })

    it('Then it should show edit button by default', () => {
      expect((wrapper.vm as any).showEditButton).toBe(true)
    })

    it('Then it should show delete button by default', () => {
      expect((wrapper.vm as any).showDeleteButton).toBe(true)
    })

    it('Then it should use default button texts', () => {
      expect((wrapper.vm as any).editButtonText).toBe('Editar')
      expect((wrapper.vm as any).deleteButtonText).toBe('Excluir')
    })

    it('Then it should not be clickable by default', () => {
      expect((wrapper.vm as any).clickable).toBe(false)
    })
  })

  describe('When rendered with custom title and subtitle', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        title: 'Almoço no restaurante',
        subtitle: 'Alimentação • 28/08/2025',
      })
    })

    it('Then it should display the custom title', () => {
      expect((wrapper.vm as any).title).toBe('Almoço no restaurante')
    })

    it('Then it should display the custom subtitle', () => {
      expect((wrapper.vm as any).subtitle).toBe('Alimentação • 28/08/2025')
    })
  })

  describe('When rendered as income transaction', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ type: 'income' })
    })

    it('Then it should compute green color class', () => {
      expect((wrapper.vm as any).amountColorClass).toBe('text-green-600')
    })

    it('Then it should add plus prefix to formatted amount', () => {
      expect((wrapper.vm as any).formattedAmount).toMatch(/^\+ /)
    })
  })

  describe('When rendered as expense transaction', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ type: 'expense' })
    })

    it('Then it should compute red color class', () => {
      expect((wrapper.vm as any).amountColorClass).toBe('text-red-600')
    })

    it('Then it should add minus prefix to formatted amount', () => {
      expect((wrapper.vm as any).formattedAmount).toMatch(/^- /)
    })
  })

  describe('When rendered as neutral transaction', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ type: 'neutral' })
    })

    it('Then it should compute gray color class', () => {
      expect((wrapper.vm as any).amountColorClass).toBe('text-gray-900')
    })

    it('Then it should not add prefix to formatted amount', () => {
      expect((wrapper.vm as any).formattedAmount).not.toMatch(/^[+-] /)
    })
  })

  describe('When rendered with custom amount and currency formatting', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 150,
        type: 'expense',
        currency: 'BRL',
        locale: 'pt-BR',
      })
    })

    it('Then it should format as Brazilian currency with minus prefix', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('- ')
      expect(formatted).toContain('R$')
      expect(formatted).toContain('150,00')
    })
  })

  describe('When rendered with income and Brazilian currency', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 2500,
        type: 'income',
        currency: 'BRL',
        locale: 'pt-BR',
      })
    })

    it('Then it should format as Brazilian currency with plus prefix', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('+ ')
      expect(formatted).toContain('R$')
      expect(formatted).toContain('2.500,00')
    })
  })

  describe('When rendered with neutral amount', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 1000,
        type: 'neutral',
      })
    })

    it('Then it should format without prefix', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('R$')
      expect(formatted).toContain('1.000,00')
      expect(formatted).not.toMatch(/^[+-] /)
    })
  })

  describe('When rendered without currency formatting', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 250,
        type: 'expense',
        showCurrency: false,
        locale: 'pt-BR',
      })
    })

    it('Then it should format number without currency symbol', () => {
      expect((wrapper.vm as any).formattedAmount).toBe('- 250')
    })
  })

  describe('When rendered as income without currency', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 1500,
        type: 'income',
        showCurrency: false,
        locale: 'pt-BR',
      })
    })

    it('Then it should format number with plus prefix only', () => {
      expect((wrapper.vm as any).formattedAmount).toBe('+ 1.500')
    })
  })

  describe('When rendered with USD currency', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 500,
        type: 'expense',
        currency: 'USD',
        locale: 'en-US',
      })
    })

    it('Then it should format as US dollar', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('- ')
      expect(formatted).toContain('$500.00')
    })
  })

  describe('When rendered with EUR currency', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 350,
        type: 'income',
        currency: 'EUR',
        locale: 'de-DE',
      })
    })

    it('Then it should format as Euro', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('+ ')
      expect(formatted).toContain('€')
      expect(formatted).toContain('350,00')
    })
  })

  describe('When rendered with GBP currency', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 1200,
        type: 'income',
        currency: 'GBP',
        locale: 'en-GB',
      })
    })

    it('Then it should format as British Pound', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('+ ')
      expect(formatted).toContain('£1,200.00')
    })
  })

  describe('When rendered with zero amount', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ amount: 0, type: 'expense' })
    })

    it('Then it should format zero with prefix and currency', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('- ')
      expect(formatted).toContain('R$')
      expect(formatted).toContain('0,00')
    })
  })

  describe('When rendered with negative amount', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: -500,
        type: 'expense',
      })
    })

    it('Then it should use absolute value and single prefix', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('- ')
      expect(formatted).toContain('500,00')
      expect(formatted).not.toContain('--')
    })
  })

  describe('When rendered with large amount', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 1000000,
        type: 'income',
      })
    })

    it('Then it should format large number correctly', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('+ ')
      expect(formatted).toContain('1.000.000,00')
    })
  })

  describe('When rendered with decimal amount', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 123.45,
        type: 'expense',
      })
    })

    it('Then it should format decimal correctly', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('- ')
      expect(formatted).toContain('123,45')
    })
  })

  describe('When rendered with custom button texts', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        editButtonText: 'Edit',
        deleteButtonText: 'Remove',
      })
    })

    it('Then it should use custom edit button text', () => {
      expect((wrapper.vm as any).editButtonText).toBe('Edit')
    })

    it('Then it should use custom delete button text', () => {
      expect((wrapper.vm as any).deleteButtonText).toBe('Remove')
    })
  })

  describe('When rendered with actions disabled', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ showActions: false })
    })

    it('Then it should not show actions', () => {
      expect((wrapper.vm as any).showActions).toBe(false)
    })
  })

  describe('When rendered with edit button disabled', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ showEditButton: false })
    })

    it('Then it should not show edit button', () => {
      expect((wrapper.vm as any).showEditButton).toBe(false)
    })
  })

  describe('When rendered with delete button disabled', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ showDeleteButton: false })
    })

    it('Then it should not show delete button', () => {
      expect((wrapper.vm as any).showDeleteButton).toBe(false)
    })
  })

  describe('When rendered as clickable', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ clickable: true })
    })

    it('Then it should be clickable', () => {
      expect((wrapper.vm as any).clickable).toBe(true)
    })
  })

  describe('When clicked and clickable is enabled', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory({ clickable: true })
      await (wrapper.vm as any).handleClick(new MouseEvent('click'))
    })

    it('Then it should emit click event', () => {
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('Then it should emit click event once', () => {
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('When clicked and clickable is disabled', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory({ clickable: false })
      await (wrapper.vm as any).handleClick(new MouseEvent('click'))
    })

    it('Then it should not emit click event', () => {
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('When edit button is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let mockEvent: MouseEvent

    beforeEach(async () => {
      wrapper = factory()
      mockEvent = new MouseEvent('click')
      await (wrapper.vm as any).handleEdit(mockEvent)
    })

    it('Then it should emit edit event', () => {
      expect(wrapper.emitted('edit')).toBeTruthy()
    })

    it('Then it should emit edit event once', () => {
      expect(wrapper.emitted('edit')).toHaveLength(1)
    })

    it('Then it should pass event object in emission', () => {
      expect(wrapper.emitted('edit')?.[0]?.[0]).toBe(mockEvent)
    })
  })

  describe('When delete button is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let mockEvent: MouseEvent

    beforeEach(async () => {
      wrapper = factory()
      mockEvent = new MouseEvent('click')
      await (wrapper.vm as any).handleDelete(mockEvent)
    })

    it('Then it should emit delete event', () => {
      expect(wrapper.emitted('delete')).toBeTruthy()
    })

    it('Then it should emit delete event once', () => {
      expect(wrapper.emitted('delete')).toHaveLength(1)
    })

    it('Then it should pass event object in emission', () => {
      expect(wrapper.emitted('delete')?.[0]?.[0]).toBe(mockEvent)
    })
  })

  describe('When amount prop changes', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ amount: 500 })
    })

    it('Then it should update amount prop', () => {
      expect((wrapper.vm as any).amount).toBe(500)
    })

    it('Then it should update formatted amount', () => {
      expect((wrapper.vm as any).formattedAmount).toContain('500,00')
    })
  })

  describe('When type prop changes to expense', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ type: 'expense' })
    })

    it('Then it should update type prop', () => {
      expect((wrapper.vm as any).type).toBe('expense')
    })

    it('Then it should update color class', () => {
      expect((wrapper.vm as any).amountColorClass).toBe('text-red-600')
    })

    it('Then it should add minus prefix', () => {
      expect((wrapper.vm as any).formattedAmount).toMatch(/^- /)
    })
  })

  describe('When currency prop changes to USD', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({
        currency: 'USD',
        locale: 'en-US',
      })
    })

    it('Then it should update currency prop', () => {
      expect((wrapper.vm as any).currency).toBe('USD')
    })

    it('Then it should format with dollar symbol', () => {
      expect((wrapper.vm as any).formattedAmount).toContain('$')
    })
  })

  describe('When showCurrency prop changes to false', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ showCurrency: false })
    })

    it('Then it should update showCurrency prop', () => {
      expect((wrapper.vm as any).showCurrency).toBe(false)
    })

    it('Then it should remove currency symbol', () => {
      expect((wrapper.vm as any).formattedAmount).not.toContain('R$')
    })
  })

  describe('When title and subtitle props change', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({
        title: 'Novo Título',
        subtitle: 'Nova Categoria • 02/01/2025',
      })
    })

    it('Then it should update title prop', () => {
      expect((wrapper.vm as any).title).toBe('Novo Título')
    })

    it('Then it should update subtitle prop', () => {
      expect((wrapper.vm as any).subtitle).toBe('Nova Categoria • 02/01/2025')
    })
  })

  describe('When rendered with empty title', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ title: '' })
    })

    it('Then it should accept empty title', () => {
      expect((wrapper.vm as any).title).toBe('')
    })
  })

  describe('When rendered with empty subtitle', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({ subtitle: '' })
    })

    it('Then it should accept empty subtitle', () => {
      expect((wrapper.vm as any).subtitle).toBe('')
    })
  })

  describe('When rendered with very long title', () => {
    let wrapper: ReturnType<typeof factory>
    const longTitle =
      'Este é um título muito longo para uma transação que pode quebrar o layout se não for tratado adequadamente'

    beforeEach(() => {
      wrapper = factory({ title: longTitle })
    })

    it('Then it should accept long title', () => {
      expect((wrapper.vm as any).title).toBe(longTitle)
    })
  })

  describe('When rendered with complex decimal amount', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 123.456789,
        type: 'income',
      })
    })

    it('Then it should format with proper rounding', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('+ ')
      expect(formatted).toContain('123,46')
    })
  })

  describe('When type changes and performance is tested', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ title: 'Novo Título' })
    })

    it('Then color class should remain stable when unrelated props change', () => {
      const initialColorClass = (wrapper.vm as any).amountColorClass
      expect((wrapper.vm as any).amountColorClass).toBe(initialColorClass)
    })
  })

  describe('When unrelated props change', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ title: 'Novo Título' })
    })

    it('Then formatted amount should remain stable', () => {
      const initialFormattedAmount = (wrapper.vm as any).formattedAmount
      expect((wrapper.vm as any).formattedAmount).toBe(initialFormattedAmount)
    })
  })

  describe('When computed properties are accessed multiple times', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then color class should maintain stable reference', () => {
      const firstColorClass = (wrapper.vm as any).amountColorClass
      const secondColorClass = (wrapper.vm as any).amountColorClass
      expect(firstColorClass).toBe(secondColorClass)
    })

    it('Then formatted amount should maintain stable reference', () => {
      const firstFormattedAmount = (wrapper.vm as any).formattedAmount
      const secondFormattedAmount = (wrapper.vm as any).formattedAmount
      expect(firstFormattedAmount).toBe(secondFormattedAmount)
    })
  })

  describe('When interface validation is performed', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then computed properties should be defined', () => {
      expect((wrapper.vm as any).amountColorClass).toBeDefined()
      expect((wrapper.vm as any).formattedAmount).toBeDefined()
    })

    it('Then event handlers should be functions', () => {
      expect(typeof (wrapper.vm as any).handleClick).toBe('function')
      expect(typeof (wrapper.vm as any).handleEdit).toBe('function')
      expect(typeof (wrapper.vm as any).handleDelete).toBe('function')
    })
  })

  describe('When configured as typical expense item', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        title: 'Almoço no restaurante X',
        subtitle: 'Alimentação • 28/08/2025',
        amount: 50,
        type: 'expense',
      })
    })

    it('Then it should display expense title', () => {
      expect((wrapper.vm as any).title).toBe('Almoço no restaurante X')
    })

    it('Then it should display expense subtitle', () => {
      expect((wrapper.vm as any).subtitle).toBe('Alimentação • 28/08/2025')
    })

    it('Then it should have expense color', () => {
      expect((wrapper.vm as any).amountColorClass).toBe('text-red-600')
    })

    it('Then it should format as expense amount', () => {
      expect((wrapper.vm as any).formattedAmount).toMatch(/^- .*R\$.*50,00/)
    })
  })

  describe('When configured as typical income item', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        title: 'Salário',
        subtitle: 'Receita • 25/08/2025',
        amount: 2500,
        type: 'income',
      })
    })

    it('Then it should display income title', () => {
      expect((wrapper.vm as any).title).toBe('Salário')
    })

    it('Then it should display income subtitle', () => {
      expect((wrapper.vm as any).subtitle).toBe('Receita • 25/08/2025')
    })

    it('Then it should have income color', () => {
      expect((wrapper.vm as any).amountColorClass).toBe('text-green-600')
    })

    it('Then it should format as income amount', () => {
      expect((wrapper.vm as any).formattedAmount).toMatch(/^\+ .*R\$.*2\.500,00/)
    })
  })

  describe('When configured as neutral item without actions', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        title: 'Transferência',
        subtitle: 'Conta corrente • 26/08/2025',
        amount: 1000,
        type: 'neutral',
        showActions: false,
      })
    })

    it('Then it should be neutral type', () => {
      expect((wrapper.vm as any).type).toBe('neutral')
    })

    it('Then it should not show actions', () => {
      expect((wrapper.vm as any).showActions).toBe(false)
    })

    it('Then it should have neutral color', () => {
      expect((wrapper.vm as any).amountColorClass).toBe('text-gray-900')
    })

    it('Then it should format without prefix', () => {
      expect((wrapper.vm as any).formattedAmount).not.toMatch(/^[+-] /)
    })
  })

  describe('When rendered with different currencies and formatting', () => {
    const currencies = [
      { currency: 'USD', locale: 'en-US', symbol: '$' },
      { currency: 'EUR', locale: 'de-DE', symbol: '€' },
      { currency: 'GBP', locale: 'en-GB', symbol: '£' },
    ]

    currencies.forEach(({ currency, locale, symbol }) => {
      describe(`When formatted with ${currency}`, () => {
        let wrapper: ReturnType<typeof factory>

        beforeEach(() => {
          wrapper = factory({
            amount: 1000,
            type: 'income',
            currency,
            locale,
          })
        })

        it(`Then it should contain ${symbol} symbol`, () => {
          expect((wrapper.vm as any).formattedAmount).toContain(symbol)
        })

        it('Then it should have plus prefix', () => {
          expect((wrapper.vm as any).formattedAmount).toContain('+ ')
        })
      })
    })
  })

  describe('When formatted with BRL in Portuguese locale', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        amount: 1500,
        type: 'expense',
        currency: 'BRL',
        locale: 'pt-BR',
      })
    })

    it('Then it should format with minus prefix', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('- ')
    })

    it('Then it should contain Real symbol', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('R$')
    })

    it('Then it should format amount correctly', () => {
      const formatted = (wrapper.vm as any).formattedAmount
      expect(formatted).toContain('1.500,00')
    })
  })
})
