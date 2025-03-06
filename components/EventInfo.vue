<template>
  <v-container>
    <h1>Информация о мероприятии</h1>
    <v-card v-if="eventStore.selectedEvent">
      <v-card-title>{{ eventStore.selectedEvent.eventName }}</v-card-title>
      <v-card-text>
        <p><strong>Дата:</strong> {{ eventStore.selectedEvent.eventDate }}</p>
        <p>
          <strong>Место:</strong> {{ eventStore.selectedEvent.eventLocation }}
        </p>
        {{ selectedDesignName }}
      </v-card-text>
      <v-btn @click="forwardToInvitePage"> Инвайт </v-btn>
      <v-card-title>Гости</v-card-title>
      <v-card v-for="guest in eventStore.selectedEvent.guests">
        <v-card-title>
          {{ guest.guestName }}
        </v-card-title>
        <v-card-text>
          {{ guest.guestPhone }}
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/event";
import { computed, onMounted } from "vue";

// Получаем маршрут
const route = useRoute();
const router = useRouter();

const eventStore = useEventStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const selectedDesignName = computed(() => {
  const design = eventStore.designList.find(
    (design) =>
      design.designName.toString() === eventStore.selectedEvent?.eventDesignId.toString()
  );
  return design ? design.designName : "Дизайн не найден";
});

const forwardToInvitePage = () => {
  router.push(`/invite/${eventId}`);
};


</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>
