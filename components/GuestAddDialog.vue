<template>
  <DialogDefault
    v-if="dialogStore.type === 'guestAdd'"
    title="Добавление гостя"
    confirmText="Да"
  >
    <InputText
      v-model="guestStore.guest.guestName"
      label="Имя"
      :bg-color="themeColors.primary"
    />
    <InputText
      v-model="guestStore.guest.guestPhone"
      label="Номер телефона"
      :bg-color="themeColors.primary"
    />
    <CheckboxGroup
      class="pt-3"
      v-model="guestStore.guest.guestDrinks"
      :items="drinkListItems"
      title="Напитки"
    />
    <RadioGroup
      v-model="guestStore.guest.guestStatus"
      :items="guestStatuses"
      title="Статус"
    />
    <v-row justify="center" class="pt-10">
      <v-col cols="6">
        <ButtonDefault
          class="mb-5 w-100"
          text="Добавить"
          :loading-status="guestStore.loadingStatuses.guestAdd"
          :click-function="addGuest"
          :colorStops="gradientSettings"
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
import { computed, defineProps } from "vue";
import { themeColors, gradientSettings } from "@/config/themeConfig";

import DialogDefault from "./components/template/DialogDefault.vue";
import InputText from "./components/template/InputText.vue";
import ButtonDefault from "./components/template/ButtonDefault.vue";
import CheckboxGroup from "./components/template/CheckboxGroup.vue";
import RadioGroup from "./components/template/RadioGroup.vue";

// Получаем маршрут
const route = useRoute();

const eventStore = useEventStore();
const guestStore = useGuestStore();
const dialogStore = useDialogStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

// Вычисляем текущий ивент
const currentEvent = computed(() => eventStore.selectedEvent);

const drinkListItems = computed(() => {
  const drinks = currentEvent.value.eventDrinks.map((drink) => ({
    ...drink,
    label: drink.drinkName,
  }));
  return drinks;
});

const guestStatuses = computed(() => {
  const statuses = currentEvent.value.guestStatuses.map((sts) => ({
    ...sts,
    label: sts.status,
  }));
  return statuses;
});

const addGuest = async () => {
  try {
    await guestStore.addGuestAuth(eventId); // Если здесь ошибка, выполнение перейдет в catch
    eventStore.getGuests(eventId); // Выполнится только если addGuestAuth успешен
  } catch (error) {
  } finally {
    dialogStore.hideDialog();
  }
};
</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>
