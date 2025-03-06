<template>
  <v-container>
    <GetStartedPage class="pt-15" />
  </v-container>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

</script>
