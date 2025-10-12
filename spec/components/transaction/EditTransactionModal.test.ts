/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import EditTransactionModal from '../../../src/components/transaction/EditTransactionModal.vue'
import type { TransactionDTO } from '../../../src/shared/types/transaction'

const resetFormMock = vi.fn()
const setValuesMock = vi.fn()

const defineFieldMock = vi.fn((fieldName) => {
  if (fieldName === 'amount') {
    return [0, {}]
  }
  return ['', {}]
})

vi.mock('vee-validate', () => ({
  useForm: () => ({
    handleSubmit: vi.fn((callback) => callback),
    defineField: defineFieldMock,
    errors: {},
    setFieldValue: vi.fn(),
    resetForm: resetFormMock,
    setValues: setValuesMock,
  }),
}))

vi.mock('@vee-validate/zod', () => ({
  toTypedSchema: vi.fn(),
}))

const mockTransaction: TransactionDTO = {
  id: '123',
  title: 'Test Transaction',
  amount: 100,
  type: 'expense',
  category: 'food',
  paymentMethod: 'cash',
  date: '01/01/2023',
  description: 'Test description',
  currency: 'BRL',
  timestamp: 1672531200000,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

const factory = () => {
  return shallowMount(EditTransactionModal, {
    global: {
      stubs: {
        Title: true,
        Divider: true,
        Button: true,
        FormInput: true,
        FormSelect: true,
        FormTextarea: true,
        FormCurrencyInput: true,
      },
    },
    attachTo: document.body,
  })
}

describe('Given an EditTransactionModal component', () => {
  describe('When rendered initially', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should not be visible', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('When open method is called with a transaction', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      resetFormMock.mockClear()
      setValuesMock.mockClear()

      wrapper = factory()
      wrapper.vm.open(mockTransaction)
      await wrapper.vm.$nextTick()
    })

    it('Then it should be visible', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    })

    it('Then it should reset the form', () => {
      expect(resetFormMock).toHaveBeenCalled()
    })

    it('Then it should set form values from the transaction', () => {
      expect(setValuesMock).toHaveBeenCalledWith({
        title: mockTransaction.title,
        amount: mockTransaction.amount,
        type: mockTransaction.type,
        category: mockTransaction.category,
        paymentMethod: mockTransaction.paymentMethod,
        date: mockTransaction.date,
        description: mockTransaction.description,
      })
    })

    it('Then it should display the transaction form', () => {
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('Then it should display the title', () => {
      expect(wrapper.findComponent({ name: 'Title' }).exists()).toBe(true)
    })

    it('Then it should display form fields', () => {
      expect(wrapper.findComponent({ name: 'FormInput', props: { id: 'title' } }).exists()).toBe(
        true,
      )
      expect(
        wrapper.findComponent({ name: 'FormCurrencyInput', props: { id: 'value' } }).exists(),
      ).toBe(true)
      expect(wrapper.findComponent({ name: 'FormSelect', props: { id: 'type' } }).exists()).toBe(
        true,
      )
      expect(
        wrapper.findComponent({ name: 'FormSelect', props: { id: 'category' } }).exists(),
      ).toBe(true)
      expect(
        wrapper.findComponent({ name: 'FormSelect', props: { id: 'paymentMethod' } }).exists(),
      ).toBe(true)
      expect(wrapper.findComponent({ name: 'FormInput', props: { id: 'date' } }).exists()).toBe(
        true,
      )
      expect(
        wrapper.findComponent({ name: 'FormTextarea', props: { id: 'description' } }).exists(),
      ).toBe(true)
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
      wrapper.vm.open(mockTransaction)
      await wrapper.vm.$nextTick()

      wrapper.vm.close()
      await wrapper.vm.$nextTick()
    })

    it('Then it should not be visible', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('Then it should clear the current transaction', () => {
      expect((wrapper.vm as any).currentTransaction).toBe(null)
    })
  })

  describe('When cancel button is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let cancelSpy: any

    beforeEach(async () => {
      wrapper = factory()
      cancelSpy = vi.spyOn(wrapper.vm as any, 'cancel')

      wrapper.vm.open(mockTransaction)
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

      wrapper.vm.open(mockTransaction)
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
    })

    it('Then it should emit submit event with transaction data including id', () => {
      expect(wrapper.emitted('submit')).toEqual([
        [
          {
            id: mockTransaction.id,
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

  describe('When form is submitted without a current transaction', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()

      wrapper.vm.isOpen = true
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
    })

    it('Then it should not emit submit event', () => {
      expect(wrapper.emitted('submit')).toBeFalsy()
    })
  })

  describe('When backdrop is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let cancelSpy: any

    beforeEach(async () => {
      wrapper = factory()
      cancelSpy = vi.spyOn(wrapper.vm as any, 'cancel')

      wrapper.vm.open(mockTransaction)
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

      wrapper.vm.open(mockTransaction)
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

      wrapper.vm.open(mockTransaction)
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
      wrapper.vm.open(mockTransaction)
      await wrapper.vm.$nextTick()

      wrapper.unmount()
    })

    it('Then it should clean up event listeners', () => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})
