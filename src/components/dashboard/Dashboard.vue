<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <CardContainer>
    <Title size="2xl" tag="h1">{{ texts.dashboard.title }}</Title>
    <Divider size="xs" />
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
      <CardInfo
        :title="texts.dashboard.currentBalance"
        :value="transactionDashboardData?.totalAmount"
        variant="info"
      />
      <CardInfo
        :title="texts.dashboard.income"
        :value="transactionDashboardData?.incomeAmount"
        variant="success"
      />
      <CardInfo
        :title="texts.dashboard.expenses"
        :value="transactionDashboardData?.expenseAmount"
        variant="danger"
      />
    </div>

    <div class="mt-8 p-6 bg-white rounded-lg border border-gray-200">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-6">
        {{ texts.dashboard.charts.chartTitle }}
      </h2>
      <div class="flex justify-center items-center h-64">
        <div class="text-gray-400 text-center">
          <p class="text-sm">{{ texts.dashboard.charts.chartPlaceholder }}</p>
        </div>
      </div>
    </div>
  </CardContainer>
</template>
<script setup lang="ts">
import { texts } from '@/shared/texts'
import CardContainer from '../shared/card/CardContainer.vue'
import CardInfo from '../shared/card/CardInfo.vue'
import Divider from '../shared/Divider.vue'
import Title from '../shared/Title.vue'
import { useTransactionStore } from '@/stores/transaction'
import { computed, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'

const transactionStore = useTransactionStore()
const { addNotification } = useNotifications()

const transactionDashboardData = computed(() => {
  return transactionStore.transactionDashboard ?? {
    incomeAmount: 0,
    expenseAmount: 0,
    totalAmount: 0,
  }
})

onMounted(async () => {
  try {
    await transactionStore.getTransactionDashboard()
  } catch (error) {
    addNotification({
      message: 'Error fetching dashboard data',
      variant: 'danger',
    })
    console.error('Error fetching dashboard data:', error)
  }
})
</script>
