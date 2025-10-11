<template>
  <DialogDefault
    v-if="dialogStore.type === 'addAllowedUsers'"
    title="Добавление гостя"
    confirmText="Да"
  >
    <InputText
      v-model="query"
      label="Введите имя пользователя или email для поиска"
      :loading="usersStore.loadingStatuses.searchUsers"
      @input-change="searchUsers"
    />
    <v-card-subtitle
      v-if="usersStore.usersList.length === 0"
      class="text-center my-15"
    >
      Пользователи не найдены
    </v-card-subtitle>
    <v-card
      v-for="user in usersStore.usersList"
      class="my-5"
      variant="flat"
      color="secondary"
    >
      <div v-if="user.id !== eventStore.selectedEventCurrent.userId">
        <v-card-title>{{ user.username }}</v-card-title>
        <v-card-subtitle>{{ user.email }}</v-card-subtitle>
        <v-card-actions 
          >
          <!-- <v-btn color="white" @click="addAllowedUser(user.id)">
            добавить
          </v-btn> -->
          <ButtonDefault
            class="w-25 mb-2 mt-2"
            text="Добавить"
            :loading="usersStore.loadingStatuses.addAllowedUser"
            @click="addAllowedUser(user.id)"
          ></ButtonDefault>
        </v-card-actions>
      </div>
    </v-card>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useUsersStore } from "@/features/user/stores/users";
import { useEventStore } from "@/features/event/stores/event";
import { useDialogStore } from "@/stores/dialog";
import { ref } from "vue";

import DialogDefault from "@/shared/components/DialogDefault.vue";
import InputText from "@/shared/components/InputText.vue";
import ButtonDefault from "@/shared/components/ButtonDefault.vue";

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
  if (query.value) {
    usersStore.searchUsers(query.value);
  }
};
</script>
