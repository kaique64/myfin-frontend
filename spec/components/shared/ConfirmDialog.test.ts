/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ConfirmDialog from '../../../src/components/shared/ConfirmDialog.vue'

interface ConfirmDialogProps {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
}

const factory = (props: Partial<ConfirmDialogProps> = {}) => {
  const defaultProps: ConfirmDialogProps = {
    title: 'Confirm',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'primary',
  }

  return mount(ConfirmDialog, {
    props: { ...defaultProps, ...props },
    attachTo: document.body,
  })
}

describe('Given a ConfirmDialog component', () => {
  describe('When rendered with default props', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should not be visible initially', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('Then it should have default title', () => {
      expect((wrapper.vm as any).title).toBe('Confirm')
    })

    it('Then it should have default message', () => {
      expect((wrapper.vm as any).message).toBe('Are you sure you want to proceed?')
    })

    it('Then it should have default button texts', () => {
      expect((wrapper.vm as any).confirmText).toBe('Confirm')
      expect((wrapper.vm as any).cancelText).toBe('Cancel')
    })

    it('Then it should have primary variant by default', () => {
      expect((wrapper.vm as any).variant).toBe('primary')
    })
  })

  describe('When rendered with custom props', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory({
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        confirmText: 'Delete',
        cancelText: 'Keep',
        variant: 'danger',
      })
    })

    it('Then it should have custom title', () => {
      expect((wrapper.vm as any).title).toBe('Delete Item')
    })

    it('Then it should have custom message', () => {
      expect((wrapper.vm as any).message).toBe('Are you sure you want to delete this item?')
    })

    it('Then it should have custom button texts', () => {
      expect((wrapper.vm as any).confirmText).toBe('Delete')
      expect((wrapper.vm as any).cancelText).toBe('Keep')
    })

    it('Then it should have danger variant', () => {
      expect((wrapper.vm as any).variant).toBe('danger')
    })
  })

  describe('When open method is called', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory()
      wrapper.vm.open()
      await wrapper.vm.$nextTick()
    })

    it('Then it should be visible', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    })

    it('Then it should display the title', () => {
      expect(wrapper.find('h3').text()).toBe('Confirm')
    })

    it('Then it should display the message', () => {
      expect(wrapper.find('p').text()).toBe('Are you sure you want to proceed?')
    })

    it('Then it should display both buttons', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(2)
      expect(buttons[0].text()).toBe('Cancel')
      expect(buttons[1].text()).toBe('Confirm')
    })

    it('Then it should have primary styling for confirm button', () => {
      const confirmButton = wrapper.findAll('button')[1]
      expect(confirmButton.classes()).toContain('bg-blue-600')
    })
  })

  describe('When open method is called with danger variant', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory({ variant: 'danger' })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()
    })

    it('Then it should have danger styling for confirm button', () => {
      const confirmButton = wrapper.findAll('button')[1]
      expect(confirmButton.classes()).toContain('bg-red-600')
    })
  })

  describe('When confirm button is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let openPromise: Promise<boolean>
    let result: boolean | undefined

    beforeEach(async () => {
      wrapper = factory()
      openPromise = wrapper.vm.open()

      openPromise.then((value) => {
        result = value
      })

      await wrapper.vm.$nextTick()

      const confirmButton = wrapper.findAll('button')[1]
      await confirmButton.trigger('click')

      await flushPromises()
    })

    it('Then it should resolve the promise with true', () => {
      expect(result).toBe(true)
    })

    it('Then it should close the dialog', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('When cancel button is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let openPromise: Promise<boolean>
    let result: boolean | undefined

    beforeEach(async () => {
      wrapper = factory()
      openPromise = wrapper.vm.open()

      openPromise.then((value) => {
        result = value
      })

      await wrapper.vm.$nextTick()

      const cancelButton = wrapper.findAll('button')[0]
      await cancelButton.trigger('click')

      await flushPromises()
    })

    it('Then it should resolve the promise with false', () => {
      expect(result).toBe(false)
    })

    it('Then it should close the dialog', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('When backdrop is clicked', () => {
    let wrapper: ReturnType<typeof factory>
    let openPromise: Promise<boolean>
    let result: boolean | undefined

    beforeEach(async () => {
      wrapper = factory()
      openPromise = wrapper.vm.open()

      openPromise.then((value) => {
        result = value
      })

      await wrapper.vm.$nextTick()

      const backdrop = wrapper.find('#backdrop')
      await backdrop.trigger('click')

      await flushPromises()
    })

    it('Then it should resolve the promise with false', () => {
      expect(result).toBe(false)
    })

    it('Then it should close the dialog', () => {
      expect(wrapper.find('#backdrop').exists()).toBe(false)
    })
  })

  describe('When multiple dialogs are opened and closed', () => {
    let wrapper: ReturnType<typeof factory>
    const results: boolean[] = []

    beforeEach(async () => {
      wrapper = factory()

      const promise1 = wrapper.vm.open()
      promise1.then((value) => results.push(value))
      await wrapper.vm.$nextTick()

      const confirmButton = wrapper.findAll('button')[1]
      await confirmButton.trigger('click')
      await flushPromises()

      const promise2 = wrapper.vm.open()
      promise2.then((value) => results.push(value))
      await wrapper.vm.$nextTick()

      const cancelButton = wrapper.findAll('button')[0]
      await cancelButton.trigger('click')
      await flushPromises()
    })

    it('Then it should resolve each promise correctly', () => {
      expect(results).toEqual([true, false])
    })
  })

  describe('When dialog is opened with different messages', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should display the first message', async () => {
      wrapper.setProps({ message: 'First message' })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('p').text()).toBe('First message')
    })

    it('Then it should update to display the second message', async () => {
      wrapper.setProps({ message: 'Second message' })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('p').text()).toBe('Second message')
    })
  })

  describe('When dialog is opened with different titles', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should display the updated title', async () => {
      wrapper.setProps({ title: 'New Title' })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('h3').text()).toBe('New Title')
    })
  })

  describe('When dialog is opened with different button texts', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory({
        confirmText: 'Yes',
        cancelText: 'No',
      })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()
    })

    it('Then it should display the custom button texts', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons[0].text()).toBe('No')
      expect(buttons[1].text()).toBe('Yes')
    })
  })

  describe('When dialog is opened and closed programmatically', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should update isOpen state correctly', async () => {
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
      ;(wrapper.vm as any).confirm()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('When dialog is opened and closed with internal methods', () => {
    let wrapper: ReturnType<typeof factory>
    let result: boolean | undefined

    beforeEach(async () => {
      wrapper = factory()
      const openPromise = wrapper.vm.open()

      openPromise.then((value) => {
        result = value
      })

      await wrapper.vm.$nextTick()
      ;(wrapper.vm as any).confirm()
      await flushPromises()
    })

    it('Then it should resolve the promise with true', () => {
      expect(result).toBe(true)
    })

    it('Then it should close the dialog', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('When dialog is opened with long content', () => {
    let wrapper: ReturnType<typeof factory>

    beforeEach(async () => {
      wrapper = factory({
        title: 'Very Long Title That Might Wrap to Multiple Lines',
        message:
          'This is a very long message that contains a lot of text and might wrap to multiple lines. It should still be displayed correctly within the dialog without breaking the layout.',
      })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()
    })

    it('Then it should display the full title', () => {
      expect(wrapper.find('h3').text()).toBe('Very Long Title That Might Wrap to Multiple Lines')
    })

    it('Then it should display the full message', () => {
      expect(wrapper.find('p').text()).toBe(
        'This is a very long message that contains a lot of text and might wrap to multiple lines. It should still be displayed correctly within the dialog without breaking the layout.',
      )
    })
  })
})
