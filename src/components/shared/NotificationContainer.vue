<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Teleport to="body">
    <div class="notification-container">
      <!-- Containers para cada posição -->
      <div v-for="position in positions" :key="position" :class="getContainerClasses(position)">
        <TransitionGroup name="notification" tag="div" class="space-y-2">
          <Notification
            v-for="notification in getNotificationsByPosition(position)"
            :key="notification.id"
            :visible="true"
            :message="notification.message"
            :variant="notification.variant"
            :position="notification.position"
            :duration="notification.duration"
            :show-close-button="notification.showCloseButton"
            :custom-class="notification.customClass"
            @close="removeNotification(notification.id)"
          />
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Notification from './Notification.vue'
import { useNotifications } from '../../composables/useNotifications'

type NotificationPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

const { notifications, removeNotification } = useNotifications()

const positions: NotificationPosition[] = [
  'top-left',
  'top-right',
  'top-center',
  'bottom-left',
  'bottom-right',
  'bottom-center',
]

const getNotificationsByPosition = (position: NotificationPosition) => {
  return notifications.value.filter((n) => n.position === position)
}

const getContainerClasses = (position: NotificationPosition) => {
  const baseClasses = 'fixed z-50 pointer-events-none'

  const positionClasses: Record<NotificationPosition, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  return `${baseClasses} ${positionClasses[position]}`
}
</script>

<style scoped>
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.2s ease-in;
}

.notification-enter-from {
  transform: translateY(30px);
  opacity: 0;
  scale: 0.95;
}

.notification-enter-to {
  transform: translateY(0);
  opacity: 1;
  scale: 1;
}

.notification-leave-from {
  transform: translateY(0);
  opacity: 1;
  scale: 1;
}

.notification-leave-to {
  transform: translateY(-30px);
  opacity: 0;
  scale: 0.95;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Permite interação com as notificações */
.notification-container >>> .fixed {
  pointer-events: auto;
}
</style>
