<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <DashboardSkeleton v-if="isLoading" />
  <CardContainer v-else>
    <div class="flex justify-between items-center">
      <Title size="2xl" tag="h1">{{ texts.dashboard.title }}</Title>
      <Button variant="success" @click="$emit('addTransaction')">
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Adicionar
        </div>
      </Button>
    </div>

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

    <div class="mt-8 p-6 bg-white">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-6">
        {{ texts.dashboard.charts.chartTitle }}
      </h2>
    </div>
    <BalanceChart :transactions="transactions" />
  </CardContainer>
</template>
<script setup lang="ts">
import { texts } from '@/shared/texts'
import CardContainer from '../shared/card/CardContainer.vue'
import CardInfo from '../shared/card/CardInfo.vue'
import Divider from '../shared/Divider.vue'
import Title from '../shared/Title.vue'
import Button from '../shared/Button.vue'
import DashboardSkeleton from './DashboardSkeleton.vue'
import { useTransactionStore } from '@/stores/transaction'
import { computed, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import BalanceChart from '../BalanceChart.vue'

const emit = defineEmits<{
  addTransaction: []
}>()

const transactionStore = useTransactionStore()
const { addNotification } = useNotifications()

const transactions = computed(() => transactionStore.transactionDashboard?.transactions || [])
const isLoading = computed(() => transactionStore.isLoading)

const transactionDashboardData = computed(() => {
  return (
    transactionStore.transactionDashboard ?? {
      incomeAmount: 0,
      expenseAmount: 0,
      totalAmount: 0,
    }
  )
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
