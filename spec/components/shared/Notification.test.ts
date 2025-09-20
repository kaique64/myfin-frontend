import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Notification from '../../../src/components/shared/notification/Notification.vue'

describe('Given a Notification component', () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })
  describe('When rendered with default props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification)
    })

    it('Then it should not be visible by default', () => {
      expect(wrapper.find('div').exists()).toBe(false)
    })
  })

  describe('When rendered with visible prop true', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          message: 'Test notification',
        },
      })
    })

    it('Then it should be visible', () => {
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('Then it should display the message', () => {
      expect(wrapper.text()).toBe('Test notification')
    })

    it('Then it should apply base classes', () => {
      const notificationDiv = wrapper.find('div')
      expect(notificationDiv.classes()).toContain('px-4')
      expect(notificationDiv.classes()).toContain('py-2')
      expect(notificationDiv.classes()).toContain('rounded')
      expect(notificationDiv.classes()).toContain('shadow-lg')
      expect(notificationDiv.classes()).toContain('text-white')
      expect(notificationDiv.classes()).toContain('relative')
      expect(notificationDiv.classes()).toContain('max-w-sm')
      expect(notificationDiv.classes()).toContain('w-full')
    })

    it('Then it should apply primary variant by default', () => {
      const notificationDiv = wrapper.find('div')
      expect(notificationDiv.classes()).toContain('bg-blue-500')
    })

    it('Then it should not apply position styles (managed by container)', () => {
      const element = wrapper.find('div').element as HTMLElement
      // The notification component no longer manages positioning
      // This is now handled by NotificationContainer
      expect(element.style.position).not.toBe('fixed')
    })

    it('Then it should show close button by default', () => {
      const closeButton = wrapper.find('button')
      expect(closeButton.exists()).toBe(true)
    })

    it('Then it should have accessibility attributes on close button', () => {
      const closeButton = wrapper.find('button')
      expect(closeButton.attributes('aria-label')).toBe('Fechar notificação')
    })
  })

  describe('When rendered with slot content', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
        },
        slots: {
          default: '<span class="custom-content">Custom notification</span>',
        },
      })
    })

    it('Then it should render slot content instead of message prop', () => {
      expect(wrapper.html()).toContain('<span class="custom-content">Custom notification</span>')
    })

    it('Then it should find the custom content element', () => {
      expect(wrapper.find('.custom-content').exists()).toBe(true)
    })
  })

  describe('When rendered with different variants', () => {
    const variants = [
      { variant: 'primary', expectedClass: 'bg-blue-500' },
      { variant: 'success', expectedClass: 'bg-green-500' },
      { variant: 'danger', expectedClass: 'bg-red-500' },
      { variant: 'warning', expectedClass: 'bg-yellow-500' },
      { variant: 'info', expectedClass: 'bg-cyan-500' },
    ] as const

    variants.forEach(({ variant, expectedClass }) => {
      describe(`When variant is ${variant}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Notification, {
            props: {
              visible: true,
              variant,
              message: `${variant} notification`,
            },
          })
        })

        it(`Then it should apply ${expectedClass} class`, () => {
          const notificationDiv = wrapper.find('div')
          expect(notificationDiv.classes()).toContain(expectedClass)
        })
      })
    })
  })

  describe('When rendered with different positions', () => {
    const positions = [
      { position: 'top-left', expectedStyle: { top: '1rem', left: '1rem' } },
      { position: 'top-right', expectedStyle: { top: '1rem', right: '1rem' } },
      { position: 'bottom-left', expectedStyle: { bottom: '1rem', left: '1rem' } },
      { position: 'bottom-right', expectedStyle: { bottom: '1rem', right: '1rem' } },
      {
        position: 'top-center',
        expectedStyle: { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
      },
      {
        position: 'bottom-center',
        expectedStyle: { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
      },
    ] as const

    positions.forEach(({ position }) => {
      describe(`When position is ${position}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Notification, {
            props: {
              visible: true,
              position,
              message: `${position} notification`,
            },
          })
        })

        it(`Then positioning is managed by container, not component`, () => {
          const element = wrapper.find('div').element as HTMLElement
          // Positioning is now handled by NotificationContainer
          expect(element.style.position).not.toBe('fixed')
        })
      })
    })
  })

  describe('When rendered with custom class', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          customClass: 'opacity-90 border-2',
          message: 'Custom class notification',
        },
      })
    })

    it('Then it should apply custom classes', () => {
      const notificationDiv = wrapper.find('div')
      expect(notificationDiv.classes()).toContain('opacity-90')
      expect(notificationDiv.classes()).toContain('border-2')
    })

    it('Then it should still apply base classes', () => {
      const notificationDiv = wrapper.find('div')
      expect(notificationDiv.classes()).toContain('px-4')
      expect(notificationDiv.classes()).toContain('py-2')
      expect(notificationDiv.classes()).toContain('rounded')
      expect(notificationDiv.classes()).toContain('shadow-lg')
      expect(notificationDiv.classes()).toContain('text-white')
      expect(notificationDiv.classes()).toContain('relative')
    })
  })

  describe('When rendered with custom transition classes', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          enterActiveClass: 'custom-enter-active',
          enterFromClass: 'custom-enter-from',
          enterToClass: 'custom-enter-to',
          leaveActiveClass: 'custom-leave-active',
          leaveFromClass: 'custom-leave-from',
          leaveToClass: 'custom-leave-to',
          message: 'Custom transition notification',
        },
      })
    })

    it('Then it should pass custom transition classes to Transition component', () => {
      const transition = wrapper.findComponent({ name: 'Transition' })
      expect(transition.props('enterActiveClass')).toBe('custom-enter-active')
      expect(transition.props('enterFromClass')).toBe('custom-enter-from')
      expect(transition.props('enterToClass')).toBe('custom-enter-to')
      expect(transition.props('leaveActiveClass')).toBe('custom-leave-active')
      expect(transition.props('leaveFromClass')).toBe('custom-leave-from')
      expect(transition.props('leaveToClass')).toBe('custom-leave-to')
    })
  })

  describe('When auto-close is enabled', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.useFakeTimers()
      wrapper = mount(Notification, {
        props: {
          visible: true,
          duration: 1000,
          message: 'Auto-close notification',
        },
      })
    })

    it('Then it should emit close event after duration', async () => {
      expect(wrapper.emitted()).not.toHaveProperty('close')

      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted()).toHaveProperty('close')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('Then it should not emit close event before duration', async () => {
      vi.advanceTimersByTime(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted()).not.toHaveProperty('close')
    })
  })

  describe('When auto-close is disabled', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.useFakeTimers()
      wrapper = mount(Notification, {
        props: {
          visible: true,
          duration: 0,
          message: 'No auto-close notification',
        },
      })
    })

    it('Then it should not emit close event', async () => {
      vi.advanceTimersByTime(5000)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted()).not.toHaveProperty('close')
    })
  })

  describe('When rendered with multiple props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          message: 'Complex notification',
          variant: 'success',
          position: 'top-center',
          customClass: 'font-bold text-lg',
        },
      })
    })

    it('Then positioning is managed by container', () => {
      const notificationDiv = wrapper.find('div')
      expect(notificationDiv.classes()).toContain('bg-green-500')
      expect(notificationDiv.classes()).toContain('font-bold')
      expect(notificationDiv.classes()).toContain('text-lg')

      const element = notificationDiv.element as HTMLElement
      expect(element.style.position).not.toBe('fixed')
    })

    it('Then it should display the message', () => {
      expect(wrapper.text()).toBe('Complex notification')
    })
  })

  describe('When visible prop changes from true to false', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          message: 'Disappearing notification',
        },
      })

      await wrapper.setProps({ visible: false })
    })

    it('Then it should not be visible', () => {
      expect(wrapper.find('div').exists()).toBe(false)
    })
  })

  describe('When rendered with empty message and no slot', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          message: '',
        },
      })
    })

    it('Then it should render without content', () => {
      expect(wrapper.text()).toBe('')
    })

    it('Then it should still apply styling classes', () => {
      const notificationDiv = wrapper.find('div')
      expect(notificationDiv.classes()).toContain('px-4')
      expect(notificationDiv.classes()).toContain('py-2')
      expect(notificationDiv.classes()).toContain('rounded')
      expect(notificationDiv.classes()).toContain('bg-blue-500')
      expect(notificationDiv.classes()).toContain('relative')
    })
  })

  describe('When duration prop is negative', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.useFakeTimers()
      wrapper = mount(Notification, {
        props: {
          visible: true,
          duration: -1000,
          message: 'Negative duration notification',
        },
      })
    })

    it('Then it should not emit close event', async () => {
      vi.advanceTimersByTime(5000)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted()).not.toHaveProperty('close')
    })
  })

  describe('When rendered with showCloseButton false', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          message: 'No close button notification',
          showCloseButton: false,
        },
      })
    })

    it('Then it should not show close button', () => {
      const closeButton = wrapper.find('button')
      expect(closeButton.exists()).toBe(false)
    })

    it('Then it should still display the message', () => {
      expect(wrapper.text()).toBe('No close button notification')
    })
  })

  describe('When close button is clicked', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      wrapper = mount(Notification, {
        props: {
          visible: true,
          message: 'Clickable notification',
        },
      })

      const closeButton = wrapper.find('button')
      await closeButton.trigger('click')
    })

    it('Then it should emit close event', () => {
      expect(wrapper.emitted()).toHaveProperty('close')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })
})
