<template>
  <v-container>
    <GetStartedPage class="pt-15" />
  </v-container>
</template>

<script setup lang="ts">

import GetStartedPage from '@/features/start/components/GetStartedPage.vue';

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

</script>
