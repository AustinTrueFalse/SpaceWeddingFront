<template>
  <v-container
    v-if="!eventStore.loadingStatuses.selectedEvent"
    max-width="1400px"
  >
    <v-row>
      <v-col cols="9">
        <div class="main-title d-flex align-center justify-space-between">
          <div>
            {{ eventStore.selectedEvent.eventName }}
          </div>
          <div class="d-flex align-center">
            <v-btn
              class="mr-2"
              append-icon="mdi-cog"
              variant="tonal"
              @click="forwardToSettingsPage()"
            >
              Настроить мероприятие
            </v-btn>
            <v-menu
              v-model="menu"
              transition="slide-y-transition"
              offset-y
              min-width="300"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  append-icon="mdi-account"
                  color="primary"
                  variant="tonal"
                >
                  Управление доступом
                </v-btn>
              </template>

              <v-card width="265px">
                <v-card-text>
                  <div
                    v-for="user in eventStore.selectedEvent.allowedUsers"
                    :key="user.id"
                  >
                    <div
                      class="pl-1 mb-3"
                      v-if="user.id === eventStore.selectedEvent.userId"
                    >
                      <v-icon color="primary" class="mr-1">mdi-creation</v-icon> Создано {{ user.username }}
                    </div>
                    <v-chip v-else rounded="xl" class="mx-1 my-1">
                      <span>{{ user.username }}</span>
                      <v-btn
                        class="pl-5 mt-1"
                        size="x-small"
                        icon
                     
                        variant="plain"
                        @click="removeAllowedUser(user.id)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-chip>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="openAddAllowedUsersDialog">Пригласить</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
        </div>

        <v-chip class="mt-3" rounded="xl" size="x-large" color="primary">
          <div class="main-title py-5">
            <span class="mdi mdi-calendar-range"></span> {{ dateTime }}
          </div>
        </v-chip>

        <v-row class="mt-10">
          <v-col cols="9">
            <v-row>
              <v-col>
                <YandexMap
                  v-model="eventStore.selectedEvent.eventLocation"
                  label="Местоположение"
                  readonly
                  height="350px"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-col>
                <v-card class="event-card" rounded="xl">
                  <div
                    class="text-center my-5"
                    v-for="(item, index) in guestStats"
                    :key="index"
                  >
                    <h3 class="subtitle">{{ item.cardLabel }}</h3>
                    <div class="main-title">
                      {{ item.count }}
                    </div>

                    <v-divider
                      v-if="index !== guestStats.length - 1"
                      class="my-3"
                    ></v-divider>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <EventTodo />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col cols="8">
            <v-card rounded="xl">
              <v-data-table
                :headers="headersGuests"
                :items="guests"
                :items-per-page-text="'Элементов на странице'"
                :page-text="''"
                :items-per-page-all-text="'123'"
                :items-per-page-options="[
                  { value: 10, title: '10' },
                  { value: 25, title: '25' },
                  { value: -1, title: 'Все' },
                ]"
                no-data-text="Отсутствуют данные"
              >
                <template v-slot:top>
                  <v-toolbar flat color="primary">
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
                      prepend-icon="mdi-account-box-multiple"
                      rounded="xl"
                      text="Описание гостей"
                      border
                      @click="openGuestsDescr"
                    ></v-btn>
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

                <template v-slot:item.guestTag="{ item }">
                  <v-chip>
                    {{ item.guestTag.tagName }}
                  </v-chip>
                </template>

                <template v-slot:item.guestStatus="{ item }">
                  <v-chip :color="getStatusColor(item.guestStatus)">
                    {{ getStatusText(item.guestStatus) }}
                  </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                  <div class="d-flex ga-2 justify-end">
                    <v-btn icon flat @click="openGuestUpdate(item)">
                      <v-icon icon="mdi-pencil" size="large"></v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card rounded="xl">
              <v-data-table
                :headers="headersDrinks"
                :items="guestDrinks"
                :items-per-page-text="'Элементов на странице'"
                :page-text="''"
                :items-per-page-all-text="'123'"
                :items-per-page-options="[
                  { value: 10, title: '10' },
                  { value: 25, title: '25' },
                  { value: -1, title: 'Все' },
                ]"
              >
                <template v-slot:top>
                  <v-toolbar flat color="primary">
                    <v-toolbar-title>
                      <v-row align="center" no-gutters class="gap-2">
                        <v-card-title>Напитки</v-card-title>
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
                      icon
                      flat
                      @click="openDrinkInfoDialog()"
                    >
                      <v-icon icon="mdi-more" size="large"></v-icon>
                    </v-btn>
                  </v-toolbar>
                </template>

                <template v-slot:item.drinkCount="{ item }">
                  <v-chip>
                    {{ item.drinkCount }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <div>
          <v-row
            align="center"
            justify="center"
            v-for="(item, index) in iconsLink"
            :key="index"
          >
            <v-col class="pt-0">
              <a :href="getLink(item)" target="_blank" class="no-underline">
                <v-card class="event-card h-100" rounded="xl" link>
                  <v-row justify="center">
                    <v-col cols="1">
                      <v-icon class="my-4" size="30px">
                        {{ item.icon }}
                      </v-icon>
                    </v-col>
                    <v-col cols="9" class="ml-5">
                      <h3 class="subtitle my-4">
                        {{ item.label }}
                      </h3>
                    </v-col>
                  </v-row>
                </v-card>
              </a>
            </v-col>
          </v-row>
          <v-row
            align="center"
            justify="center"
            v-for="(item, index) in iconsDialog"
            :key="index"
          >
            <v-col class="pt-0">
              <v-card
                class="event-card h-100"
                rounded="xl"
                link
                @click="openBlankDialog(item.dialog)"
              >
                <v-row justify="center">
                  <v-col cols="1">
                    <v-icon class="my-4" size="30px">
                      {{ item.icon }}
                    </v-icon>
                  </v-col>
                  <v-col cols="9" class="ml-5">
                    <h3 class="subtitle my-4">
                      {{ item.label }}
                    </h3>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="pt-0">
            <v-col class="pt-0">
              <v-card
                class="event-card h-100"
                rounded="xl"
                link
                @click="exportGuestsToExcel()"
              >
                <v-row justify="center">
                  <v-col cols="1">
                    <v-icon class="my-4" size="30px">
                      mdi-microsoft-excel
                    </v-icon>
                  </v-col>
                  <v-col cols="9" class="ml-5">
                    <h3 class="subtitle my-4">Экспорт Excel</h3>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <DrinkInfoDialog />
    <GuestAddDialog />
    <GuestUpdateDialog />
    <GuestDeleteDialog />
    <GuestsDescriptionDialog />
    <BlankDialog />
    <AddAllowedUserDialog />
  </v-container>
</template>

<script lang="ts" setup>
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useGuestStore } from "@/stores/guest";
import { useDialogStore } from "@/stores/dialog";
import { useUsersStore } from "@/stores/users";
import { ref, computed, onMounted } from "vue";
import { formatDate, formatDateTime } from "../helpers/helpFunctions";

