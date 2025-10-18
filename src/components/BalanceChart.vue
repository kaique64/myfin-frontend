<template>
  <div class="w-full p-4 bg-white rounded-lg sm:p-6">
    <div v-if="!hasTransactions" class="flex items-center justify-center h-64 text-gray-500">
      <p>Não há dados suficientes para exibir o gráfico.</p>
    </div>
    <div v-else>
      <apexchart
        height="350"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TransactionDTO } from '@/shared/types/transaction'
import type { ApexOptions } from 'apexcharts'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  transactions: {
    type: Array as PropType<TransactionDTO[]>,
    required: true,
  },
})

const hasTransactions = computed(() => props.transactions.length > 0)

const chartSeries = computed(() => {
  if (!hasTransactions.value) return []

  const monthlyTotals: Record<string, { income: number; expense: number }> = {}

  for (const t of props.transactions) {
    const date = new Date(t.date)
    if (isNaN(date.getTime())) continue

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`

    if (!monthlyTotals[key]) {
      monthlyTotals[key] = { income: 0, expense: 0 }
    }

    if (t.type === 'income') monthlyTotals[key].income += t.amount
    else if (t.type === 'expense') monthlyTotals[key].expense += t.amount
  }

  const sortedKeys = Object.keys(monthlyTotals).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  )

  const incomeData: [number, number][] = []
  const expenseData: [number, number][] = []

  for (const key of sortedKeys) {
    const [year, month] = key.split('-').map(Number)
    const timestamp = new Date(year, month - 1, 1).getTime()

    incomeData.push([timestamp, monthlyTotals[key].income])
    expenseData.push([timestamp, monthlyTotals[key].expense])
  }

  return [
    { name: 'Receitas', data: incomeData },
    { name: 'Despesas', data: expenseData },
  ]
})

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    id: 'balance-vs-expense-chart',
    type: 'area',
    height: 350,
    zoom: {
      enabled: true,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ['#3b82f6', '#dc2626'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'dd/MM/yy',
      datetimeUTC: false,
    },
    title: {
      text: 'Data',
    },
  },
  yaxis: {
    title: {
      text: 'Valor (BRL)',
    },
    labels: {
      formatter: (value) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value)
      },
    },
  },
  tooltip: {
    x: {
      format: 'dd/MM/yyyy',
    },
    y: {
      formatter: (value) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value)
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100],
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  }
}))

</script>