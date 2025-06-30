<template>
  <v-btn
    class="custom-button"
    variant="text"
    rounded="xl"
    :disabled="disabled"
    :style="{ background: computedBackground }"
    @click="onClick"
  >
    <span v-if="!loadingStatus">{{ text }}</span>
    <v-progress-circular
      v-if="loadingStatus"
      :size="20"
      :width="2"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "", // Обычный цвет (например, "#ff0000" или "blue")
  },
  colorStops: {
    type: Array as () => { color: string; percent: string }[],
    default: () => [], // Градиент
  },
  clickFunction: {
    type: Function,
    required: false,
    default: () => {},
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  loadingStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const computedBackground = computed(() => {
  if (props.color) {
    return props.color; // Если передан обычный цвет — используем его
  } else if (props.colorStops.length) {
    return `linear-gradient(90deg, ${props.colorStops
      .map((stop) => `${stop.color} ${stop.percent}`)
      .join(", ")})`; // Если передан градиент — формируем его
  }
  return "gray"; // Значение по умолчанию
});

const onClick = () => {
  if (!props.loadingStatus) {
    props.clickFunction();
  }
};
</script>

<style scoped>

</style>
