<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-avatar color="grey" size="300">
          <v-img
            src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
            cover
          ></v-img>
        </v-avatar>
        <ChipField class="mt-10" :text="'lavenetsky@gmail.com'" label="Email" />
      </v-col>
      <v-col cols="1"> </v-col>
      <v-col cols="8">
        <v-row class="pb-10">
          <v-card-title class="main-title">Мои события</v-card-title>
        </v-row>
        <v-row>
          <v-col>
            <EventCard
              :onClick="forwardToCreatePage"
              event-name="Создать мероприятие"
              icon-name="mdi-plus"
            >
            </EventCard>
          </v-col>
          <v-col v-for="event in eventStore.eventList" :key="event.id">
            <EventCard
              :onClick="forwardToEventPage"
              :value="event.id"
              :event-name="event.eventName"
              :event-date="getDate(event.eventDate)"
              :event-time="getTime(event.eventDate)"
            >
            </EventCard>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useEventStore } from "@/stores/event";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import EventCard from "./components/EventCard.vue";
import ChipField from "./components/template/ChipField.vue";

const eventStore = useEventStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  eventStore.selectedEvent = null;
  await eventStore.getEvents();
});

const getDate = (dateString: string | Date): string => {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getTime = (dateString: string | Date): string => {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const forwardToCreatePage = () => {
  router.push("/event/create");
};

const forwardToEventPage = (id: string) => {
  router.push(`/event/${id}`);
};

const deleteEvent = (eventId: string) => {
  eventStore.deleteEvent(eventId);
};
</script>

<style scoped></style>
