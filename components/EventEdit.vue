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
              :bg-color="themeColors.primary"
            ></DatePicker>
          </v-col>
          <v-col cols="3">
            <InputText
              v-model="selectedEvent.eventTime"
              time
              label="Время мероприятия"
              :bg-color="themeColors.primary"
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
              v-model="eventStore.selectedEvent.eventLocation"
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
                    dark
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
              <ButtonIcon
                mdi-icon="mdi-plus"
                :color="themeColors.accent"
                :click-function="addTiming"
              />
            </v-card-title>
          </v-col>
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
              :bg-color="themeColors.primary"
            >
              <ButtonIcon
                class="mb-5"
                mdi-icon="mdi-close"
                :color="themeColors.error"
                :click-function="() => deleteTiming(item.id)"
              />
            </InputTextDouble>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-card-title class="mt-15 text-center main-title"
              >Напитки</v-card-title
            >
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="10">
            <Combobox
              v-model="selectedEvent.eventDrinks"
              :items="eventStore.drinksDictionary"
              item-label="drinkName"
              item-value="Id"
              label="Выберите напитки"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="10">
            <ButtonDefault
              class="mt-15 mb-5 w-100"
              text="Просмотреть"
              :color="themeColors.primary"
              :loading-status="eventStore.loadingStatuses.eventCreate"
              :click-function="createEvent"
            />
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-0">
          <v-col cols="10">
            <ButtonDefault
              class="mb-5 w-100"
              text="Создать"
              :colorStops="gradientSettings"
              :loading-status="eventStore.loadingStatuses.eventCreate"
              :click-function="createEvent"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/event";
import { themeColors, gradientSettings } from "@/config/themeConfig";

import InputText from "./components/template/InputText.vue";
import InputTextRaw from "./components/template/InputTextRaw.vue";
import InputTextDouble from "./components/template/InputTextDouble.vue";
import ButtonDefault from "./components/template/ButtonDefault.vue";
import ButtonIcon from "./template/ButtonIcon.vue";
import DatePicker from "./components/template/DatePicker.vue";
import YandexMap from "./components/template/YandexMap.vue";
import Combobox from "./components/template/Combobox.vue";

const router = useRouter();

const eventStore = useEventStore();

const selectedEvent = computed(() => eventStore.selectedEvent);

const selectedDate = computed({
  get: () => eventStore.selectedEvent.eventDate,
  set: (value: Date) => eventStore.setDate(value),
});

const selectedDesign = computed({
  get: () => eventStore.selectedEvent.eventDesignId,
  set: (design) => {
    eventStore.selectedEvent.eventDesignId = design;
  },
});

onMounted(async () => {
  await eventStore.getDesigns();
  await eventStore.getDrinks();
  await eventStore.getGuestStatuses();
});

const addTiming = () => {
  eventStore.addTiming();
};

const deleteTiming = (id: string) => {
  eventStore.deleteTiming(id);
};

const createEvent = async () => {
  await eventStore.createEvent();
  router.push("/dashboard");
};

const backToDashboard = () => {
  router.push("/dashboard");
};
</script>

<style scoped>
.selected-card {
  background-color: #1a1a50; /* Цвет для выбранной карточки */
}
</style>
