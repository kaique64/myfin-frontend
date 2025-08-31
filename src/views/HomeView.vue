<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard Financeiro</h1>

    <!-- Grid de cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Saldo Atual -->
      <CardInfo title="Saldo Atual" :value="1500" variant="primary" />

      <!-- Receitas -->
      <CardInfo title="Receitas" :value="3000" variant="success" />

      <!-- Despesas -->
      <CardInfo title="Despesas" :value="1500" variant="danger" />
    </div>

    <!-- Exemplo com outras variantes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Investimentos -->
      <CardInfo title="Investimentos" :value="5000" variant="info">
        <template #footer>
          <div class="flex justify-between text-sm">
            <span class="text-cyan-600">Rendimento mensal</span>
            <span class="text-cyan-900 font-medium">+2.3%</span>
          </div>
        </template>
      </CardInfo>

      <!-- Meta de Economia -->
      <CardInfo title="Meta de Economia" :value="800" variant="warning">
        <template #footer>
          <div class="w-full bg-yellow-200 rounded-full h-2">
            <div class="bg-yellow-500 h-2 rounded-full" style="width: 60%"></div>
          </div>
          <span class="text-sm text-yellow-700 mt-2 block">60% da meta atingida</span>
        </template>
      </CardInfo>
    </div>

    <!-- Exemplo sem formatação de moeda -->
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
</template>

<script setup lang="ts">
import CardInfo from '../components/shared/CardInfo.vue'
</script>
