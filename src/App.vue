<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationContainer from './components/shared/notification/NotificationContainer.vue'
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <NotificationContainer />
    <RouterView />
  </div>
</template>
