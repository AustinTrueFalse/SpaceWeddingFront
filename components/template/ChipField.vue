<template>
  <div>
    <v-card-title>{{ label }}</v-card-title>
    <v-chip size="x-large" text-color="white">
      {{ text }}
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});
</script>
