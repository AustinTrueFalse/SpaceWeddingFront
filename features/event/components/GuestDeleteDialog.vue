<template>
  <DialogDefault
    v-if="dialogStore.type === 'guestDelete'"
    title="Вы уверены что хотите удалить гостя?"
    width="450px"
  >
    <v-row justify="center" class="pt-2">
      <v-col cols="5" class="pb-0">
        <ButtonDefault
          class="mb-5 w-100"
          text="Удалить"
          color="error"
          :loading="guestStore.loadingStatuses.guestAdd"
          @click="deleteGuest"
        ></ButtonDefault>
      </v-col>
      <v-col cols="5" class="pb-0">
        <ButtonDefault
          class="mb-5 w-100"
          text="Отмена"
          @click="hideDialog"
        ></ButtonDefault>
      </v-col>
    </v-row>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useEventStore } from "../stores/event";
import { useGuestStore } from "../stores/guest";
import { useDialogStore } from "@/stores/dialog";

import DialogDefault from "@/shared/components/DialogDefault.vue";
import ButtonDefault from "@/shared/components/ButtonDefault.vue";

// Получаем маршрут
const route = useRoute();

const eventStore = useEventStore();
const guestStore = useGuestStore();
const dialogStore = useDialogStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;
const deleteGuest = async () => {
  try {
    await guestStore.deleteGuest(guestStore.guest.id, eventId);
    await eventStore.getGuests(eventId);
  } catch (error) {
  } finally {
    dialogStore.hideDialog();
  }
};

const hideDialog = () => {
  dialogStore.hideDialog();
};
</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>
