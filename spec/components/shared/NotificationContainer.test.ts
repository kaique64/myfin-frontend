import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref, computed } from 'vue'
import NotificationContainer from '../../../src/components/shared/notification/NotificationContainer.vue'
import { useNotifications } from '../../../src/composables/useNotifications'
import type { NotificationItem } from '../../../src/composables/useNotifications'

vi.mock('../../../src/composables/useNotifications', () => ({
  useNotifications: vi.fn(),
}))

describe('Given a NotificationContainer component', () => {
  let mockNotificationsRef: ReturnType<typeof ref<NotificationItem[]>>
  let mockRemoveNotification: ReturnType<typeof vi.fn>
  let wrapper: VueWrapper

  beforeEach(() => {
    mockNotificationsRef = ref<NotificationItem[]>([])
    mockRemoveNotification = vi.fn()

    vi.mocked(useNotifications).mockReturnValue({
      notifications: computed(() => mockNotificationsRef.value || []),
      removeNotification: mockRemoveNotification,
      addNotification: vi.fn(),
      clearAllNotifications: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      primary: vi.fn(),
    })
  })

  describe('When rendered with no notifications', () => {
    beforeEach(() => {
      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true, // Stub do Teleport para testes
          },
        },
      })
    })

    it('Then it should render without errors', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('Then it should render the main container', () => {
      const container = wrapper.find('.notification-container')
      expect(container.exists()).toBe(true)
    })

    it('Then it should render position containers', () => {
      const positionContainers = wrapper.findAll('div[class*="fixed"]')
      expect(positionContainers.length).toBeGreaterThan(0)
    })

    it('Then it should not render any notifications', () => {
      const notifications = wrapper.findAllComponents({ name: 'Notification' })
      expect(notifications).toHaveLength(0)
    })
  })

  describe('When rendered with notifications in different positions', () => {
    beforeEach(() => {
      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'Top left notification',
          variant: 'success',
          position: 'top-left',
          duration: 3000,
          showCloseButton: true,
        },
        {
          id: '2',
          message: 'Top right notification',
          variant: 'danger',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
        {
          id: '3',
          message: 'Bottom center notification',
          variant: 'info',
          position: 'bottom-center',
          duration: 3000,
          showCloseButton: true,
        },
      ]

      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should render all notifications', () => {
      const notifications = wrapper.findAllComponents({ name: 'Notification' })
      expect(notifications).toHaveLength(3)
    })

    it('Then it should pass correct props to notifications', () => {
      const notifications = wrapper.findAllComponents({ name: 'Notification' })

      expect(notifications[0].props()).toMatchObject({
        visible: true,
        message: 'Top left notification',
        variant: 'success',
        position: 'top-left',
        duration: 3000,
        showCloseButton: true,
      })

      expect(notifications[1].props()).toMatchObject({
        visible: true,
        message: 'Top right notification',
        variant: 'danger',
        position: 'top-right',
        duration: 3000,
        showCloseButton: true,
      })
    })

    it('Then it should render position containers', () => {
      const containers = wrapper.findAll('div[class*="fixed"]')
      expect(containers.length).toBeGreaterThan(0)
    })
  })

  describe('When rendered with multiple notifications in same position', () => {
    beforeEach(() => {
      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'First notification',
          variant: 'success',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
        {
          id: '2',
          message: 'Second notification',
          variant: 'warning',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
        {
          id: '3',
          message: 'Third notification',
          variant: 'danger',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
      ]

      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should render all notifications in the same position', () => {
      const notifications = wrapper.findAllComponents({ name: 'Notification' })
      expect(notifications).toHaveLength(3)
    })

    it('Then it should stack notifications with TransitionGroup', () => {
      const transitionGroups = wrapper.findAllComponents({ name: 'TransitionGroup' })
      expect(transitionGroups.length).toBeGreaterThan(0)
    })

    it('Then all notifications should have the same position prop', () => {
      const notifications = wrapper.findAllComponents({ name: 'Notification' })

      notifications.forEach((notification) => {
        expect(notification.props('position')).toBe('top-right')
      })
    })
  })

  describe('When notification close event is emitted', () => {
    beforeEach(() => {
      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'Test notification',
          variant: 'success',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
      ]

      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should call removeNotification with correct ID', async () => {
      const notification = wrapper.findComponent({ name: 'Notification' })

      await notification.vm.$emit('close')

      expect(mockRemoveNotification).toHaveBeenCalledWith('1')
      expect(mockRemoveNotification).toHaveBeenCalledTimes(1)
    })
  })

  describe('When rendered with custom notification properties', () => {
    beforeEach(() => {
      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'Custom notification',
          variant: 'warning',
          position: 'bottom-left',
          duration: 5000,
          showCloseButton: false,
          customClass: 'custom-notification-class',
        },
      ]

      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should pass custom properties to notification', () => {
      const notification = wrapper.findComponent({ name: 'Notification' })

      expect(notification.props()).toMatchObject({
        visible: true,
        message: 'Custom notification',
        variant: 'warning',
        position: 'bottom-left',
        duration: 5000,
        showCloseButton: false,
        customClass: 'custom-notification-class',
      })
    })
  })

  describe('When checking component structure', () => {
    beforeEach(() => {
      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should render the main container', () => {
      const container = wrapper.find('.notification-container')
      expect(container.exists()).toBe(true)
    })

    it('Then it should render position containers', () => {
      const positionContainers = wrapper.findAll('div')
      expect(positionContainers.length).toBeGreaterThan(0)
    })
  })

  describe('When checking TransitionGroup configuration', () => {
    beforeEach(() => {
      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'Test notification',
          variant: 'success',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
      ]

      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should configure TransitionGroup with correct props', () => {
      const transitionGroup = wrapper.findComponent({ name: 'TransitionGroup' })

      expect(transitionGroup.exists()).toBe(true)
      expect(transitionGroup.props('name')).toBe('notification')
      expect(transitionGroup.props('tag')).toBe('div')
    })
  })

  describe('When notifications list changes', () => {
    beforeEach(() => {
      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should reactively update when notifications are added', async () => {
      expect(wrapper.findAllComponents({ name: 'Notification' })).toHaveLength(0)

      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'New notification',
          variant: 'success',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
      ]

      await wrapper.vm.$nextTick()

      const notifications = wrapper.findAllComponents({ name: 'Notification' })
      expect(notifications).toHaveLength(1)
      expect(notifications[0].props('message')).toBe('New notification')
    })

    it('Then it should reactively update when notifications are removed', async () => {
      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'Notification to remove',
          variant: 'success',
          position: 'top-right',
          duration: 3000,
          showCloseButton: true,
        },
      ]

      await wrapper.vm.$nextTick()
      expect(wrapper.findAllComponents({ name: 'Notification' })).toHaveLength(1)

      mockNotificationsRef.value = []

      await wrapper.vm.$nextTick()
      expect(wrapper.findAllComponents({ name: 'Notification' })).toHaveLength(0)
    })
  })

  describe('When filtering notifications by position', () => {
    beforeEach(() => {
      mockNotificationsRef.value = [
        {
          id: '1',
          message: 'Top left 1',
          variant: 'success',
          position: 'top-left',
          duration: 3000,
          showCloseButton: true,
        },
        {
          id: '2',
          message: 'Top left 2',
          variant: 'info',
          position: 'top-left',
          duration: 3000,
          showCloseButton: true,
        },
        {
          id: '3',
          message: 'Bottom right',
          variant: 'warning',
          position: 'bottom-right',
          duration: 3000,
          showCloseButton: true,
        },
      ]

      wrapper = mount(NotificationContainer, {
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })
    })

    it('Then it should show all notifications regardless of position', () => {
      const notifications = wrapper.findAllComponents({ name: 'Notification' })
      expect(notifications).toHaveLength(3)

      expect(notifications[0].props('message')).toBe('Top left 1')
      expect(notifications[1].props('message')).toBe('Top left 2')
      expect(notifications[2].props('message')).toBe('Bottom right')
    })

    it('Then it should pass correct position props to notifications', () => {
      const notifications = wrapper.findAllComponents({ name: 'Notification' })

      expect(notifications[0].props('position')).toBe('top-left')
      expect(notifications[1].props('position')).toBe('top-left')
      expect(notifications[2].props('position')).toBe('bottom-right')
    })
  })
})
