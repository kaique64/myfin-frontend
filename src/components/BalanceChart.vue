<template>
  <div class="w-full p-4 bg-white rounded-lg sm:p-6">
    <div v-if="!hasTransactions" class="flex items-center justify-center h-64 text-gray-500">
      <p>Não há dados suficientes para exibir o gráfico.</p>
    </div>
    <div v-else>
      <apexchart
        height="350"
        type="bar"
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

const parseDate = (dateString: string): Date => {
  if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
    const parts = dateString.split('-')
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
  }

  const parts = dateString.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // mês começa em 0
    const year = parseInt(parts[2], 10)
    return new Date(year, month, day)
  }

  return new Date(dateString)
}

const chartSeries = computed(() => {
  if (!hasTransactions.value) return []

  const dailyTotals: Record<string, { income: number; expense: number }> = {}

  for (const t of props.transactions) {
    const date = parseDate(t.date)
    if (isNaN(date.getTime())) continue

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const key = `${year}-${month}-${day}`

    if (!dailyTotals[key]) {
      dailyTotals[key] = { income: 0, expense: 0 }
    }

    if (t.type === 'income') dailyTotals[key].income += t.amount
    else if (t.type === 'expense') dailyTotals[key].expense += t.amount
  }

  const sortedKeys = Object.keys(dailyTotals).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  )

  const incomeData: [number, number][] = []
  const expenseData: [number, number][] = []

  for (const key of sortedKeys) {
    const [year, month, day] = key.split('-').map(Number)
    const timestamp = new Date(year, month - 1, day).getTime()

    incomeData.push([timestamp, dailyTotals[key].income])
    expenseData.push([timestamp, dailyTotals[key].expense])
  }

  return [
    { name: 'Receitas', data: incomeData },
    { name: 'Despesas', data: expenseData },
  ]
})

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    id: 'balance-vs-expense-chart',
    type: 'bar',
    height: 350,
    zoom: {
      enabled: true,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ['#3b82f6', '#dc2626'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
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
  legend: {
    position: 'top',
    horizontalAlign: 'left',
  },
}))
</script>
