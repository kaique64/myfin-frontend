/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import TransactionItem from '../../../src/components/shared/TransactionItem.vue'
import type { TransactionItemProps } from '../../../src/components/shared/TransactionItem.vue'

const factory = (
  props: Partial<TransactionItemProps> = {},
  options: { slots?: Record<string, string> } = {},
) => {
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
    slots: options.slots,
    shallow: true,
  })
}

describe('TransactionItem', () => {
  describe('Props e Valores Básicos', () => {
    it('deve aceitar título como prop', () => {
      const wrapper = factory({ title: 'Almoço no restaurante' })

      expect(wrapper.props('title')).toBe('Almoço no restaurante')
    })

    it('deve aceitar subtitle como prop', () => {
      const wrapper = factory({ subtitle: 'Alimentação • 28/08/2025' })

      expect(wrapper.props('subtitle')).toBe('Alimentação • 28/08/2025')
    })

    it('deve aceitar amount como prop', () => {
      const wrapper = factory({ amount: 250.5 })

      expect(wrapper.props('amount')).toBe(250.5)
    })

    it('deve usar type neutral como padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('type')).toBe('neutral')
    })

    it('deve aceitar diferentes tipos de transação', () => {
      const wrapper = factory({ type: 'expense' })

      expect(wrapper.props('type')).toBe('expense')
    })

    it('deve usar currency BRL como padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('currency')).toBe('BRL')
    })

    it('deve usar locale pt-BR como padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('locale')).toBe('pt-BR')
    })

    it('deve usar showCurrency true como padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('showCurrency')).toBe(true)
    })
  })

  describe('Tipos de Transação e Classes CSS', () => {
    let wrapper: VueWrapper<any>

    describe('Income Transaction', () => {
      beforeEach(() => {
        wrapper = factory({ type: 'income' })
      })

      it('deve computar classe de cor correta para income', () => {
        expect(wrapper.vm.amountColorClass).toBe('text-green-600')
      })

      it('deve adicionar prefixo + para income', () => {
        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toMatch(/^\+ /)
      })
    })

    describe('Expense Transaction', () => {
      beforeEach(() => {
        wrapper = factory({ type: 'expense' })
      })

      it('deve computar classe de cor correta para expense', () => {
        expect(wrapper.vm.amountColorClass).toBe('text-red-600')
      })

      it('deve adicionar prefixo - para expense', () => {
        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toMatch(/^- /)
      })
    })

    describe('Neutral Transaction', () => {
      beforeEach(() => {
        wrapper = factory({ type: 'neutral' })
      })

      it('deve computar classe de cor correta para neutral', () => {
        expect(wrapper.vm.amountColorClass).toBe('text-gray-900')
      })

      it('não deve adicionar prefixo para neutral', () => {
        const formatted = wrapper.vm.formattedAmount
        expect(formatted).not.toMatch(/^[+-] /)
      })
    })
  })

  describe('Formatação de Valores', () => {
    describe('Com Formatação de Moeda', () => {
      it('deve formatar valor como moeda brasileira para expense', () => {
        const wrapper = factory({
          amount: 150,
          type: 'expense',
          currency: 'BRL',
          locale: 'pt-BR',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('- ')
        expect(formatted).toContain('R$')
        expect(formatted).toContain('150,00')
      })

      it('deve formatar valor como moeda brasileira para income', () => {
        const wrapper = factory({
          amount: 2500,
          type: 'income',
          currency: 'BRL',
          locale: 'pt-BR',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('+ ')
        expect(formatted).toContain('R$')
        expect(formatted).toContain('2.500,00')
      })

      it('deve formatar valor neutro sem prefixo', () => {
        const wrapper = factory({
          amount: 1000,
          type: 'neutral',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('R$')
        expect(formatted).toContain('1.000,00')
        expect(formatted).not.toMatch(/^[+-] /)
      })
    })

    describe('Sem Formatação de Moeda', () => {
      it('deve formatar valor sem moeda para expense', () => {
        const wrapper = factory({
          amount: 250,
          type: 'expense',
          showCurrency: false,
          locale: 'pt-BR',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toBe('- 250')
      })

      it('deve formatar valor sem moeda para income', () => {
        const wrapper = factory({
          amount: 1500,
          type: 'income',
          showCurrency: false,
          locale: 'pt-BR',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toBe('+ 1.500')
      })
    })

    describe('Diferentes Moedas e Locales', () => {
      it('deve formatar em dólar americano', () => {
        const wrapper = factory({
          amount: 500,
          type: 'expense',
          currency: 'USD',
          locale: 'en-US',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('- ')
        expect(formatted).toContain('$500.00')
      })

      it('deve formatar em euro', () => {
        const wrapper = factory({
          amount: 350,
          type: 'income',
          currency: 'EUR',
          locale: 'de-DE',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('+ ')
        expect(formatted).toContain('€')
        expect(formatted).toContain('350,00')
      })

      it('deve formatar em libra esterlina', () => {
        const wrapper = factory({
          amount: 1200,
          type: 'income',
          currency: 'GBP',
          locale: 'en-GB',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('+ ')
        expect(formatted).toContain('£1,200.00')
      })
    })

    describe('Valores Extremos', () => {
      it('deve formatar valor zero', () => {
        const wrapper = factory({ amount: 0, type: 'expense' })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('- ')
        expect(formatted).toContain('R$')
        expect(formatted).toContain('0,00')
      })

      it('deve usar valor absoluto para valores negativos', () => {
        const wrapper = factory({
          amount: -500,
          type: 'expense',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('- ')
        expect(formatted).toContain('500,00')
        expect(formatted).not.toContain('--')
      })

      it('deve formatar valores muito grandes', () => {
        const wrapper = factory({
          amount: 1000000,
          type: 'income',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('+ ')
        expect(formatted).toContain('1.000.000,00')
      })

      it('deve formatar valores decimais', () => {
        const wrapper = factory({
          amount: 123.45,
          type: 'expense',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('- ')
        expect(formatted).toContain('123,45')
      })
    })
  })

  describe('Botões de Ação', () => {
    describe('Configuração de Botões', () => {
      it('deve mostrar botões por padrão', () => {
        const wrapper = factory()

        expect(wrapper.props('showActions')).toBe(true)
        expect(wrapper.props('showEditButton')).toBe(true)
        expect(wrapper.props('showDeleteButton')).toBe(true)
      })

      it('deve aceitar textos customizados para botões', () => {
        const wrapper = factory({
          editButtonText: 'Edit',
          deleteButtonText: 'Remove',
        })

        expect(wrapper.props('editButtonText')).toBe('Edit')
        expect(wrapper.props('deleteButtonText')).toBe('Remove')
      })

      it('deve aceitar configuração para esconder ações', () => {
        const wrapper = factory({ showActions: false })

        expect(wrapper.props('showActions')).toBe(false)
      })

      it('deve aceitar configuração para esconder botão de editar', () => {
        const wrapper = factory({ showEditButton: false })

        expect(wrapper.props('showEditButton')).toBe(false)
      })

      it('deve aceitar configuração para esconder botão de excluir', () => {
        const wrapper = factory({ showDeleteButton: false })

        expect(wrapper.props('showDeleteButton')).toBe(false)
      })
    })
  })

  describe('Interatividade e Eventos', () => {
    describe('Evento de Clique', () => {
      it('deve aceitar prop clickable', () => {
        const wrapper = factory({ clickable: true })

        expect(wrapper.props('clickable')).toBe(true)
      })

      it('deve usar clickable false como padrão', () => {
        const wrapper = factory()

        expect(wrapper.props('clickable')).toBe(false)
      })

      it('deve emitir evento click quando clickable é true', async () => {
        const wrapper = factory({ clickable: true })

        await wrapper.vm.handleClick(new MouseEvent('click'))

        expect(wrapper.emitted('click')).toBeTruthy()
        expect(wrapper.emitted('click')).toHaveLength(1)
      })

      it('não deve emitir evento click quando clickable é false', async () => {
        const wrapper = factory({ clickable: false })

        await wrapper.vm.handleClick(new MouseEvent('click'))

        expect(wrapper.emitted('click')).toBeFalsy()
      })
    })

    describe('Eventos de Botões', () => {
      it('deve emitir evento edit quando handleEdit é chamado', async () => {
        const wrapper = factory()
        const mockEvent = new MouseEvent('click')

        await wrapper.vm.handleEdit(mockEvent)

        expect(wrapper.emitted('edit')).toBeTruthy()
        expect(wrapper.emitted('edit')).toHaveLength(1)
        expect(wrapper.emitted('edit')?.[0]?.[0]).toBe(mockEvent)
      })

      it('deve emitir evento delete quando handleDelete é chamado', async () => {
        const wrapper = factory()
        const mockEvent = new MouseEvent('click')

        await wrapper.vm.handleDelete(mockEvent)

        expect(wrapper.emitted('delete')).toBeTruthy()
        expect(wrapper.emitted('delete')).toHaveLength(1)
        expect(wrapper.emitted('delete')?.[0]?.[0]).toBe(mockEvent)
      })
    })
  })

  describe('Reatividade das Props', () => {
    let wrapper: VueWrapper<any>

    beforeEach(() => {
      wrapper = factory()
    })

    it('deve reagir a mudanças na prop amount', async () => {
      await wrapper.setProps({ amount: 500 })

      expect(wrapper.props('amount')).toBe(500)
      expect(wrapper.vm.formattedAmount).toContain('500,00')
    })

    it('deve reagir a mudanças na prop type', async () => {
      await wrapper.setProps({ type: 'expense' })

      expect(wrapper.props('type')).toBe('expense')
      expect(wrapper.vm.amountColorClass).toBe('text-red-600')
      expect(wrapper.vm.formattedAmount).toMatch(/^- /)
    })

    it('deve reagir a mudanças na prop currency', async () => {
      await wrapper.setProps({
        currency: 'USD',
        locale: 'en-US',
      })

      expect(wrapper.props('currency')).toBe('USD')
      expect(wrapper.vm.formattedAmount).toContain('$')
    })

    it('deve reagir a mudanças na prop showCurrency', async () => {
      await wrapper.setProps({ showCurrency: false })

      expect(wrapper.props('showCurrency')).toBe(false)
      expect(wrapper.vm.formattedAmount).not.toContain('R$')
    })

    it('deve reagir a mudanças no title e subtitle', async () => {
      await wrapper.setProps({
        title: 'Novo Título',
        subtitle: 'Nova Categoria • 02/01/2025',
      })

      expect(wrapper.props('title')).toBe('Novo Título')
      expect(wrapper.props('subtitle')).toBe('Nova Categoria • 02/01/2025')
    })
  })

  describe('Edge Cases', () => {
    it('deve lidar com título vazio', () => {
      const wrapper = factory({ title: '' })

      expect(wrapper.props('title')).toBe('')
    })

    it('deve lidar com subtitle vazio', () => {
      const wrapper = factory({ subtitle: '' })

      expect(wrapper.props('subtitle')).toBe('')
    })

    it('deve lidar com amount zero', () => {
      const wrapper = factory({ amount: 0 })

      expect(wrapper.props('amount')).toBe(0)
      expect(wrapper.vm.formattedAmount).toContain('0,00')
    })

    it('deve lidar com valores negativos usando valor absoluto', () => {
      const wrapper = factory({
        amount: -500,
        type: 'expense',
      })

      const formatted = wrapper.vm.formattedAmount
      expect(formatted).toContain('- ')
      expect(formatted).toContain('500,00')
      expect(formatted).not.toContain('--')
    })

    it('deve lidar com título muito longo', () => {
      const longTitle =
        'Este é um título muito longo para uma transação que pode quebrar o layout se não for tratado adequadamente'
      const wrapper = factory({ title: longTitle })

      expect(wrapper.props('title')).toBe(longTitle)
    })

    it('deve lidar com valores decimais complexos', () => {
      const wrapper = factory({
        amount: 123.456789,
        type: 'income',
      })

      const formatted = wrapper.vm.formattedAmount
      expect(formatted).toContain('+ ')
      expect(formatted).toContain('123,46')
    })
  })

  describe('Configurações de Botões', () => {
    describe('Botões Padrão', () => {
      let wrapper: VueWrapper<any>

      beforeEach(() => {
        wrapper = factory()
      })

      it('deve usar textos padrão para botões', () => {
        expect(wrapper.props('editButtonText')).toBe('Editar')
        expect(wrapper.props('deleteButtonText')).toBe('Excluir')
      })

      it('deve mostrar ações por padrão', () => {
        expect(wrapper.props('showActions')).toBe(true)
      })

      it('deve mostrar ambos os botões por padrão', () => {
        expect(wrapper.props('showEditButton')).toBe(true)
        expect(wrapper.props('showDeleteButton')).toBe(true)
      })
    })

    describe('Botões Customizados', () => {
      it('deve aceitar textos customizados', () => {
        const wrapper = factory({
          editButtonText: 'Edit',
          deleteButtonText: 'Remove',
        })

        expect(wrapper.props('editButtonText')).toBe('Edit')
        expect(wrapper.props('deleteButtonText')).toBe('Remove')
      })

      it('deve aceitar configuração para esconder ações', () => {
        const wrapper = factory({ showActions: false })

        expect(wrapper.props('showActions')).toBe(false)
      })

      it('deve aceitar configuração individual de botões', () => {
        const wrapper = factory({
          showEditButton: false,
          showDeleteButton: true,
        })

        expect(wrapper.props('showEditButton')).toBe(false)
        expect(wrapper.props('showDeleteButton')).toBe(true)
      })
    })
  })

  describe('Emissão de Eventos', () => {
    let wrapper: VueWrapper<any>

    beforeEach(() => {
      wrapper = factory({ clickable: true })
    })

    it('deve emitir evento click com MouseEvent', async () => {
      const mockEvent = new MouseEvent('click')

      await wrapper.vm.handleClick(mockEvent)

      const emittedEvents = wrapper.emitted('click')
      expect(emittedEvents).toBeTruthy()
      expect(emittedEvents).toHaveLength(1)
      expect(emittedEvents?.[0]?.[0]).toBe(mockEvent)
    })

    it('deve emitir evento edit com MouseEvent', async () => {
      const mockEvent = new MouseEvent('click')

      await wrapper.vm.handleEdit(mockEvent)

      const emittedEvents = wrapper.emitted('edit')
      expect(emittedEvents).toBeTruthy()
      expect(emittedEvents).toHaveLength(1)
      expect(emittedEvents?.[0]?.[0]).toBe(mockEvent)
    })

    it('deve emitir evento delete com MouseEvent', async () => {
      const mockEvent = new MouseEvent('click')

      await wrapper.vm.handleDelete(mockEvent)

      const emittedEvents = wrapper.emitted('delete')
      expect(emittedEvents).toBeTruthy()
      expect(emittedEvents).toHaveLength(1)
      expect(emittedEvents?.[0]?.[0]).toBe(mockEvent)
    })

    it('não deve emitir click quando clickable é false', async () => {
      await wrapper.setProps({ clickable: false })

      await wrapper.vm.handleClick(new MouseEvent('click'))

      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Performance e Computação', () => {
    let wrapper: VueWrapper<any>

    beforeEach(() => {
      wrapper = factory()
    })

    it('deve computar amountColorClass apenas quando type muda', async () => {
      const initialColorClass = wrapper.vm.amountColorClass

      await wrapper.setProps({ title: 'Novo Título' })
      expect(wrapper.vm.amountColorClass).toBe(initialColorClass)

      await wrapper.setProps({ type: 'expense' })
      expect(wrapper.vm.amountColorClass).not.toBe(initialColorClass)
      expect(wrapper.vm.amountColorClass).toBe('text-red-600')
    })

    it('deve computar formattedAmount apenas quando props relevantes mudam', async () => {
      const initialFormattedAmount = wrapper.vm.formattedAmount

      await wrapper.setProps({ title: 'Novo Título' })
      expect(wrapper.vm.formattedAmount).toBe(initialFormattedAmount)

      await wrapper.setProps({ amount: 500 })
      expect(wrapper.vm.formattedAmount).not.toBe(initialFormattedAmount)
    })

    it('deve manter referência estável dos computed quando props não mudam', () => {
      const firstColorClass = wrapper.vm.amountColorClass
      const secondColorClass = wrapper.vm.amountColorClass

      expect(firstColorClass).toBe(secondColorClass)

      const firstFormattedAmount = wrapper.vm.formattedAmount
      const secondFormattedAmount = wrapper.vm.formattedAmount

      expect(firstFormattedAmount).toBe(secondFormattedAmount)
    })
  })

  describe('Validação de Interface', () => {
    it('deve ter todas as propriedades computadas definidas', () => {
      const wrapper = factory()

      expect(wrapper.vm.amountColorClass).toBeDefined()
      expect(wrapper.vm.formattedAmount).toBeDefined()
    })

    it('deve ter todas as props definidas na interface', () => {
      const wrapper = factory({
        title: 'Test Transaction',
        subtitle: 'Test Category • 01/01/2025',
        amount: 100,
        type: 'expense',
        currency: 'BRL',
        locale: 'pt-BR',
        showCurrency: true,
        showActions: true,
        showEditButton: true,
        showDeleteButton: true,
        editButtonText: 'Editar',
        deleteButtonText: 'Excluir',
        clickable: false,
      })

      expect(wrapper.props()).toEqual({
        title: 'Test Transaction',
        subtitle: 'Test Category • 01/01/2025',
        amount: 100,
        type: 'expense',
        currency: 'BRL',
        locale: 'pt-BR',
        showCurrency: true,
        showActions: true,
        showEditButton: true,
        showDeleteButton: true,
        editButtonText: 'Editar',
        deleteButtonText: 'Excluir',
        clickable: false,
      })
    })

    it('deve ter todos os métodos de evento definidos', () => {
      const wrapper = factory()

      expect(typeof wrapper.vm.handleClick).toBe('function')
      expect(typeof wrapper.vm.handleEdit).toBe('function')
      expect(typeof wrapper.vm.handleDelete).toBe('function')
    })
  })

  describe('Casos de Uso Específicos', () => {
    it('deve funcionar como item de despesa típico', () => {
      const wrapper = factory({
        title: 'Almoço no restaurante X',
        subtitle: 'Alimentação • 28/08/2025',
        amount: 50,
        type: 'expense',
      })

      expect(wrapper.props('title')).toBe('Almoço no restaurante X')
      expect(wrapper.props('subtitle')).toBe('Alimentação • 28/08/2025')
      expect(wrapper.vm.amountColorClass).toBe('text-red-600')
      expect(wrapper.vm.formattedAmount).toMatch(/^- .*R\$.*50,00/)
    })

    it('deve funcionar como item de receita típico', () => {
      const wrapper = factory({
        title: 'Salário',
        subtitle: 'Receita • 25/08/2025',
        amount: 2500,
        type: 'income',
      })

      expect(wrapper.props('title')).toBe('Salário')
      expect(wrapper.props('subtitle')).toBe('Receita • 25/08/2025')
      expect(wrapper.vm.amountColorClass).toBe('text-green-600')
      expect(wrapper.vm.formattedAmount).toMatch(/^\+ .*R\$.*2\.500,00/)
    })

    it('deve funcionar como item neutro sem ações', () => {
      const wrapper = factory({
        title: 'Transferência',
        subtitle: 'Conta corrente • 26/08/2025',
        amount: 1000,
        type: 'neutral',
        showActions: false,
      })

      expect(wrapper.props('type')).toBe('neutral')
      expect(wrapper.props('showActions')).toBe(false)
      expect(wrapper.vm.amountColorClass).toBe('text-gray-900')
      expect(wrapper.vm.formattedAmount).not.toMatch(/^[+-] /)
    })
  })

  describe('Formatação Avançada', () => {
    describe('Múltiplas Moedas', () => {
      it('deve formatar corretamente para cada tipo de moeda', () => {
        const currencies = [
          { currency: 'USD', locale: 'en-US', symbol: '$' },
          { currency: 'EUR', locale: 'de-DE', symbol: '€' },
          { currency: 'GBP', locale: 'en-GB', symbol: '£' },
        ]

        currencies.forEach(({ currency, locale, symbol }) => {
          const wrapper = factory({
            amount: 1000,
            type: 'income',
            currency,
            locale,
          })

          expect(wrapper.vm.formattedAmount).toContain(symbol)
          expect(wrapper.vm.formattedAmount).toContain('+ ')
        })
      })
    })

    describe('Diferentes Locales para BRL', () => {
      it('deve formatar BRL em diferentes locales', () => {
        const wrapper = factory({
          amount: 1500,
          type: 'expense',
          currency: 'BRL',
          locale: 'pt-BR',
        })

        const formatted = wrapper.vm.formattedAmount
        expect(formatted).toContain('- ')
        expect(formatted).toContain('R$')
        expect(formatted).toContain('1.500,00')
      })
    })
  })
})
