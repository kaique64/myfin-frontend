import { describe, it, expect, beforeEach } from 'vitest'
import { useNotifications } from '../../src/composables/useNotifications'

describe('Given useNotifications composable', () => {
  let notificationService: ReturnType<typeof useNotifications>

  beforeEach(() => {
    notificationService = useNotifications()
    notificationService.clearAllNotifications()
  })

  describe('When adding a notification', () => {
    it('Then it should add notification to the list', () => {
      const id = notificationService.addNotification({
        message: 'Test notification',
        variant: 'success',
      })

      expect(notificationService.notifications.value).toHaveLength(1)
      expect(notificationService.notifications.value[0]).toMatchObject({
        id,
        message: 'Test notification',
        variant: 'success',
      })
    })

    it('Then it should assign default values', () => {
      const id = notificationService.addNotification({
        message: 'Test notification',
      })

      const notification = notificationService.notifications.value[0]
      expect(notification).toMatchObject({
        id,
        message: 'Test notification',
        variant: 'primary',
        position: 'bottom-right',
        duration: 3000,
        showCloseButton: true,
      })
    })

    it('Then it should override default values with provided options', () => {
      const id = notificationService.addNotification({
        message: 'Custom notification',
        variant: 'danger',
        position: 'top-left',
        duration: 5000,
        showCloseButton: false,
      })

      const notification = notificationService.notifications.value[0]
      expect(notification).toMatchObject({
        id,
        message: 'Custom notification',
        variant: 'danger',
        position: 'top-left',
        duration: 5000,
        showCloseButton: false,
      })
    })

    it('Then it should generate unique IDs', () => {
      const id1 = notificationService.addNotification({ message: 'First' })
      const id2 = notificationService.addNotification({ message: 'Second' })

      expect(id1).not.toBe(id2)
      expect(notificationService.notifications.value).toHaveLength(2)
    })
  })

  describe('When removing a notification', () => {
    it('Then it should remove notification by ID', () => {
      const id1 = notificationService.addNotification({ message: 'First' })
      const id2 = notificationService.addNotification({ message: 'Second' })

      expect(notificationService.notifications.value).toHaveLength(2)

      notificationService.removeNotification(id1)

      expect(notificationService.notifications.value).toHaveLength(1)
      expect(notificationService.notifications.value[0].id).toBe(id2)
    })

    it('Then it should handle non-existent ID gracefully', () => {
      notificationService.addNotification({ message: 'Test' })

      expect(() => {
        notificationService.removeNotification('non-existent-id')
      }).not.toThrow()

      expect(notificationService.notifications.value).toHaveLength(1)
    })
  })

  describe('When clearing all notifications', () => {
    it('Then it should remove all notifications', () => {
      notificationService.addNotification({ message: 'First' })
      notificationService.addNotification({ message: 'Second' })
      notificationService.addNotification({ message: 'Third' })

      expect(notificationService.notifications.value).toHaveLength(3)

      notificationService.clearAllNotifications()

      expect(notificationService.notifications.value).toHaveLength(0)
    })
  })

  describe('When using convenience methods', () => {
    describe('success method', () => {
      it('Then it should create success notification', () => {
        const id = notificationService.success('Success message')

        const notification = notificationService.notifications.value[0]
        expect(notification).toMatchObject({
          id,
          message: 'Success message',
          variant: 'success',
        })
      })

      it('Then it should accept additional options', () => {
        const id = notificationService.success('Success message', {
          position: 'top-center',
          duration: 2000,
        })

        const notification = notificationService.notifications.value[0]
        expect(notification).toMatchObject({
          id,
          message: 'Success message',
          variant: 'success',
          position: 'top-center',
          duration: 2000,
        })
      })
    })

    describe('error method', () => {
      it('Then it should create error notification', () => {
        const id = notificationService.error('Error message')

        const notification = notificationService.notifications.value[0]
        expect(notification).toMatchObject({
          id,
          message: 'Error message',
          variant: 'danger',
        })
      })
    })

    describe('warning method', () => {
      it('Then it should create warning notification', () => {
        const id = notificationService.warning('Warning message')

        const notification = notificationService.notifications.value[0]
        expect(notification).toMatchObject({
          id,
          message: 'Warning message',
          variant: 'warning',
        })
      })
    })

    describe('info method', () => {
      it('Then it should create info notification', () => {
        const id = notificationService.info('Info message')

        const notification = notificationService.notifications.value[0]
        expect(notification).toMatchObject({
          id,
          message: 'Info message',
          variant: 'info',
        })
      })
    })

    describe('primary method', () => {
      it('Then it should create primary notification', () => {
        const id = notificationService.primary('Primary message')

        const notification = notificationService.notifications.value[0]
        expect(notification).toMatchObject({
          id,
          message: 'Primary message',
          variant: 'primary',
        })
      })
    })
  })

  describe('When adding multiple notifications', () => {
    it('Then it should maintain order', () => {
      const id1 = notificationService.addNotification({ message: 'First' })
      const id2 = notificationService.addNotification({ message: 'Second' })
      const id3 = notificationService.addNotification({ message: 'Third' })

      expect(notificationService.notifications.value[0].id).toBe(id1)
      expect(notificationService.notifications.value[1].id).toBe(id2)
      expect(notificationService.notifications.value[2].id).toBe(id3)
    })

    it('Then it should allow different variants and positions', () => {
      notificationService.success('Success', { position: 'top-right' })
      notificationService.error('Error', { position: 'bottom-left' })
      notificationService.warning('Warning', { position: 'top-center' })

      expect(notificationService.notifications.value).toHaveLength(3)
      expect(notificationService.notifications.value[0].variant).toBe('success')
      expect(notificationService.notifications.value[1].variant).toBe('danger')
      expect(notificationService.notifications.value[2].variant).toBe('warning')
    })
  })
})
