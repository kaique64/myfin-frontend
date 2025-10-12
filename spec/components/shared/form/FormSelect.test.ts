import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FormSelect from '../../../../src/components/shared/form/FormSelect.vue'

describe('Given a FormSelect component', () => {
  describe('When rendered with required props', () => {
    const wrapper = shallowMount(FormSelect, {
      props: {
        id: 'test-select',
        label: 'Test Label',
        modelValue: '',
      },
      slots: {
        default: `
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        `,
      },
    })

    it('Then it should display the label', () => {
      expect(wrapper.find('label').text()).toBe('Test Label')
    })

    it('Then it should have the correct id', () => {
      expect(wrapper.find('select').attributes('id')).toBe('test-select')
    })

    it('Then it should render the options', () => {
      expect(wrapper.findAll('option').length).toBe(2)
      expect(wrapper.findAll('option')[0].text()).toBe('Option 1')
      expect(wrapper.findAll('option')[1].text()).toBe('Option 2')
    })

    it('Then it should not display an error message', () => {
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })
  })

  describe('When rendered with an error message', () => {
    const wrapper = shallowMount(FormSelect, {
      props: {
        id: 'test-select',
        label: 'Test Label',
        modelValue: '',
        error: 'This field is required',
      },
      slots: {
        default: `
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        `,
      },
    })

    it('Then it should display the error message', () => {
      expect(wrapper.find('.text-red-600').text()).toBe('This field is required')
    })

    it('Then it should have error styling', () => {
      expect(wrapper.find('select').classes()).toContain('border-red-300')
    })
  })

  describe('When the select value changes', () => {
    const wrapper = shallowMount(FormSelect, {
      props: {
        id: 'test-select',
        label: 'Test Label',
        modelValue: '',
      },
      slots: {
        default: `
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        `,
      },
    })

    it('Then it should emit update:modelValue event', async () => {
      await wrapper.find('select').setValue('option2')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option2'])
    })
  })
})
