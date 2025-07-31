<template>
  <DialogDefault
    v-if="dialogStore.type === 'addPlaylistLink'"
    title="Плэйлист"
    confirmText="Да"
  >
    <div class="d-flex align-center">
      <InputText
        v-model="eventStore.selectedEventCurrent.playlistLink"
        label="Введите ссылку на плэйлист"
        :rules="playlistLinkRule"
      />
      <v-btn
        v-if="eventStore.selectedEventOriginal.playlistLink"
        class="mb-5 ml-3"
        :href="eventStore.selectedEventOriginal.playlistLink"
        target="_blank"
        rel="noopener"
        color="primary"
        variant="text"
        icon
      >
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </div>

    <v-row justify="center" class="mt-3">
      <v-col cols="6">
        <ButtonDefault
          class="mb-3 w-100"
          color="secondary"
          text="Сохранить"
          :disabled="isPlaylistButtonDisabled"
          :loading="eventStore.loadingStatuses.eventUpdate"
          @click="updatePlaylistlink"
        ></ButtonDefault>
      </v-col>
    </v-row>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useEventStore } from "../stores/event";
import { useDialogStore } from "@/stores/dialog";
import { ref } from "vue";

import DialogDefault from "@/shared/components/DialogDefault.vue";
import InputText from "@/shared/components/InputText.vue";
import ButtonDefault from "@/shared/components/ButtonDefault.vue";

// Получаем маршрут
const route = useRoute();

const eventStore = useEventStore();
const dialogStore = useDialogStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const isPlaylistButtonDisabled = computed(() => {
  const hasChanges =
    eventStore.selectedEventCurrent.playlistLink ===
    eventStore.selectedEventOriginal.playlistLink;

  return hasChanges || !eventStore.selectedEventCurrent.playlistLink;
});

const playlistLinkRule = computed(() => {
  if (!eventStore.selectedEventCurrent.playlistLink) {
    return ["Ссылка не может быть пустой"];
  } else {
    return [];
  }
});

// Функция сохранения данных
const updatePlaylistlink = async () => {
  if (eventStore.selectedEventCurrent.playlistLink) {
    await eventStore.updateEvent(eventId);
    await eventStore.getEventById(eventId);
  }
};
</script>
