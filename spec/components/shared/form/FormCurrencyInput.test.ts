import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FormCurrencyInput from '../../../../src/components/shared/form/FormCurrencyInput.vue'

describe('Given a FormCurrencyInput component', () => {
  describe('When rendered with required props', () => {
    const wrapper = shallowMount(FormCurrencyInput, {
      props: {
        id: 'test-currency',
        label: 'Test Label',
        modelValue: 0,
      },
    })

    it('Then it should display the label', () => {
      expect(wrapper.find('label').text()).toBe('Test Label')
    })

    it('Then it should have the correct id', () => {
      expect(wrapper.find('input').attributes('id')).toBe('test-currency')
    })

    it('Then it should not display an error message', () => {
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })
  })

  describe('When rendered with a non-zero value', () => {
    const wrapper = shallowMount(FormCurrencyInput, {
      props: {
        id: 'test-currency',
        label: 'Test Label',
        modelValue: 123.45,
      },
    })

    it('Then it should display the formatted value', () => {
      expect(wrapper.find('input').element.value).toContain('123,45')
    })
  })

  describe('When rendered with a placeholder', () => {
    const wrapper = shallowMount(FormCurrencyInput, {
      props: {
        id: 'test-currency',
        label: 'Test Label',
        modelValue: 0,
        placeholder: 'Enter amount here',
      },
    })

    it('Then it should display the placeholder', () => {
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter amount here')
    })
  })

  describe('When rendered with an error message', () => {
    const wrapper = shallowMount(FormCurrencyInput, {
      props: {
        id: 'test-currency',
        label: 'Test Label',
        modelValue: 0,
        error: 'This field is required',
      },
    })

    it('Then it should display the error message', () => {
      expect(wrapper.find('.text-red-600').text()).toBe('This field is required')
    })

    it('Then it should have error styling', () => {
      expect(wrapper.find('input').classes()).toContain('border-red-300')
    })
  })

  describe('When the input value changes', () => {
    const wrapper = shallowMount(FormCurrencyInput, {
      props: {
        id: 'test-currency',
        label: 'Test Label',
        modelValue: 0,
      },
    })

    it('Then it should emit update:modelValue event', async () => {
      const input = wrapper.find('input').element

      // Mock the input event with a value
      const mockEvent = {
        target: {
          value: '123',
        },
      }

      // Call the handleInput method directly
      await wrapper.vm.handleInput(mockEvent as any)

      // Check that the update:modelValue event was emitted with the correct value
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe(1.23)
    })
  })

  describe('When the blur event is triggered', () => {
    const wrapper = shallowMount(FormCurrencyInput, {
      props: {
        id: 'test-currency',
        label: 'Test Label',
        modelValue: 0,
      },
    })

    it('Then it should emit blur event', async () => {
      await wrapper.find('input').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })
})
