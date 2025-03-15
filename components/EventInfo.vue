<template>
  <v-container
    v-if="!eventStore.loadingStatuses.selecetedEvent"
    max-width="1400px"
  >
    <v-row>
      <v-col cols="8">
        <v-row align="center">
          <v-col cols="7">
            <div class="main-title">
              {{ eventStore.selectedEvent.eventName }}
            </div>
          </v-col>
          <v-col cols="5">
            <ButtonDefault
              class="w-100 big-button"
              text="Настроить"
              :color="themeColors.primary"
              :click-function="forwardToSettingsPage"
              style="font-size: 20px"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="7">
            <v-row>
              <v-col cols="7">
                <CardDefault :text="eventStore.selectedEvent.eventDate" />
              </v-col>
              <v-col>
                <CardDefault :text="eventStore.selectedEvent.eventTime" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5">
            <YandexMap
              v-model="eventStore.selectedEvent.eventLocation"
              label="Местоположение"
              readonly
              height="200px"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="7">
            <v-card class="event-card h-100" rounded="xl">
              <v-row align="center" justify="center">
                <template v-for="(item, index) in guestStats" :key="index">
                  <v-col class="text-center">
                    <h3 class="subtitle pt-5">{{ item.cardLabel }}</h3>
                    <div class="main-title px-5 py-5">
                      {{ item.count }}
                    </div>
                  </v-col>

                  <v-divider
                    v-if="index !== guestStats.length - 1"
                    class="my-8"
                    vertical
                  ></v-divider>
                </template>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="5">
            <v-row align="center" justify="center">
              <v-col
                v-for="(item, index) in icons"
                :key="index"
                class="text-center"
              >
                <a :href="getLink(item)" target="_blank" class="no-underline">
                  <v-card class="event-card h-100" rounded="xl" link>
                    <h3 class="subtitle pt-5">{{ item.label }}</h3>
                    <v-icon class="mx-5 my-5" size="50px">
                      {{ item.icon }}
                    </v-icon>
                  </v-card>
                </a>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4"> <EventTodo /></v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-card rounded="xl">
          <v-data-table :headers="headers" :items="guests">
            <template v-slot:top>
              <v-toolbar flat :color="themeColors.primary">
                <v-toolbar-title>
                  <v-row align="center" no-gutters class="gap-2">
                    <v-card-title>Гости</v-card-title>
                    <v-progress-circular
                      v-if="eventStore.loadingStatuses.guestList"
                      :size="20"
                      :width="2"
                      color="primary"
                      indeterminate
                    ></v-progress-circular>
                  </v-row>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn
                  class="mr-5"
                  prepend-icon="mdi-plus"
                  rounded="xl"
                  text="Добавить"
                  border
                  @click="openGuestAdd"
                ></v-btn>
              </v-toolbar>
            </template>

            <template v-slot:item.guestStatus="{ item }">
              <v-chip :color="getStatusColor(item.guestStatus)" dark>
                {{ getStatusText(item.guestStatus) }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-2 justify-end">
                <v-btn icon flat @click="openGuestUpdate(item)">
                  <v-icon icon="mdi-pencil" size="large"></v-icon>
                </v-btn>
                <v-btn icon flat @click="openGuestDelete(item)">
                  <v-icon color="error" icon="mdi-delete" size="large"></v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-data-table> </v-data-table>
      </v-col>
    </v-row>
    <GuestAddDialog />
    <GuestUpdateDialog />
    <GuestDeleteDialog />
  </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useGuestStore } from "@/stores/guest";
import { useDialogStore } from "@/stores/dialog";
import { computed, onMounted } from "vue";
import { themeColors, gradientSettings } from "@/config/themeConfig"; // Импортируем конфигурацию

import CardDefault from "./components/template/CardDefault.vue";
import ButtonDefault from "./components/template/ButtonDefault.vue";
import YandexMap from "./components/template/YandexMap.vue";
import GuestAddDialog from "./components/GuestAddDialog.vue";
import GuestUpdateDialog from "./components/GuestUpdateDialog.vue";
import GuestDeleteDialog from "./components/GuestDeleteDialog.vue";
import EventTodo from "./components/EventTodo.vue";
import type { Guest } from "@/types/guest";

// Получаем маршрут
const route = useRoute();
const router = useRouter();

const eventStore = useEventStore();
const guestStore = useGuestStore();
const dialogStore = useDialogStore();

const icons = [
  {
    label: "Плейлист",
    icon: "mdi-music-note-eighth",
    link: "https://spacewedding.ru/",
  },
  { label: "Приглашение", icon: "mdi-heart", link: "/invite/id" }, // заменим на путь приложения
];

const headers = ref([
  { title: "Имя гостя", key: "guestName" },
  { title: "Телефон", key: "guestPhone" },
  { title: "Статус", key: "guestStatus", class: "blue lighten-5" },
  { title: "", key: "actions", sortable: false, class: "blue lighten-5" },
]);

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const guestStats = computed(() => {
  return eventStore.selectedEvent.guestStatuses.map((status) => ({
    ...status,
    count: getStatusCount(status.id),
  }));
});

const guests = computed(() => {
  return eventStore.selectedEvent.guests;
});

const getStatusText = (status: string) => {
  const sts = eventStore.selectedEvent.guestStatuses.find(
    (s) => s.id === status
  );
  return sts?.status;
};

// Функция для определения цвета статуса
const getStatusColor = (status: string) => {
  const sts = eventStore.selectedEvent.guestStatuses.find(
    (s) => s.id === status
  );
  return sts?.color;
};

// Загрузка ивентов (если они еще не были загружены)
onMounted(async () => {
  await eventStore.getEventById(eventId);
  await eventStore.getDesigns();
});
// Функция для получения правильной ссылки
const getLink = (item: any) => {
  // Проверка, если ссылка начинается с твоего домена
  if (item.link.startsWith("https://spacewedding.ru/")) {
    return item.link; // Сторонняя ссылка
  } else {
    return `${window.location.origin}${item.link.replace("id", eventId)}`; // Путь внутри приложения, заменяем {id} на нужный параметр
  }
};

// // Функция для определения цвета статуса
const getStatusCount = (status: string) => {
  switch (status) {
    case "1":
      return eventStore.eventGuestComeCount;
    case "2":
      return eventStore.eventGuestNotComeCount;
    case "3":
      return eventStore.eventGuestUnknownComeCount;
    default:
      return 0;
  }
};

const openGuestAdd = () => {
  dialogStore.showDialog("guestAdd");
};

const openGuestUpdate = (item: Guest) => {
  const guestToUpdate = JSON.parse(JSON.stringify(item));
  guestStore.guest = guestToUpdate;
  dialogStore.showDialog("guestUpdate");
};

const openGuestDelete = (item: Guest) => {
  const guestToDelete = JSON.parse(JSON.stringify(item));
  guestStore.guest = guestToDelete;
  dialogStore.showDialog("guestDelete");
};

const forwardToSettingsPage = () => {
  router.push(`/event/settings/${eventId}`);
};

</script>
