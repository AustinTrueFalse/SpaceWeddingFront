<template>
  <v-container max-width="1000px" class="mb-15">
    <v-row justify="center">
      <v-col>
        <InputTextRaw
          v-model="selectedEvent.eventName"
          label="Название мероприятия"
        />
        <v-row justify="center" class="mt-15">
          <v-col cols="3">
            <DatePicker
              :model-value="selectedDate"
              :onUpdate="(value: Date) => (selectedDate = value)"
              label="Дата мероприятия"
            ></DatePicker>
          </v-col>
          <v-col cols="3">
            <InputText
              v-model="selectedEvent.eventTime"
              time
              label="Время мероприятия"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-card-title class="mt-15 text-center main-title"
              >Место события</v-card-title
            >
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="10">
            <YandexMap
              v-model="eventStore.selectedEventCurrent.eventLocation"
              label="Местоположение"
            />
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col>
            <v-card-title class="mt-15 text-center main-title"
              >Стиль</v-card-title
            >
          </v-col>
        </v-row>
        <v-item-group v-model="selectedDesign" :mandatory="true">
          <v-container>
            <v-row justify="center">
              <v-col
                v-for="design in eventStore.designList"
                :key="design.id"
                cols="12"
                md="4"
              >
                <v-item
                  :value="design.designName"
                  v-slot="{ isSelected, toggle }"
                >
                  <v-card
                    class="d-flex align-center"
                    height="200"
                    rounded="xl"
                    elevation="0"
                    
                    :color="isSelected ? 'primary' : 'surface'"
                    @click="toggle"
                  >
                    <div class="text-h3 flex-grow-1 text-center">
                      <v-icon
                        v-if="getDesignIcon(design.designName)"
                        class="mr-4"
                        size="x-small"
                        >{{ getDesignIcon(design.designName) }}</v-icon
                      >{{ design.designName }}
                    </div>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
        <v-row justify="center">
          <v-col>
            <v-card-title class="mt-15 text-center main-title"
              >Имена</v-card-title
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <InputTextRaw
              v-model="selectedEvent.eventCouple.groomName"
              label="Имя жениха"
            />
          </v-col>
          <v-col>
            <InputTextRaw
              v-model="selectedEvent.eventCouple.brideName"
              label="Имя невесты"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-card-title class="mt-15 text-center main-title"
              >Тайминг
              <ButtonIcon mdi-icon="mdi-plus" @click="addTiming" />
            </v-card-title>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col> </v-col>
        </v-row>

        <v-row justify="center">
          <div
            v-if="selectedEvent.eventTiming.length === 0"
            class="text-center header-font increase-font"
          >
            Добавьте информацию о тайминге
          </div>
          <v-col cols="10">
            <InputTextDouble
              v-for="(item, index) in selectedEvent.eventTiming"
              :key="item.id"
              v-model:modelValue="selectedEvent.eventTiming[index]"
              :first-field="'time'"
              :second-field="'description'"
              :first-label="'Время'"
              :second-label="'Описание'"
              :readonly="false"
            >
              <ButtonIcon
                class="mb-5"
                mdi-icon="mdi-close"
                color="accent"
                @click="() => deleteTiming(item.id)"
              />
            </InputTextDouble>
          </v-col>
        </v-row>
        <v-card-title class="mt-15 text-center main-title"
          >Цвета<ColorPicker @updateColor="addEventColor" />
        </v-card-title>

        <v-row justify="center" class="pt-3">
          <div
            v-if="eventColors.length === 0"
            class="text-center header-font increase-font mt-10"
          >
            Добавьте цвета вашей свадьбы
          </div>
          <v-col cols="12">
            <v-row>
              <v-col v-for="color in eventColors" class="pa-0 ma-0 mt-5">
                <v-card
                  rounded="xl"
                  :color="color"
                  height="250"
                  class="mx-2"
                  elevation="0"
                  style="position: relative"
                >
                  <v-btn
                    color="surface"
                    variant="tonal"
                    icon
                    style="
                      position: absolute;
                      top: 10px;
                      right: 10px;
                      z-index: 1;
                    "
                    @click="deleteEventColor(color)"
                  >
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="5">
            <v-card-title class="mt-15 text-center main-title"
              >Напитки</v-card-title
            >
          </v-col>
          <v-col cols="5">
            <v-card-title class="mt-15 text-center main-title"
              >Тэги гостей</v-card-title
            >
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="5">
            <Combobox
              v-model="selectedEvent.eventDrinks"
              :items="eventStore.drinksDictionary"
              item-label="drinkName"
              item-value="id"
              label="Выберите или введите свои"
            />
          </v-col>
          <v-col cols="5">
            <Combobox
              v-model="selectedEvent.eventTags"
              :items="eventStore.tagsDictionary"
              item-label="tagName"
              item-value="id"
              label="Выберите или введите свои"
            />
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="5">
            <ButtonDefault
              class="mt-15 w-100"
              text="Отмена"
              @click="exitFromEdit"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="5">
            <ButtonDefault
              class="w-100"
              text="Просмотреть приглашение"
              color="primary"
              @click="openInvitePreview"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="5">
            <ButtonDefault
              class="w-100"
              variant="tonal"
              color="primary"
              :text="buttonCreateText"
              :loading="eventStore.loadingStatuses.eventCreate || eventStore.loadingStatuses.eventUpdate"
              @click="createEvent"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <InvitePreviewDialog />
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEventStore } from "../stores/event";;
import { useDialogStore } from "@/stores/dialog";

