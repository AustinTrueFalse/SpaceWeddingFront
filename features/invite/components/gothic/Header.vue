<template>
  <v-container>
    <v-row justify="space-between" class="pt-10">
      <v-col>
        <v-row class="pb-10">
          <v-col>
            <div class="text-left header-font increase-font">SAVE</div>
            <div class="text-left header-font increase-font">THE</div>
            <div class="text-left header-font increase-font">DATE</div>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="text-right main-font decriase-main-font pa-0 pl-15 pr-3">
          {{ formattedDate.day }}
        </div>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="12">
        <div
          class="text-right main-font decriase-main-font main-font-spacing pa-0 pr-3"
        >
          {{ formattedDate.month }}
        </div>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="6">
        <v-row class="">
          <v-col>
            <div class="text-left header-font increase-font pt-10">
              {{ formattedEventCouple.brideNameUpper }}
              <v-icon class="small-dot">mdi-circle</v-icon>
              {{ formattedEventCouple.groomNameUpper }}
            </div>
            <div class="text-left header-font increase-font pt-2">
              WEDDING
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <div class="text-right main-font decriase-main-font pa-0 pr-3">
          {{ formattedDate.year }}
        </div>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col class="pa-0 pr-5 pt-5" cols="6">
        <MainPhoto />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";

import { useEventStore } from "@/features/event/stores/event";


const eventStore = useEventStore();

const formattedDate = computed(() => {
  const date = new Date(eventStore.selectedEventCurrent.eventDate);

  const day = date.getDate();
  const month = date
    .toLocaleString("en-US", { month: "short" })
    .toLocaleUpperCase(); // три буквы на английском
  const year = date.getFullYear() % 100; // берём последние две цифры года

  return {
    day,
    month,
    year,
  };
});

const formattedEventCouple = computed(() => {
  const brideNameUpper =
    eventStore.selectedEventCurrent.eventCouple.brideName.toUpperCase();
  const groomNameUpper =
    eventStore.selectedEventCurrent.eventCouple.groomName.toUpperCase();

  return {
    brideNameUpper,
    groomNameUpper,
  };
});
</script>
