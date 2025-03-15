<template>
  <div>Это инвайт приглашения</div>

  <component :is="DynamicTemplate" :event-date="currentEvent?.eventDate" />
  <v-form>
    <InputText v-model="guestStore.guest.guestName" label="Name" />
    <InputText v-model="guestStore.guest.guestPhone" label="Phone" />
    <CheckboxGroup v-model="guestStore.guest.guestDrinks" :items="drinkListItems" />
    <RadioGroup v-model="guestStore.guest.guestStatus" :items="guestStatuses" />
    <ButtonDefault
      class="mb-5 w-100"
      text="Создать"
      :loading-status="guestStore.loadingStatuses.guestAdd"
      :click-function="addGuest"
    ></ButtonDefault>
  </v-form>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useGuestStore } from "@/stores/guest";
import { computed, onMounted, defineAsyncComponent } from "vue";

import InputText from "./components/template/InputText.vue";
import ButtonDefault from "./components/template/ButtonDefault.vue";
import CheckboxGroup from "./components/template/CheckboxGroup.vue";
import RadioGroup from "./components/template/RadioGroup.vue";

// Получаем маршрут
const route = useRoute();

const eventStore = useEventStore();
const guestStore = useGuestStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

onMounted(async () => {
  await eventStore.getEventById(eventId);
});

// Вычисляем текущий ивент
const currentEvent = computed(() => eventStore.selectedEvent);

// Динамическая загрузка компонента
const DynamicTemplate = computed(() => {
  console.log(currentEvent.value);
  const styleName = currentEvent.value?.eventDesignId || "simple";
  return defineAsyncComponent(
    () => import(`@/components/invites/${styleName}/Header.vue`)
  );
});

const drinkListItems = computed(() => {
  const drinks = currentEvent.value?.eventDrinks.map((drink) => ({
    ...drink,
    label: drink.drinkName,
    drinkName: undefined,
  }));
  return drinks;
});

const guestStatuses = computed(() => {
  const statuses = currentEvent.value?.guestStatuses.map((sts) => ({
    ...sts,
    label: sts.status,
    status: undefined,
  }));
  return statuses;
});

const addGuest = async () => {
  await guestStore.addGuest(eventId);
};
</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>
