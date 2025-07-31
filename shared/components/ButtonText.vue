<template>
  <div class="d-flex">
    <v-btn
      class="mt-2 capitalize-first"
      density="compact"
      variant="text"
      @click="onClick"
    >
      Не помню блин
    </v-btn>
    <v-progress-circular
      v-if="loading"
      :size="20"
      :width="2"
      color="primary"
      indeterminate
    />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "click"): void;
}>();

const props = defineProps<{
  text?: string;
  loading?: boolean;
}>();

const onClick = () => {
  if (!props.loading) {
    emit("click");
  }
};
</script>

<style scoped>
.capitalize-first {
  display: inline-block;
  text-transform: lowercase;
}

.capitalize-first::first-letter {
  text-transform: uppercase !important;
}
</style>
