import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FormInput from '../../../../src/components/shared/form/FormInput.vue'

describe('Given a FormInput component', () => {
  describe('When rendered with required props', () => {
    const wrapper = shallowMount(FormInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
    })

    it('Then it should display the label', () => {
      expect(wrapper.find('label').text()).toBe('Test Label')
    })

    it('Then it should have the correct id', () => {
      expect(wrapper.find('input').attributes('id')).toBe('test-input')
    })

    it('Then it should have the default type of text', () => {
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('Then it should not display an error message', () => {
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })
  })

  describe('When rendered with a custom type', () => {
    const wrapper = shallowMount(FormInput, {
      props: {
        id: 'date-input',
        label: 'Date',
        modelValue: '',
        type: 'date',
      },
    })

    it('Then it should have the correct type', () => {
      expect(wrapper.find('input').attributes('type')).toBe('date')
    })
  })

  describe('When rendered with a placeholder', () => {
    const wrapper = shallowMount(FormInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
        placeholder: 'Enter value here',
      },
    })

    it('Then it should display the placeholder', () => {
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter value here')
    })
  })

  describe('When rendered with an error message', () => {
    const wrapper = shallowMount(FormInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
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
    const wrapper = shallowMount(FormInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
    })

    it('Then it should emit update:modelValue event', async () => {
      await wrapper.find('input').setValue('new value')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
    })
  })
})
