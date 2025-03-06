<template>
  <v-btn @click="onClick" icon :disabled="disabled" variant="plain">
    <v-icon :color="color">{{ mdiIcon }}</v-icon>
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
    mdiIcon: {
      type: String,
      default: "",
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
