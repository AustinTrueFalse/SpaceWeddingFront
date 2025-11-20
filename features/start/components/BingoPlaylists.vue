<template>
  <v-container max-width="1400px">
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            ><v-card-title class="main-title">Мои плэйлисты</v-card-title
            ><EventCard
              class="mt-8"
              :onClick="forwardToCreatePage"
              event-name="Создать плэйлист"
              icon-name="mdi-creation"
            >
            </EventCard
          ></v-col>
        </v-row>
        <v-row>
          <v-col v-for="playlist in playlistStore.playlists" :key="playlist.id">
            <EventCard
              :onClick="forwardToEventPage"
              :value="playlist.id"
              :event-name="playlist.playlistName"
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
import { usePlaylistStore } from "@/features/playlist/stores/playlist";
import { useDialogStore } from "@/stores/dialog";
import { useRouter } from "vue-router";
import EventCard from "@/features/event/components/EventCard.vue";

const playlistStore = usePlaylistStore();
const dialogStore = useDialogStore();
const router = useRouter();

onMounted(async () => {
  //eventStore.selectedEvent = null;
  await playlistStore.getPlaylists();
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
  playlistStore.resetSelectedPlaylist();
  router.push("/playlist/create");
};

const forwardToEventPage = (id: string) => {
  router.push(`/playlist/${id}`);
};
</script>

<style scoped></style>
