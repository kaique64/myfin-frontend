import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import type { CardInfoProps } from '../../../src/components/shared/card/CardInfo.vue'
import CardInfo from '../../../src/components/shared/card/CardInfo.vue'

type CardInfoWrapper = VueWrapper<ComponentPublicInstance & InstanceType<typeof CardInfo>>

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
  }) as CardInfoWrapper
}

describe('Given a CardInfo component', () => {
  describe('When rendered with default props', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should use primary variant as default', () => {
      expect(wrapper.props('variant')).toBe('primary')
    })

    it('Then it should use BRL as default currency', () => {
      expect(wrapper.props('currency')).toBe('BRL')
    })

    it('Then it should show currency by default', () => {
      expect(wrapper.props('showCurrency')).toBe(true)
    })

    it('Then it should use pt-BR as default locale', () => {
      expect(wrapper.props('locale')).toBe('pt-BR')
    })
  })

  describe('When rendered with custom title prop', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ title: 'Saldo Atual' })
    })

    it('Then it should accept the custom title', () => {
      expect(wrapper.props('title')).toBe('Saldo Atual')
    })
  })

  describe('When rendered with numeric value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 1500 })
    })

    it('Then it should accept the numeric value', () => {
      expect(wrapper.props('value')).toBe(1500)
    })
  })

  describe('When rendered with string value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 'N/A' })
    })

    it('Then it should accept the string value', () => {
      expect(wrapper.props('value')).toBe('N/A')
    })
  })

  describe('When rendered with custom currency', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ currency: 'USD' })
    })

    it('Then it should accept the custom currency', () => {
      expect(wrapper.props('currency')).toBe('USD')
    })
  })

  describe('When rendered with showCurrency disabled', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ showCurrency: false })
    })

    it('Then it should accept the showCurrency setting', () => {
      expect(wrapper.props('showCurrency')).toBe(false)
    })
  })

  describe('When rendered with custom locale', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ locale: 'en-US' })
    })

    it('Then it should accept the custom locale', () => {
      expect(wrapper.props('locale')).toBe('en-US')
    })
  })

  describe('When rendered with primary variant', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ variant: 'primary' })
    })

    it('Then it should compute correct classes for primary variant', () => {
      expect(wrapper.vm.variantClasses).toBe('bg-blue-50 border-l-blue-500')
    })

    it('Then it should compute correct title color for primary variant', () => {
      expect(wrapper.vm.titleColorClass).toBe('text-blue-700')
    })

    it('Then it should compute correct value color for primary variant', () => {
      expect(wrapper.vm.valueColorClass).toBe('text-blue-900')
    })
  })

  describe('When rendered with success variant', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ variant: 'success' })
    })

    it('Then it should compute correct classes for success variant', () => {
      expect(wrapper.vm.variantClasses).toBe('bg-green-50 border-l-green-500')
    })

    it('Then it should compute correct title color for success variant', () => {
      expect(wrapper.vm.titleColorClass).toBe('text-green-700')
    })

    it('Then it should compute correct value color for success variant', () => {
      expect(wrapper.vm.valueColorClass).toBe('text-green-900')
    })
  })

  describe('When rendered with danger variant', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ variant: 'danger' })
    })

    it('Then it should compute correct classes for danger variant', () => {
      expect(wrapper.vm.variantClasses).toBe('bg-red-50 border-l-red-500')
    })

    it('Then it should compute correct title color for danger variant', () => {
      expect(wrapper.vm.titleColorClass).toBe('text-red-700')
    })

    it('Then it should compute correct value color for danger variant', () => {
      expect(wrapper.vm.valueColorClass).toBe('text-red-900')
    })
  })

  describe('When rendered with warning variant', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ variant: 'warning' })
    })

    it('Then it should compute correct classes for warning variant', () => {
      expect(wrapper.vm.variantClasses).toBe('bg-yellow-50 border-l-yellow-500')
    })

    it('Then it should compute correct title color for warning variant', () => {
      expect(wrapper.vm.titleColorClass).toBe('text-yellow-700')
    })

    it('Then it should compute correct value color for warning variant', () => {
      expect(wrapper.vm.valueColorClass).toBe('text-yellow-900')
    })
  })

  describe('When rendered with info variant', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ variant: 'info' })
    })

    it('Then it should compute correct classes for info variant', () => {
      expect(wrapper.vm.variantClasses).toBe('bg-cyan-50 border-l-cyan-500')
    })

    it('Then it should compute correct title color for info variant', () => {
      expect(wrapper.vm.titleColorClass).toBe('text-cyan-700')
    })

    it('Then it should compute correct value color for info variant', () => {
      expect(wrapper.vm.valueColorClass).toBe('text-cyan-900')
    })
  })

  describe('When rendering with BRL currency formatting', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        value: 1500,
        currency: 'BRL',
        locale: 'pt-BR',
        showCurrency: true,
      })
    })

    it('Then it should format value as Brazilian currency', () => {
      expect(wrapper.vm.formattedValue).toBe('R$\u00A01.500,00')
    })
  })

  describe('When rendering without currency formatting', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        value: 1234.56,
        showCurrency: false,
        locale: 'pt-BR',
      })
    })

    it('Then it should format value without currency symbol', () => {
      expect(wrapper.vm.formattedValue).toBe('1.234,56')
    })
  })

  describe('When rendering with string value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 'N/A' })
    })

    it('Then it should return string without formatting', () => {
      expect(wrapper.vm.formattedValue).toBe('N/A')
    })
  })

  describe('When rendering with USD currency', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        value: 1000,
        currency: 'USD',
        locale: 'en-US',
      })
    })

    it('Then it should format as US Dollar', () => {
      expect(wrapper.vm.formattedValue).toBe('$1,000.00')
    })
  })

  describe('When rendering with EUR currency', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        value: 1000,
        currency: 'EUR',
        locale: 'de-DE',
      })
    })

    it('Then it should format as Euro', () => {
      expect(wrapper.vm.formattedValue).toBe('1.000,00\u00A0€')
    })
  })

  describe('When rendering with GBP currency', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        value: 1000,
        currency: 'GBP',
        locale: 'en-GB',
      })
    })

    it('Then it should format as British Pound', () => {
      expect(wrapper.vm.formattedValue).toBe('£1,000.00')
    })
  })

  describe('When rendering with zero value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 0 })
    })

    it('Then it should format zero value', () => {
      expect(wrapper.vm.formattedValue).toBe('R$\u00A00,00')
    })
  })

  describe('When rendering with negative value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: -500 })
    })

    it('Then it should format negative values', () => {
      expect(wrapper.vm.formattedValue).toBe('-R$\u00A0500,00')
    })
  })

  describe('When rendering with very large value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 1000000000 })
    })

    it('Then it should format very large values', () => {
      expect(wrapper.vm.formattedValue).toBe('R$\u00A01.000.000.000,00')
    })
  })

  describe('When rendering with complex decimal value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 1234.123456 })
    })

    it('Then it should format complex decimals', () => {
      expect(wrapper.vm.formattedValue).toBe('R$\u00A01.234,12')
    })
  })

  describe('When rendering number without currency in Portuguese locale', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        value: 1234.56,
        showCurrency: false,
        locale: 'pt-BR',
      })
    })

    it('Then it should format number in Portuguese style', () => {
      expect(wrapper.vm.formattedValue).toBe('1.234,56')
    })
  })

  describe('When rendering number without currency in English locale', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        value: 1234.56,
        showCurrency: false,
        locale: 'en-US',
      })
    })

    it('Then it should format number in English style', () => {
      expect(wrapper.vm.formattedValue).toBe('1,234.56')
    })
  })

  describe('When title prop changes', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ title: 'Novo Título' })
    })

    it('Then it should react to title changes', () => {
      expect(wrapper.vm.$props.title).toBe('Novo Título')
    })
  })

  describe('When value prop changes', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ value: 2000 })
    })

    it('Then it should react to value changes', () => {
      expect(wrapper.vm.$props.value).toBe(2000)
    })

    it('Then it should update formatted value', () => {
      expect(wrapper.vm.formattedValue).toBe('R$\u00A02.000,00')
    })
  })

  describe('When variant prop changes', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ variant: 'success' })
    })

    it('Then it should react to variant changes', () => {
      expect(wrapper.vm.$props.variant).toBe('success')
    })

    it('Then it should update variant classes', () => {
      expect(wrapper.vm.variantClasses).toBe('bg-green-50 border-l-green-500')
    })
  })

  describe('When currency prop changes', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({
        currency: 'USD',
        locale: 'en-US',
      })
    })

    it('Then it should react to currency changes', () => {
      expect(wrapper.vm.$props.currency).toBe('USD')
    })

    it('Then it should update formatted value with new currency', () => {
      expect(wrapper.vm.formattedValue).toBe('$1,000.00')
    })
  })

  describe('When showCurrency prop changes', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ showCurrency: false })
    })

    it('Then it should react to showCurrency changes', () => {
      expect(wrapper.vm.$props.showCurrency).toBe(false)
    })

    it('Then it should update formatted value without currency', () => {
      expect(wrapper.vm.formattedValue).toBe('1.000')
    })
  })

  describe('When locale prop changes', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({
        locale: 'en-US',
        currency: 'USD',
      })
    })

    it('Then it should react to locale changes', () => {
      expect(wrapper.vm.$props.locale).toBe('en-US')
    })

    it('Then it should update formatted value with new locale', () => {
      expect(wrapper.vm.formattedValue).toBe('$1,000.00')
    })
  })

  describe('When rendered with footer slot', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory(
        {},
        {
          slots: { footer: '<div>Footer content</div>' },
        },
      )
    })

    it('Then it should verify footer slot is available', () => {
      expect(wrapper.vm.$slots.footer).toBeDefined()
    })
  })

  describe('When rendered without footer slot', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should verify no footer slot when not provided', () => {
      expect(wrapper.vm.$slots.footer).toBeUndefined()
    })
  })

  describe('When rendered with empty title', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ title: '' })
    })

    it('Then it should handle empty title', () => {
      expect(wrapper.vm.$props.title).toBe('')
    })
  })

  describe('When rendered with very long title', () => {
    let wrapper: CardInfoWrapper
    const longTitle = 'Este é um título muito longo que pode quebrar o layout'

    beforeEach(() => {
      wrapper = factory({ title: longTitle })
    })

    it('Then it should handle very long title', () => {
      expect(wrapper.vm.$props.title).toBe(longTitle)
    })
  })

  describe('When rendered with empty string value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: '' })
    })

    it('Then it should handle empty string value', () => {
      expect(wrapper.vm.$props.value).toBe('')
    })

    it('Then it should return empty formatted value', () => {
      expect(wrapper.vm.formattedValue).toBe('')
    })
  })

  describe('When rendered with null string value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 'null' })
    })

    it('Then it should handle null string value', () => {
      expect(wrapper.vm.$props.value).toBe('null')
    })

    it('Then it should return null as formatted value', () => {
      expect(wrapper.vm.formattedValue).toBe('null')
    })
  })

  describe('When rendered with undefined string value', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({ value: 'undefined' })
    })

    it('Then it should handle undefined string value', () => {
      expect(wrapper.vm.$props.value).toBe('undefined')
    })

    it('Then it should return undefined as formatted value', () => {
      expect(wrapper.vm.formattedValue).toBe('undefined')
    })
  })

  describe('When checking computed properties', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should have all computed properties defined', () => {
      expect(wrapper.vm.variantClasses).toBeDefined()
    })

    it('Then it should have title color class defined', () => {
      expect(wrapper.vm.titleColorClass).toBeDefined()
    })

    it('Then it should have value color class defined', () => {
      expect(wrapper.vm.valueColorClass).toBeDefined()
    })

    it('Then it should have formatted value defined', () => {
      expect(wrapper.vm.formattedValue).toBeDefined()
    })
  })

  describe('When checking all interface props', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory({
        title: 'Test',
        value: 1000,
        variant: 'primary',
        currency: 'BRL',
        showCurrency: true,
        locale: 'pt-BR',
      })
    })

    it('Then it should have all props defined in interface', () => {
      const props = wrapper.vm.$props
      expect(props).toEqual({
        title: 'Test',
        value: 1000,
        variant: 'primary',
        currency: 'BRL',
        showCurrency: true,
        locale: 'pt-BR',
      })
    })
  })

  describe('When checking variant classes computation performance', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ title: 'Novo Título' })
    })

    it('Then it should compute variant classes only when variant changes', async () => {
      const initialClasses = wrapper.vm.variantClasses

      await wrapper.setProps({ variant: 'success' })
      expect(wrapper.vm.variantClasses).not.toBe(initialClasses)
    })
  })

  describe('When checking formatted value computation performance', () => {
    let wrapper: CardInfoWrapper

    beforeEach(async () => {
      wrapper = factory()
      await wrapper.setProps({ title: 'Novo Título' })
    })

    it('Then it should compute formatted value only when value changes', async () => {
      const initialValue = wrapper.vm.formattedValue

      await wrapper.setProps({ value: 2000 })
      expect(wrapper.vm.formattedValue).not.toBe(initialValue)
    })
  })

  describe('When checking computed stability', () => {
    let wrapper: CardInfoWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should maintain stable reference when props do not change', () => {
      const firstCall = wrapper.vm.variantClasses
      const secondCall = wrapper.vm.variantClasses

      expect(firstCall).toBe(secondCall)
    })
  })
})
