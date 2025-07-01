<template>
  <div class="text-center header-font-orlando decriase-font">
    LOCATION
  </div>

  <YandexMap
    v-model="eventStore.selectedEventCurrent.eventLocation"
    label="Местоположение"
    readonly
    height="310px"
  />
  <div class="pl-5">
     <div class="header-font increase-font pt-8">
      {{ eventStore.selectedEventCurrent.eventLocation }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventStore } from "@/stores/event";
import YandexMap from "@/components/template/YandexMap.vue";

const eventStore = useEventStore();
</script>
