import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FormTextarea from '../../../../src/components/shared/form/FormTextarea.vue'

describe('Given a FormTextarea component', () => {
  describe('When rendered with required props', () => {
    const wrapper = shallowMount(FormTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
      },
    })

    it('Then it should display the label', () => {
      expect(wrapper.find('label').text()).toBe('Test Label')
    })

    it('Then it should have the correct id', () => {
      expect(wrapper.find('textarea').attributes('id')).toBe('test-textarea')
    })

    it('Then it should have the default rows', () => {
      expect(wrapper.find('textarea').attributes('rows')).toBe('4')
    })

    it('Then it should not display an error message', () => {
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })
  })

  describe('When rendered with custom rows', () => {
    const wrapper = shallowMount(FormTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        rows: 6,
      },
    })

    it('Then it should have the correct number of rows', () => {
      expect(wrapper.find('textarea').attributes('rows')).toBe('6')
    })
  })

  describe('When rendered with a placeholder', () => {
    const wrapper = shallowMount(FormTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        placeholder: 'Enter description here',
      },
    })

    it('Then it should display the placeholder', () => {
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter description here')
    })
  })

  describe('When rendered with an error message', () => {
    const wrapper = shallowMount(FormTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        error: 'This field is required',
      },
    })

    it('Then it should display the error message', () => {
      expect(wrapper.find('.text-red-600').text()).toBe('This field is required')
    })

    it('Then it should have error styling', () => {
      expect(wrapper.find('textarea').classes()).toContain('border-red-300')
    })
  })

  describe('When the textarea value changes', () => {
    const wrapper = shallowMount(FormTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
      },
    })

    it('Then it should emit update:modelValue event', async () => {
      await wrapper.find('textarea').setValue('new description')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new description'])
    })
  })
})
