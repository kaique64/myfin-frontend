<template>
  <div>
    <div class="p-8 bg-gray-50 min-h-screen">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard Financeiro</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardInfo title="Saldo Atual" :value="1500" variant="primary" />

        <CardInfo title="Receitas" :value="3000" variant="success" />

        <CardInfo title="Despesas" :value="1500" variant="danger" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardInfo title="Investimentos" :value="5000" variant="info">
          <template #footer>
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Rendimento mensal</span>
              <span class="text-cyan-900 font-medium">+2.3%</span>
            </div>
          </template>
        </CardInfo>

        <CardInfo title="Meta de Economia" :value="800" variant="warning">
          <template #footer>
            <div class="w-full bg-yellow-200 rounded-full h-2">
              <div class="bg-yellow-500 h-2 rounded-full" style="width: 60%"></div>
            </div>
            <span class="text-sm text-yellow-700 mt-2 block">60% da meta atingida</span>
          </template>
        </CardInfo>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <CardInfo title="Transações do Mês" :value="42" variant="info" :show-currency="false">
          <template #footer>
            <span class="text-sm text-cyan-600">8 pendentes</span>
          </template>
        </CardInfo>

        <CardInfo title="Taxa de Sucesso" value="94.5%" variant="success" :show-currency="false" />

        <CardInfo title="Tempo Médio" value="2.4s" variant="primary" :show-currency="false" />
      </div>
    </div>

    <div class="max-w-2xl mx-auto p-6 bg-white">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Lista de Transações</h1>

      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TransactionItem
          title="Almoço no restaurante X"
          subtitle="Alimentação • 28/08/2025"
          :amount="50"
          type="expense"
          @edit="handleEdit"
          @delete="handleDelete"
        />

        <TransactionItem
          title="Gasolina"
          subtitle="Transporte • 27/08/2025"
          :amount="100"
          type="expense"
          @edit="handleEdit"
          @delete="handleDelete"
        />

        <TransactionItem
          title="Salário"
          subtitle="Receita • 25/08/2025"
          :amount="2500"
          type="income"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">Outras Variações</h2>

      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TransactionItem
          title="Transfer received"
          subtitle="Banking • 26/08/2025"
          :amount="1000"
          type="income"
          currency="USD"
          locale="en-US"
          :show-actions="false"
        />

        <TransactionItem
          title="Compra no supermercado"
          subtitle="Alimentação • 25/08/2025"
          :amount="250"
          type="expense"
          :show-delete-button="false"
          edit-button-text="Editar"
          @edit="handleEdit"
        />

        <TransactionItem
          title="Investimento"
          subtitle="Poupança • 24/08/2025"
          :amount="500"
          type="neutral"
          :clickable="true"
          :show-actions="false"
          @click="handleClick"
        />

        <TransactionItem
          title="Pontos de recompensa"
          subtitle="Programa de fidelidade • 23/08/2025"
          :amount="150"
          type="income"
          :show-currency="false"
          :show-actions="false"
        />
      </div>

      <h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">Moedas Internacionais</h2>

      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TransactionItem
          title="Hotel in Paris"
          subtitle="Travel • 20/08/2025"
          :amount="350"
          type="expense"
          currency="EUR"
          locale="fr-FR"
          edit-button-text="Edit"
          delete-button-text="Delete"
          @edit="handleEdit"
          @delete="handleDelete"
        />

        <TransactionItem
          title="Freelance Project"
          subtitle="Income • 18/08/2025"
          :amount="1200"
          type="income"
          currency="GBP"
          locale="en-GB"
          edit-button-text="Edit"
          delete-button-text="Remove"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <div
        v-if="showNotification"
        class="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
      >
        {{ notificationMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import CardInfo from '../components/shared/CardInfo.vue'
import TransactionItem from '../components/shared/TransactionItem.vue'

const showNotification = ref(false)
const notificationMessage = ref('')

const showMessage = (message: string) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const handleEdit = (event: MouseEvent) => {
  console.log('Edit clicked:', event)
  showMessage('Editar transação')
}

const handleDelete = (event: MouseEvent) => {
  console.log('Delete clicked:', event)
  showMessage('Excluir transação')
}

const handleClick = (event: MouseEvent) => {
  console.log('Item clicked:', event)
  showMessage('Item clicado')
}
</script>
