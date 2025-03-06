<template>
  <v-container max-width="1000px">
    <v-row justify="center">
      <v-col>
        <InputTextRaw
          v-model="eventStore.eventName"
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
            <TimePicker
              :model-value="selectedDate"
              :onUpdate="(value: Date) => (selectedDate = value)"
              label="Время мероприятия"
            ></TimePicker>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-card-title class="mt-15 text-center main-title"
              >Место события</v-card-title
            >
          </v-col>
        </v-row>
        <YandexMap v-model="eventStore.eventLocation" label="Местоположение" />
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
                  v-slot="{ selectedClass, toggle }"
                >
                  <v-card
                    :class="['d-flex align-center', selectedClass]"
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
            <InputTextRaw v-model="eventStore.eventName" label="Имя жениха" />
          </v-col>
          <v-col
            ><InputTextRaw v-model="eventStore.eventName" label="Имя невесты" />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-card-title class="mt-15 text-center main-title"
              >Тайминг
              <ButtonIcon
                mdi-icon="mdi-plus"
                color="deep-purple-lighten-3"
                :click-function="addTiming"
            /></v-card-title>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <InputTextDouble
              v-for="(item, index) in eventStore.eventTiming"
              :key="item.id"
              v-model:modelValue="eventStore.eventTiming[index]"
              :first-field="'time'"
              :second-field="'description'"
              :first-label="'Время'"
              :second-label="'Описание'"
              :readonly="false"
            >
              <ButtonIcon
                class="mb-5"
                mdi-icon="mdi-close"
                color="error"
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
        <v-row>
          <Combobox
            v-model="eventStore.eventDrinks"
            :items="eventStore.drinksDictionary"
            item-label="drinkName"
            item-value="Id"
            label="Выберите напитки"
          >
          </Combobox>
        </v-row>
      </v-col>
    </v-row>

    <v-card-actions class="pt-5 ml-3 d-flex justify-space-between align-center">
      <ButtonDefault
        class="mb-5 w-100"
        text="Создать"
        :loading-status="eventStore.loadingStatuses.eventCreate"
        :click-function="createEvent"
      ></ButtonDefault>
    </v-card-actions>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/event";

import InputText from "./components/template/InputText.vue";
import InputTextRaw from "./components/template/InputTextRaw.vue";
import InputTextDouble from "./components//template/InputTextDouble.vue";
import ButtonDefault from "./components/template/ButtonDefault.vue";
import ButtonIcon from "./template/ButtonIcon.vue";
import DatePicker from "./components/template/DatePicker.vue";
import TimePicker from "./components/template/TimePicker.vue";
import YandexMap from "./components/template/YandexMap.vue";
import Combobox from "./components/template/Combobox.vue";

const router = useRouter();

const eventStore = useEventStore();
const { eventTiming } = storeToRefs(eventStore); // Делаем реактивную привязку

const selectedDate = computed({
  get: () => eventStore.eventDate,
  set: (value: Date) => eventStore.setDate(value),
});

const selectedDesign = computed({
  get: () => eventStore.selectedDesign, // Берем первый выбранный объект
  set: (design) => {
    eventStore.selectedDesign = design; // Обновляем массив с единственным элементом
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
/* Стили для компонента MainPage */
</style>
