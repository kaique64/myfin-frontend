<template>
  <CardContainer id="transaction-list-skeleton">
    <TitleSkeleton />

    <div v-for="n in 5" :key="n" class="px-0 py-6">
      <div class="flex justify-between items-center">
        <div class="space-y-2">
          <div class="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </CardContainer>
</template>
<script setup lang="ts">
import CardContainer from '../shared/card/CardContainer.vue';
import TitleSkeleton from '../shared/TitleSkeleton.vue';

</script>
