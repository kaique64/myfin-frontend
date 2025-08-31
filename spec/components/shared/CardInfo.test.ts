/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import CardInfo from '../../../src/components/shared/CardInfo.vue'
import type { CardInfoProps } from '../../../src/components/shared/CardInfo.vue'

const factory = (
  props: Partial<CardInfoProps> = {},
  options: { slots?: Record<string, string> } = {},
) => {
  const defaultProps: CardInfoProps = {
    title: 'Test Title',
    value: 1000,
    variant: 'primary',
    currency: 'BRL',
    showCurrency: true,
    locale: 'pt-BR',
  }

  return mount(CardInfo, {
    props: { ...defaultProps, ...props },
    slots: options.slots,
    shallow: true,
  })
}

describe('CardInfo', () => {
  describe('Props e Valores Computados', () => {
    it('deve aceitar título como prop', () => {
      const wrapper = factory({ title: 'Saldo Atual' })

      expect(wrapper.props('title')).toBe('Saldo Atual')
    })

    it('deve aceitar valor numérico como prop', () => {
      const wrapper = factory({ value: 1500 })

      expect(wrapper.props('value')).toBe(1500)
    })

    it('deve aceitar valor string como prop', () => {
      const wrapper = factory({ value: 'N/A' })

      expect(wrapper.props('value')).toBe('N/A')
    })

    it('deve usar variant primary como padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('variant')).toBe('primary')
    })

    it('deve aceitar currency como prop', () => {
      const wrapper = factory({ currency: 'USD' })

      expect(wrapper.props('currency')).toBe('USD')
    })

    it('deve usar BRL como currency padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('currency')).toBe('BRL')
    })

    it('deve aceitar showCurrency como prop', () => {
      const wrapper = factory({ showCurrency: false })

      expect(wrapper.props('showCurrency')).toBe(false)
    })

    it('deve usar showCurrency true como padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('showCurrency')).toBe(true)
    })

    it('deve aceitar locale como prop', () => {
      const wrapper = factory({ locale: 'en-US' })

      expect(wrapper.props('locale')).toBe('en-US')
    })

    it('deve usar pt-BR como locale padrão', () => {
      const wrapper = factory()

      expect(wrapper.props('locale')).toBe('pt-BR')
    })
  })

  describe('Variantes e Classes Computadas', () => {
    let wrapper: VueWrapper<any>

    describe('Primary Variant', () => {
      beforeEach(() => {
        wrapper = factory({ variant: 'primary' })
      })

      it('deve computar classes corretas para variant primary', () => {
        expect(wrapper.vm.variantClasses).toBe('bg-blue-50 border-l-blue-500')
      })

      it('deve computar cor do título para variant primary', () => {
        expect(wrapper.vm.titleColorClass).toBe('text-blue-700')
      })

      it('deve computar cor do valor para variant primary', () => {
        expect(wrapper.vm.valueColorClass).toBe('text-blue-900')
      })
    })

    describe('Success Variant', () => {
      beforeEach(() => {
        wrapper = factory({ variant: 'success' })
      })

      it('deve computar classes corretas para variant success', () => {
        expect(wrapper.vm.variantClasses).toBe('bg-green-50 border-l-green-500')
      })

      it('deve computar cor do título para variant success', () => {
        expect(wrapper.vm.titleColorClass).toBe('text-green-700')
      })

      it('deve computar cor do valor para variant success', () => {
        expect(wrapper.vm.valueColorClass).toBe('text-green-900')
      })
    })

    describe('Danger Variant', () => {
      beforeEach(() => {
        wrapper = factory({ variant: 'danger' })
      })

      it('deve computar classes corretas para variant danger', () => {
        expect(wrapper.vm.variantClasses).toBe('bg-red-50 border-l-red-500')
      })

      it('deve computar cor do título para variant danger', () => {
        expect(wrapper.vm.titleColorClass).toBe('text-red-700')
      })

      it('deve computar cor do valor para variant danger', () => {
        expect(wrapper.vm.valueColorClass).toBe('text-red-900')
      })
    })

    describe('Warning Variant', () => {
      beforeEach(() => {
        wrapper = factory({ variant: 'warning' })
      })

      it('deve computar classes corretas para variant warning', () => {
        expect(wrapper.vm.variantClasses).toBe('bg-yellow-50 border-l-yellow-500')
      })

      it('deve computar cor do título para variant warning', () => {
        expect(wrapper.vm.titleColorClass).toBe('text-yellow-700')
      })

      it('deve computar cor do valor para variant warning', () => {
        expect(wrapper.vm.valueColorClass).toBe('text-yellow-900')
      })
    })

    describe('Info Variant', () => {
      beforeEach(() => {
        wrapper = factory({ variant: 'info' })
      })

      it('deve computar classes corretas para variant info', () => {
        expect(wrapper.vm.variantClasses).toBe('bg-cyan-50 border-l-cyan-500')
      })

      it('deve computar cor do título para variant info', () => {
        expect(wrapper.vm.titleColorClass).toBe('text-cyan-700')
      })

      it('deve computar cor do valor para variant info', () => {
        expect(wrapper.vm.valueColorClass).toBe('text-cyan-900')
      })
    })
  })

  describe('Formatação de Valores', () => {
    let wrapper: VueWrapper<any>

    describe('Com Formatação de Moeda', () => {
      beforeEach(() => {
        wrapper = factory({
          value: 1500,
          currency: 'BRL',
          locale: 'pt-BR',
          showCurrency: true,
        })
      })

      it('deve formatar valor numérico como moeda brasileira', () => {
        expect(wrapper.vm.formattedValue).toBe('R$\u00A01.500,00')
      })
    })

    describe('Sem Formatação de Moeda', () => {
      beforeEach(() => {
        wrapper = factory({
          value: 1234.56,
          showCurrency: false,
          locale: 'pt-BR',
        })
      })

      it('deve formatar valor numérico sem símbolo de moeda', () => {
        expect(wrapper.vm.formattedValue).toBe('1.234,56')
      })
    })

    describe('Valores String', () => {
      beforeEach(() => {
        wrapper = factory({ value: 'N/A' })
      })

      it('deve retornar string sem formatação', () => {
        expect(wrapper.vm.formattedValue).toBe('N/A')
      })
    })

    describe('Diferentes Moedas e Locales', () => {
      it('deve formatar em dólar americano', () => {
        const wrapper = factory({
          value: 1000,
          currency: 'USD',
          locale: 'en-US',
        })

        expect(wrapper.vm.formattedValue).toBe('$1,000.00')
      })

      it('deve formatar em euro alemão', () => {
        const wrapper = factory({
          value: 1000,
          currency: 'EUR',
          locale: 'de-DE',
        })

        expect(wrapper.vm.formattedValue).toBe('1.000,00\u00A0€')
      })

      it('deve formatar em libra esterlina', () => {
        const wrapper = factory({
          value: 1000,
          currency: 'GBP',
          locale: 'en-GB',
        })

        expect(wrapper.vm.formattedValue).toBe('£1,000.00')
      })
    })

    describe('Valores Extremos', () => {
      it('deve formatar valor zero', () => {
        const wrapper = factory({ value: 0 })

        expect(wrapper.vm.formattedValue).toBe('R$\u00A00,00')
      })

      it('deve formatar valores negativos', () => {
        const wrapper = factory({ value: -500 })

        expect(wrapper.vm.formattedValue).toBe('-R$\u00A0500,00')
      })

      it('deve formatar valores muito grandes', () => {
        const wrapper = factory({ value: 1000000000 })

        expect(wrapper.vm.formattedValue).toBe('R$\u00A01.000.000.000,00')
      })

      it('deve formatar valores decimais complexos', () => {
        const wrapper = factory({ value: 1234.123456 })

        expect(wrapper.vm.formattedValue).toBe('R$\u00A01.234,12')
      })
    })

    describe('Formatação sem Moeda com Diferentes Locales', () => {
      it('deve formatar número sem moeda em português', () => {
        const wrapper = factory({
          value: 1234.56,
          showCurrency: false,
          locale: 'pt-BR',
        })

        expect(wrapper.vm.formattedValue).toBe('1.234,56')
      })

      it('deve formatar número sem moeda em inglês', () => {
        const wrapper = factory({
          value: 1234.56,
          showCurrency: false,
          locale: 'en-US',
        })

        expect(wrapper.vm.formattedValue).toBe('1,234.56')
      })
    })
  })

  describe('Reatividade das Props', () => {
    let wrapper: VueWrapper<any>

    beforeEach(() => {
      wrapper = factory()
    })

    it('deve reagir a mudanças na prop title', async () => {
      await wrapper.setProps({ title: 'Novo Título' })

      expect(wrapper.props('title')).toBe('Novo Título')
    })

    it('deve reagir a mudanças na prop value', async () => {
      await wrapper.setProps({ value: 2000 })

      expect(wrapper.props('value')).toBe(2000)
      expect(wrapper.vm.formattedValue).toBe('R$\u00A02.000,00')
    })

    it('deve reagir a mudanças na prop variant', async () => {
      await wrapper.setProps({ variant: 'success' })

      expect(wrapper.props('variant')).toBe('success')
      expect(wrapper.vm.variantClasses).toBe('bg-green-50 border-l-green-500')
    })

    it('deve reagir a mudanças na prop currency', async () => {
      await wrapper.setProps({
        currency: 'USD',
        locale: 'en-US',
      })

      expect(wrapper.props('currency')).toBe('USD')
      expect(wrapper.vm.formattedValue).toBe('$1,000.00')
    })

    it('deve reagir a mudanças na prop showCurrency', async () => {
      await wrapper.setProps({ showCurrency: false })

      expect(wrapper.props('showCurrency')).toBe(false)
      expect(wrapper.vm.formattedValue).toBe('1.000')
    })

    it('deve reagir a mudanças na prop locale', async () => {
      await wrapper.setProps({
        locale: 'en-US',
        currency: 'USD',
      })

      expect(wrapper.props('locale')).toBe('en-US')
      expect(wrapper.vm.formattedValue).toBe('$1,000.00')
    })
  })

  describe('Slots', () => {
    it('deve verificar se slot footer está disponível', () => {
      const wrapper = factory(
        {},
        {
          slots: { footer: '<div>Footer content</div>' },
        },
      )

      expect(wrapper.vm.$slots.footer).toBeDefined()
    })

    it('deve verificar se não há slot footer quando não fornecido', () => {
      const wrapper = factory()

      expect(wrapper.vm.$slots.footer).toBeUndefined()
    })
  })

  describe('Edge Cases', () => {
    it('deve lidar com título vazio', () => {
      const wrapper = factory({ title: '' })

      expect(wrapper.props('title')).toBe('')
    })

    it('deve lidar com título muito longo', () => {
      const longTitle = 'Este é um título muito longo que pode quebrar o layout'
      const wrapper = factory({ title: longTitle })

      expect(wrapper.props('title')).toBe(longTitle)
    })

    it('deve lidar com string vazia como valor', () => {
      const wrapper = factory({ value: '' })

      expect(wrapper.props('value')).toBe('')
      expect(wrapper.vm.formattedValue).toBe('')
    })

    it('deve lidar com valor null convertido para string', () => {
      const wrapper = factory({ value: 'null' })

      expect(wrapper.props('value')).toBe('null')
      expect(wrapper.vm.formattedValue).toBe('null')
    })

    it('deve lidar com valor undefined convertido para string', () => {
      const wrapper = factory({ value: 'undefined' })

      expect(wrapper.props('value')).toBe('undefined')
      expect(wrapper.vm.formattedValue).toBe('undefined')
    })
  })

  describe('Validação de Interface', () => {
    it('deve ter todas as propriedades computadas definidas', () => {
      const wrapper = factory()

      expect(wrapper.vm.variantClasses).toBeDefined()
      expect(wrapper.vm.titleColorClass).toBeDefined()
      expect(wrapper.vm.valueColorClass).toBeDefined()
      expect(wrapper.vm.formattedValue).toBeDefined()
    })

    it('deve ter todas as props definidas na interface', () => {
      const wrapper = factory({
        title: 'Test',
        value: 1000,
        variant: 'primary',
        currency: 'BRL',
        showCurrency: true,
        locale: 'pt-BR',
      })

      expect(wrapper.props()).toEqual({
        title: 'Test',
        value: 1000,
        variant: 'primary',
        currency: 'BRL',
        showCurrency: true,
        locale: 'pt-BR',
      })
    })
  })

  describe('Performance e Computação', () => {
    let wrapper: VueWrapper<any>

    beforeEach(() => {
      wrapper = factory()
    })

    it('deve computar variantClasses apenas quando variant muda', async () => {
      const initialClasses = wrapper.vm.variantClasses

      await wrapper.setProps({ title: 'Novo Título' })
      expect(wrapper.vm.variantClasses).toBe(initialClasses)

      await wrapper.setProps({ variant: 'success' })
      expect(wrapper.vm.variantClasses).not.toBe(initialClasses)
    })

    it('deve computar formattedValue apenas quando value, currency ou locale mudam', async () => {
      const initialValue = wrapper.vm.formattedValue

      await wrapper.setProps({ title: 'Novo Título' })
      expect(wrapper.vm.formattedValue).toBe(initialValue)

      await wrapper.setProps({ value: 2000 })
      expect(wrapper.vm.formattedValue).not.toBe(initialValue)
    })

    it('deve manter referência estável dos computed quando props não mudam', () => {
      const firstCall = wrapper.vm.variantClasses
      const secondCall = wrapper.vm.variantClasses

      expect(firstCall).toBe(secondCall)
    })
  })
})