import CardDefault from "@/components/template/CardDefault.vue";
import ButtonDefault from "@/components/template/ButtonDefault.vue";
import YandexMap from "@/components/template/YandexMap.vue";
import GuestAddDialog from "@/components/GuestAddDialog.vue";
import GuestUpdateDialog from "@/components/GuestUpdateDialog.vue";
import GuestDeleteDialog from "@/components/GuestDeleteDialog.vue";
import GuestsDescriptionDialog from "@/components/GuestsDescriptionDialog.vue";
import DrinkInfoDialog from "@/components/DrinkInfoDialog.vue";
import BlankDialog from "@/components/BlankDialog.vue";
import AddAllowedUserDialog from "@/components/AddAllowedUserDialog.vue";

import EventTodo from "@/components/EventTodo.vue";
import type { Guest } from "@/types/guest";
import type { Drink } from "@/types/drink";

// Получаем маршрут
const route = useRoute();
const router = useRouter();

const eventStore = useEventStore();
const guestStore = useGuestStore();
const dialogStore = useDialogStore();
const usersStore = useUsersStore();

const iconsLink = [
  {
    label: "Плейлист",
    icon: "mdi-music-note-eighth",
    link: "https://spacewedding.ru/",
  },
  { label: "Приглашение", icon: "mdi-heart", link: "/invite/id" },
];

