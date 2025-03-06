<template>
  <v-btn
    :color="color"
    @click="onClick"
    variant="outlined"
    rounded="lg"
    :disabled="disabled"
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
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "white",
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
  methods: {
    onClick() {
      if (!this.loadingStatus) {
        this.clickFunction();
      }
    },
  },
});
</script>
