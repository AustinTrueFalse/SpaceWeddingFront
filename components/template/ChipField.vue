<template>
  <div>
    <v-card-title class="chip-field-label">{{ label }}</v-card-title>
    <v-chip
      class="field-chip"
      size="x-large"
      color="deep-purple-lighten-5"
      text-color="white"
    >
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