const iconsDialog = [
  { label: "Анкета жениха", icon: "mdi-face-man", dialog: "groomBlank" },
  { label: "Анкета невесты", icon: "mdi-face-woman", dialog: "brideBlank" },
];
const menu = ref(false);
const headersGuests = ref([
  { title: "Имя гостя", key: "guestName" },
  { title: "Телефон", key: "guestPhone" },
  { title: "Тип гостя", key: "guestTag" },
  { title: "Статус", key: "guestStatus", class: "blue lighten-5" },
  {
    title: "",
    key: "actions",
    sortable: false,
    class: "blue lighten-5",
    width: "30px",
  },
]);

const headersDrinks = ref([
  { title: "Напиток", key: "drinkName" },
  { title: "Кол-во", key: "drinkCount" },
]);

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const dateTime = computed(() => {
  return formatDateTime(
    eventStore.selectedEvent.eventDate,
    eventStore.selectedEvent.eventTime
  );
});

const date = computed(() => {
  return formatDate(eventStore.selectedEvent.eventDate);
});

const guestStats = computed(() => {
  return eventStore.selectedEvent.guestStatuses.map((status) => ({
    ...status,
    count: getStatusCount(status.id),
  }));
});

const guests = computed(() => {
  return eventStore.selectedEvent.guests;
});

const guestDrinks = computed(() => {
  // Массив для хранения результатов
  const drinksArray: { id: string; drinkName: string; drinkCount: number }[] =
    [];

  // Проходим по каждому гостю и его напиткам
  eventStore.selectedEvent.guests.forEach((guest) => {
    guest.guestDrinks.forEach((drink: Drink) => {
      // Ищем напиток в массиве
      const existingDrink = drinksArray.find(
        (item) => item.drinkName === drink.drinkName
      );

      if (existingDrink) {
        // Если напиток уже есть в массиве, увеличиваем его количество
        existingDrink.drinkCount++;
      } else {
        // Если напитка нет в массиве, добавляем новый объект
        drinksArray.push({
          id: drink.id,
          drinkName: drink.drinkName,
          drinkCount: 1,
        });
      }
    });
  });

  // Возвращаем массив с напитками и их количеством
  return drinksArray;
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

const exportGuestsToExcel = () => {
  {
    const fileName = eventStore.selectedEvent.eventName;

    const guestsData = guests.value.map((guest) => ({
      ...guest,
      guestStatusDisplay: eventStore.selectedEvent.guestStatuses.find(
        (sts) => sts.id === guest.guestStatus
      )?.status,
      guestDrinksDisplay: guest.guestDrinks
        .map((drink) => drink.drinkName)
        .join(", "),
    }));

    const excelData = guestsData.map((guest) => ({
      Имя: guest.guestName,
      Телефон: guest.guestPhone,
      Статус: guest.guestStatusDisplay, // уже текст (см. computed ниже)
      Тег: guest.guestTag.tagName,
      Описание: guest.guestDescr,
      Напитки: guest.guestDrinksDisplay,
    }));

    if (excelData.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Гости");
      // Генерируем Excel-файл в виде массива байт и сохраняем его
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}_список_гостей.xlsx`);
    }
  }
};

const openGuestAdd = () => {
  dialogStore.showDialog("guestAdd");
};

const openGuestsDescr = () => {
  dialogStore.showDialog("guestsDescr");
};

const openBlankDialog = (dialog: string) => {
  dialogStore.showDialog(dialog);
};

const openDrinkInfoDialog = () => {
  dialogStore.showDialog("drinkInfo");
};

const openAddAllowedUsersDialog = () => {
  dialogStore.showDialog("addAllowedUsers");
};

const openGuestUpdate = (item: Guest) => {
  const guestToUpdate = JSON.parse(JSON.stringify(item));
  guestStore.guest = guestToUpdate;
  dialogStore.showDialog("guestUpdate");
};

const forwardToSettingsPage = () => {
  router.push(`/event/settings/${eventId}`);
};

const removeAllowedUser = async (removingUserId: string) => {
  try {
    await usersStore.removeAllowedUser(eventId, removingUserId); // Если здесь ошибка, выполнение перейдет в catch
    await eventStore.getEventById(eventId); // Выполнится только если addGuestAuth успешен
  } catch (error) {}
};
</script>
