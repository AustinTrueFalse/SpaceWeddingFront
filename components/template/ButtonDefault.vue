<template>
  <v-btn
    class="custom-button"
    @click="onClick"
    variant="flat"
    rounded="xl"
    :disabled="disabled"
    :style="{ background: computedBackground }"
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

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
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
  },
  setup(props) {
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

    return { computedBackground };
  },
  methods: {
    onClick() {
      if (!this.loadingStatus) {
        this.clickFunction();
      }
    },
  },
});
</script>

<style scoped>
.custom-button {
  width: 100%;
  height: 48px;
  border: none;
  transition: 0.3s;
  color: white;
}
</style>
