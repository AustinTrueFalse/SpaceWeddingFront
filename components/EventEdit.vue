<template>
  <v-container max-width="1000px" class="mb-15">
    <v-row>
      <v-col>
        <ButtonIcon
          class="mb-5"
          mdi-icon="mdi-arrow-left"
          color="accent"
          :click-function="exitFromEdit"
        />
      </v-col>
    </v-row>
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
              bg-color="primary"
            ></DatePicker>
          </v-col>
          <v-col cols="3">
            <InputText
              v-model="selectedEvent.eventTime"
              time
              label="Время мероприятия"
              bg-color="primary"
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
        <v-item-group
          v-model="selectedDesign"
          selected-class="bg-primary"
          :mandatory="true"
        >
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
                    :class="[
                      'd-flex align-center',
                      isSelected ? 'selected-card' : 'default-card',
                      isSelected ? 'purple-accent-1' : 'grey-light',
                    ]"
                    height="200"
                    rounded="xl"
                    @click="toggle"
                  >
                    <div class="text-h3 flex-grow-1 text-center">
                      {{ design.designName }}
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
              <ButtonIcon mdi-icon="mdi-plus" :click-function="addTiming" />
            </v-card-title>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col> </v-col>
        </v-row>

        <v-row justify="center">
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
              bg-color="primary"
            >
              <ButtonIcon
                class="mb-5"
                mdi-icon="mdi-close"
                color="accent"
                :click-function="() => deleteTiming(item.id)"
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
                  style="position: relative"
                >
                  <v-btn
                    variant="tonal"
                    @click="deleteEventColor(color)"
                    style="
                      position: absolute;
                      top: 10px;
                      right: 10px;
                      z-index: 1;
                    "
                  >
                    <v-icon size="large">mdi-close</v-icon>
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
              class="mt-15 mb-5 w-100"
              text="Просмотреть приглашение"
              color="primary"
              :loading-status="eventStore.loadingStatuses.eventCreate"
              :click-function="openInvitePreview"
            />
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-0">
          <v-col cols="5">
            <ButtonDefault
              class="mb-5 w-100"
              :text="buttonCreateText"
              :loading-status="eventStore.loadingStatuses.eventCreate"
              :click-function="createEvent"
            />
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-0">
          <v-col cols="5">
            <ButtonDefault
              class="mb-5 w-100"
              text="Отмена"
              color="red"
              :click-function="exitFromEdit"
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
import { useEventStore } from "@/stores/event";
import { useDialogStore } from "@/stores/dialog";

import ColorPicker from "@/components/template/ColorPicker.vue";
import InputText from "@/components/template/InputText.vue";
import InputTextRaw from "@/components/template/InputTextRaw.vue";
import InputTextDouble from "@/components/template/InputTextDouble.vue";
import ButtonDefault from "@/components/template/ButtonDefault.vue";
import ButtonIcon from "@/components/template/ButtonIcon.vue";
import DatePicker from "@/components/template/DatePicker.vue";
import YandexMap from "@/components/template/YandexMap.vue";
import Combobox from "@/components/template/Combobox.vue";

import InvitePreviewDialog from "@/components/invites/InvitePreviewDialog.vue";

const router = useRouter();

const eventStore = useEventStore();
const dialogStore = useDialogStore();

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
    eventStore.resetCurrentToOriginal()
    router.push(`/event/${eventStore.selectedEventCurrent.id}`);
  } else {
    router.push("/dashboard");
  }
};

const openInvitePreview = () => {
  dialogStore.showDialog("invitePreview");
};
</script>

<style scoped>
.selected-card {
  background-color: #1a1a50; /* Цвет для выбранной карточки */
}
</style>
