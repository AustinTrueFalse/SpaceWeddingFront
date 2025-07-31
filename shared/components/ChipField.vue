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

const props = withDefaults(defineProps<{
  text?: string;
  label?: string;
}>(), {
  text: "",
  label: "",
});
</script>
