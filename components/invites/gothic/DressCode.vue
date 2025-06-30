<template>
  <v-container>
    <v-row justify="space-between" class="desr-size">
      <v-col cols="2" class="px-0">
        <div class="custom-card pa-0">
          <div
            class="header-font-orlando rotated-text-reverse decriase-font letter-spacing-small"
          >
            DRESS
          </div>
        </div>
      </v-col>
      <v-col class="montserrat_font first-row" cols="8">
        <div class="header-font-small increase-font-small pt-12">
          Мы будем очень благодарны, если вы поддержите стиль и цвет нашей
          свадьбы в своих нарядах.
        </div>
        
        <v-row justify="center"  class="pt-3">
          <div v-if="eventColors.length === 0" class="text-center header-font increase-font mt-10">
            Добавьте цвета вашей свадьбы
          </div>
          <v-col cols="12">
            <v-row align="center">
              <v-col v-for="color in eventColors" class="pa-0 ma-0 mt-5">
                <v-card
                  rounded="xl"
                  :color="color"
                  height="150"
                  class="mx-2"
                  style="position: relative"
                >
                  
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="px-0">
        <div class="custom-card pa-0 pb-15">
          <div
            class="header-font-orlando rotated-text decriase-font letter-spacing"
          >
            CODE
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import ColorPicker from "@/components/template/ColorPicker.vue";

import { useEventStore } from "@/stores/event";

const eventStore = useEventStore();

const eventColors = computed(() => {
  return eventStore.selectedEvent.eventInvite.colorsInfo?.colors;
});

const addEventColor = (color: string) => {
  const isColorExist = eventColors.value.some(
    (eventColor) => eventColor === color
  );

  if (!isColorExist) {
    eventStore.addEventColor(color);
  }
};

const deleteEventColor = (color: string) => {
  eventStore.deleteEventColor(color);
};
</script>
