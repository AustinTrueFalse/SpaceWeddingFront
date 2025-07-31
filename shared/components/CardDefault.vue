<template>
  <v-card class="event-card h-100" rounded="xl">
    <div class="main-title px-5 py-5">
      {{ text }}
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  text?: string;
}>();
</script>
