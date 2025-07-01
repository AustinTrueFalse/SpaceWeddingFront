<template>
  <DialogDefault
    v-if="dialogStore.type === 'guestsDescr'"
    title="Описание гостей"
    confirmText="Да"
    width="1000px"
  >
    <v-expansion-panels flat multiple>
      <v-expansion-panel v-for="guest in guests" :key="guest.id">
  <template v-slot:title>
    <div class="d-flex flex-column">
      <div class="d-flex justify-start align-center">
        <span>{{ guest.guestName }}</span>
        <v-chip class="ml-5">{{ guest.guestTag.tagName }}</v-chip>
      </div>
      <div class="mt-5">
        <span>Выбранные напитки</span>
        <v-chip
          
          v-for="(drink, index) in guest.guestDrinks"
          :key="drink.id"
          :class="index === 0 ? 'ml-5' : 'ml-2'"
          :color="'pink'"
        >
          {{ drink.drinkName }}
        </v-chip>
      </div>
    </div>
  </template>

  <v-expansion-panel-text>
    <InputTextArea v-model="guest.guestDescr" />
  </v-expansion-panel-text>
  <v-divider></v-divider>
</v-expansion-panel>
    </v-expansion-panels>

    <v-row justify="center" class="pt-10">
      <v-col cols="6">
        <ButtonDefault
          class="mb-5 w-100"
          text="Сохранить"
          :loading-status="eventStore.loadingStatuses.guestsUpdate"
          :click-function="updateGuestsDescr"
  
        ></ButtonDefault>
      </v-col>
    </v-row>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useGuestStore } from "@/stores/guest";
import { useDialogStore } from "@/stores/dialog";
import { computed } from "vue";


import DialogDefault from "@/components/template/DialogDefault.vue";

import InputTextArea from "@/components/template/InputTextArea.vue";
import ButtonDefault from "@/components/template/ButtonDefault.vue";

// Получаем маршрут
const route = useRoute();

const eventStore = useEventStore();
const guestStore = useGuestStore();
const dialogStore = useDialogStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const guests = computed(() => {
  return eventStore.selectedEventCurrent.guests;
});

const updateGuestsDescr = async () => {
  try {
    await eventStore.updateGuestList(); // Если здесь ошибка, выполнение перейдет в catch
    eventStore.getGuests(eventId); // Выполнится только если addGuestAuth успешен
  } catch (error) {
  } finally {
    dialogStore.hideDialog();
  }
};
</script>
