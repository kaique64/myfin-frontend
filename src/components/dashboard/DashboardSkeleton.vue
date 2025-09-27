<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <CardContainer>
    <TitleSkeleton />

    <Divider size="xs" />

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
      <CardInfoSkeleton />
      <CardInfoSkeleton />
      <CardInfoSkeleton />
    </div>

    <div class="mt-8 p-6 bg-white rounded-lg border border-gray-200">
      <div class="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>

      <div class="flex justify-center items-center h-64">
        <div class="text-center">
          <div class="h-32 w-32 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <div class="h-4 w-40 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  </CardContainer>
</template>

<script setup lang="ts">
import CardContainer from '../shared/card/CardContainer.vue'
import CardInfoSkeleton from '../shared/card/CardInfoSkeleton.vue';
import Divider from '../shared/Divider.vue';
import TitleSkeleton from '../shared/TitleSkeleton.vue';
</script>
