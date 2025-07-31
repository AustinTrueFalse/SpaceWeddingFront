<template>
  <v-card
    class="event-card"
    :width="width"
    :height="height"
    link
    rounded="xl"
    elevation="0"
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

const props = withDefaults(defineProps<{
  eventName?: string
  eventDate?: string
  eventTime?: string
  iconName?: string
  width?: string | number
  height?: string | number
  onClick?: (value: any) => void
  value?: any
}>(), {
  eventName: '',
  eventDate: '',
  eventTime: '',
  iconName: '',
  width: '300',
  height: '200',
  value: null,
})

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