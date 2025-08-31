<template>
  <div>
    <section>
      <Title size="3xl" margin="mb-8">Dashboard Financeiro</Title>

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
    </section>

    <div class="max-w-2xl mx-auto mt-8 p-6 bg-white">
      <Title size="2xl" tag="h1">Lista de Transações</Title>
      <Divider size="xs" />

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

      <Title size="xl" tag="h2" weight="semibold" margin="mt-8 mb-4">Outras Variações</Title>

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

      <Title size="xl" tag="h2" weight="semibold" margin="mt-8 mb-4">Moedas Internacionais</Title>

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

      <!-- Sistema de notificações global -->
      <NotificationContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardInfo from '../components/shared/CardInfo.vue'
import TransactionItem from '../components/shared/TransactionItem.vue'
import Title from '../components/shared/Title.vue'
import Divider from '@/components/shared/Divider.vue'
import NotificationContainer from '../components/shared/NotificationContainer.vue'
import { useNotifications } from '../composables/useNotifications'

const { success, error, info } = useNotifications()

const handleEdit = (event: MouseEvent) => {
  console.log('Edit clicked:', event)
  success('Transação editada com sucesso!', { position: 'top-right' })
}

const handleDelete = (event: MouseEvent) => {
  console.log('Delete clicked:', event)
  error('Transação excluída', { position: 'bottom-right' })
}

const handleClick = (event: MouseEvent) => {
  console.log('Item clicked:', event)
  info('Item selecionado', { position: 'top-center' })
}
</script>
