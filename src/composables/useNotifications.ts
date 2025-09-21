import { ref, computed } from 'vue'
import type { Variant } from '../shared/types/variant'

export interface NotificationItem {
  id: string
  message: string
  variant?: Variant
  position?: NotificationPosition
  duration?: number
  showCloseButton?: boolean
  customClass?: string
}

type NotificationPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

const notifications = ref<NotificationItem[]>([])

let notificationId = 0

export function useNotifications() {
  const addNotification = (notification: Omit<NotificationItem, 'id'>): string => {
    const id = `notification-${++notificationId}`
    const newNotification: NotificationItem = {
      id,
      variant: 'primary',
      position: 'bottom-right',
      duration: 3000,
      showCloseButton: true,
      ...notification,
    }

    notifications.value.push(newNotification)
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const success = (
    message: string,
    options?: Partial<Omit<NotificationItem, 'id' | 'message' | 'variant'>>,
  ) => {
    return addNotification({ message, variant: 'success', ...options })
  }

  const error = (
    message: string,
    options?: Partial<Omit<NotificationItem, 'id' | 'message' | 'variant'>>,
  ) => {
    return addNotification({ message, variant: 'danger', ...options })
  }

  const warning = (
    message: string,
    options?: Partial<Omit<NotificationItem, 'id' | 'message' | 'variant'>>,
  ) => {
    return addNotification({ message, variant: 'warning', ...options })
  }

  const info = (
    message: string,
    options?: Partial<Omit<NotificationItem, 'id' | 'message' | 'variant'>>,
  ) => {
    return addNotification({ message, variant: 'info', ...options })
  }

  const primary = (
    message: string,
    options?: Partial<Omit<NotificationItem, 'id' | 'message' | 'variant'>>,
  ) => {
    return addNotification({ message, variant: 'primary', ...options })
  }

  return {
    notifications: computed(() => notifications.value),
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    primary,
  }
}
