/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RegisterTransactionModal from '../../../src/components/transaction/RegisterTransactionModal.vue'

const resetFormMock = vi.fn()

vi.mock('vee-validate', () => ({
  useForm: () => ({
    handleSubmit: vi.fn((callback) => callback),
    defineField: () => ['', {}],
    errors: {},
    setFieldValue: vi.fn(),
    resetForm: resetFormMock,
  }),
}))

vi.mock('@vee-validate/zod', () => ({
  toTypedSchema: vi.fn(),
}))

const factory = () => {
  return mount(RegisterTransactionModal, {
    global: {
      stubs: {
        Title: true,
        Divider: true,
        Button: true,
      },
    },
    attachTo: document.body,
  })
}

describe('Given a RegisterTransactionModal component', () => {
  describe('When rendered initially', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should not be visible', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('When open method is called', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      resetFormMock.mockClear()

      wrapper = factory()
      wrapper.vm.open()
      await wrapper.vm.$nextTick()
    })

    it('Then it should be visible', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    })

    it('Then it should reset the form', () => {
      expect(resetFormMock).toHaveBeenCalled()
    })

    it('Then it should display the transaction form', () => {
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('Then it should display the title', () => {
      expect(wrapper.findComponent({ name: 'Title' }).exists()).toBe(true)
    })

    it('Then it should display form fields', () => {
      expect(wrapper.find('input#title').exists()).toBe(true)
      expect(wrapper.find('input#value').exists()).toBe(true)
      expect(wrapper.find('select#type').exists()).toBe(true)
      expect(wrapper.find('select#category').exists()).toBe(true)
      expect(wrapper.find('select#paymentMethod').exists()).toBe(true)
      expect(wrapper.find('input#date').exists()).toBe(true)
      expect(wrapper.find('textarea#description').exists()).toBe(true)
    })

    it('Then it should display action buttons', () => {
      const buttons = wrapper.findAllComponents({ name: 'Button' })
      expect(buttons.length).toBe(2)
    })
  })

  describe('When close method is called', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      wrapper.vm.close()
      await wrapper.vm.$nextTick()
    })

    it('Then it should not be visible', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('When cancel button is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let cancelSpy: any

    beforeEach(async () => {
      wrapper = factory()
      cancelSpy = vi.spyOn(wrapper.vm as any, 'cancel')

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      const cancelButton = wrapper.findAllComponents({ name: 'Button' }).at(0)
      await cancelButton?.vm.$emit('click')
    })

    it('Then it should call cancel method', () => {
      expect(cancelSpy).toHaveBeenCalled()
    })
  })

  describe('When form is submitted', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
    })

    it('Then it should emit submit event', () => {
      expect(wrapper.emitted('submit')).toEqual([
        [
          {
            amount: 0,
            category: undefined,
            date: undefined,
            description: '',
            paymentMethod: undefined,
            title: undefined,
            type: 'submit',
          },
        ],
      ])
    })
  })

  describe('When backdrop is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let cancelSpy: any

    beforeEach(async () => {
      wrapper = factory()
      cancelSpy = vi.spyOn(wrapper.vm as any, 'cancel')

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      await wrapper.find('#backdrop').trigger('click')
    })

    it('Then it should call cancel method', () => {
      expect(cancelSpy).toHaveBeenCalled()
    })
  })

  describe('When Escape key is pressed while modal is open', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      await flushPromises()
    })

    it('Then it should call cancel method', () => {
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })

  describe('When a non-Escape key is pressed while modal is open', () => {
    let wrapper: ReturnType<typeof factory>
    let cancelSpy: any

    beforeEach(async () => {
      wrapper = factory()
      cancelSpy = vi.spyOn(wrapper.vm as any, 'cancel')

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)

      await flushPromises()
    })

    it('Then it should not call cancel method', () => {
      expect(cancelSpy).not.toHaveBeenCalled()
    })
  })

  describe('When modal is closed and Escape key is pressed', () => {
    let wrapper: ReturnType<typeof factory>
    let cancelSpy: any

    beforeEach(async () => {
      wrapper = factory()
      cancelSpy = vi.spyOn(wrapper.vm as any, 'cancel')

      await wrapper.vm.$nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      await flushPromises()
    })

    it('Then it should not call cancel method', () => {
      expect(cancelSpy).not.toHaveBeenCalled()
    })
  })

  describe('When component is unmounted with event listeners', () => {
    let wrapper: ReturnType<typeof factory>
    let removeEventListenerSpy: any

    beforeEach(async () => {
      removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      wrapper = factory()
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      wrapper.unmount()
    })

    it('Then it should clean up event listeners', () => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})
