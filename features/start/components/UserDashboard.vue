<template>
  <v-container max-width="1400px">
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            ><v-card-title class="main-title">Мои события</v-card-title
            ><EventCard
              class="mt-8"
              :onClick="forwardToCreatePage"
              event-name="Создать мероприятие"
              icon-name="mdi-creation"
            >
            </EventCard
          ></v-col>
        </v-row>
        <v-row>
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
  <UserAvatarDialog />
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useEventStore } from "@/features/event/stores/event";
import { useDialogStore } from "@/stores/dialog";
import { useRouter } from "vue-router";
import EventCard from "@/features/event/components/EventCard.vue"

const eventStore = useEventStore();
const dialogStore = useDialogStore();
const router = useRouter();

onMounted(async () => {
  //eventStore.selectedEvent = null;
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
  eventStore.resetSelectedEvent();
  router.push("/event/create");
};

const forwardToEventPage = (id: string) => {
  router.push(`/event/${id}`);
};

const openChangeAvatarDialog = () => {
  dialogStore.showDialog("changeAvatar");
};
</script>

<style scoped></style>
