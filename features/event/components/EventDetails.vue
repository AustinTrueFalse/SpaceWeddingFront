<template>
  <EventEdit v-if="!eventStore.loadingStatuses.selecetedEvent"/>
</template>

<script lang="ts" setup>
import EventEdit from "./EventEdit.vue";

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useEventStore } from "../stores/event";
import { ref, onMounted } from "vue";


// Получаем маршрут
const route = useRoute();
const router = useRouter();

const eventStore = useEventStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const isEdit = ref(false);

const backToDashboard = () => {
  router.push("/dashboard");
};

const editEvent = () => {
  isEdit.value = true;
};

const saveSettings = async () => {
  await eventStore.updateEvent(eventId);
  await eventStore.getEventById(eventId);
  isEdit.value = false;
};


// Загрузка ивентов (если они еще не были загружены)
onMounted(async () => {
  await eventStore.getEventById(eventId);
  await eventStore.getDesigns();
});
</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>