import ColorPicker from "@/shared/components/ColorPicker.vue";
import InputText from "@/shared/components/InputText.vue";
import InputTextRaw from "@/shared/components/InputTextRaw.vue";
import InputTextDouble from "@/shared/components/InputTextDouble.vue";
import ButtonDefault from "@/shared/components/ButtonDefault.vue";
import ButtonIcon from "@/shared/components/ButtonIcon.vue";
import DatePicker from "@/shared/components/DatePicker.vue";
import YandexMap from "@/shared/components/YandexMap.vue";
import Combobox from "@/shared/components/Combobox.vue";

import InvitePreviewDialog from "@/features/invite/components/InvitePreviewDialog.vue";

const router = useRouter();

const eventStore = useEventStore();
const dialogStore = useDialogStore();

const designIcons: { dark: string; simple: string } = {
  dark: "mdi-weather-night",
  simple: "mdi-white-balance-sunny",
};

const selectedEvent = computed(() => eventStore.selectedEventCurrent);

const selectedDate = computed({
  get: () => eventStore.selectedEventCurrent.eventDate,
  set: (value: Date) => eventStore.setDate(value),
});

const selectedDesign = computed({
  get: () => eventStore.selectedEventCurrent.eventDesignId,
  set: (design) => {
    eventStore.selectedEventCurrent.eventDesignId = design;
  },
});

const buttonCreateText = computed(() => {
  return eventStore.selectedEventCurrent.id ? "Сохранить" : "Создать";
});

const eventColors = computed(() => {
  return eventStore.selectedEventCurrent.eventInvite.colorsInfo?.colors;
});

onMounted(async () => {
  await eventStore.getDesigns();
  await eventStore.getDrinks();
  await eventStore.getTags();
  await eventStore.getGuestStatuses();
});

const getDesignIcon = (design: string) => {
  if (design === "gothic") {
    return designIcons.dark;
  }

  if (design === "simple") {
    return designIcons.simple;
  }
};

const addEventColor = (color: string) => {
  const isColorExist = eventColors.value.some(
    (eventColor) => eventColor === color
  );

  if (!isColorExist) {
    eventStore.addEventColor(color);
  }
};

const deleteEventColor = (color: string) => {
  eventStore.deleteEventColor(color);
};

const addTiming = () => {
  eventStore.addTiming();
};

const deleteTiming = (id: string) => {
  eventStore.deleteTiming(id);
};

const createEvent = async () => {
  if (eventStore.selectedEventCurrent.id) {
    await eventStore.updateEvent(eventStore.selectedEventCurrent.id);
    router.push(`/event/${eventStore.selectedEventCurrent.id}`);
  } else {
    await eventStore.createEvent();
    router.push("/dashboard");
  }
};

const exitFromEdit = () => {
  if (eventStore.selectedEventCurrent.id) {
    eventStore.resetCurrentToOriginal();
    router.push(`/event/${eventStore.selectedEventCurrent.id}`);
  } else {
    router.push("/dashboard");
  }
};

const openInvitePreview = () => {
  dialogStore.showDialog("invitePreview");
};
</script>
