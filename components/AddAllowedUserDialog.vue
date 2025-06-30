<template>
  <DialogDefault
    v-if="dialogStore.type === 'addAllowedUsers'"
    title="Добавление гостя"
    confirmText="Да"
  >
    <InputText
      v-model="query"
      label="Введите имя пользователя или email для поиска"
      :loading-status="usersStore.loadingStatuses.searchUsers"
      @input="searchUsers"
    />
    <v-card
      v-for="user in usersStore.usersList"
      class="my-2"
      variant="flat"
      color="secondary"
    >
      <div v-if="user.id !== eventStore.selectedEvent.userId">
        <v-card-title>{{ user.username }}</v-card-title>
        <v-card-subtitle>{{ user.email }}</v-card-subtitle>
        <v-card-actions
          ><v-btn color="white" @click="addAllowedUser(user.id)">
            добавить
          </v-btn></v-card-actions
        >
      </div>
    </v-card>
    <v-row justify="center" class="pt-10">
      <v-col cols="6">
        <ButtonDefault
          class="mb-5 w-100"
          color="secondary"
          text="Добавить"
          :loading-status="eventStore.loadingStatuses.addAllowedUser"
          :click-function="addAllowedUser"
        ></ButtonDefault>
      </v-col>
    </v-row>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useUsersStore } from "@/stores/users";
import { useEventStore } from "@/stores/event";
import { useDialogStore } from "@/stores/dialog";
import { ref } from "vue";

import DialogDefault from "@/components/template/DialogDefault.vue";
import InputText from "@/components/template/InputText.vue";
import ButtonDefault from "@/components/template/ButtonDefault.vue";

// Получаем маршрут
const route = useRoute();

const usersStore = useUsersStore();
const eventStore = useEventStore();
const dialogStore = useDialogStore();

const query = ref("");

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const addAllowedUser = async (addingUserId: string) => {
  try {
    await usersStore.addAllowedUser(eventId, addingUserId); // Если здесь ошибка, выполнение перейдет в catch
    await eventStore.getEventById(eventId); // Выполнится только если addGuestAuth успешен
  } catch (error) {
  } finally {
    dialogStore.hideDialog();
  }
};

const searchUsers = async () => {
  usersStore.searchUsers(query.value);
};
</script>
