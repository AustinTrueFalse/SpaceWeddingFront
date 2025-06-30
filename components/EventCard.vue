<template>
  <v-card
    class="event-card"
    :width="width"
    :height="height"
    link
    rounded="xl"
    @click="handleClick"
  >
    <v-card-title class="ml-3 mt-3">
      {{ eventName }}
    </v-card-title>
    <v-card-text class="pa-0 ma-0">
      <div v-if="iconName" class="event-card-icon-container">
        <v-icon class="large-icon" color="primary">{{ iconName }}</v-icon>
      </div>
      <v-row class="ml-0">
        <v-col>
          <v-card-title class="date-time-text">
            {{ eventDate }}
          </v-card-title>
        </v-col>
        <v-col>
          <v-card-title class="date-time-text">
            {{ eventTime }}
          </v-card-title>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  eventName: {
    type: String,
    default: "",
  },
  eventDate: {
    type: String,
    default: "",
  },
  eventTime: {
    type: String,
    default: "",
  },
  iconName: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: "300",
  },
  height: {
    type: [String, Number],
    default: "200",
  },
  onClick: {
    type: Function,
    required: false,
  },
  value: {
    type: [String, Number, Object],
    default: null,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (props.onClick) {
    props.onClick(props.value);
  }
  emit("click", props.value);
};
</script>

<style scoped>
/* твои стили */
</style>