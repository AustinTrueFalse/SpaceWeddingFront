<template>
  <v-container>
    <v-card v-if="eventStore.selectedEvent" rounded="xl">
      <v-card-title class="pt-5 ml-3 d-flex justify-space-between align-center"
        >{{ eventStore.selectedEvent.eventName }}
        <ButtonIcon
          v-if="!isEdit"
          mdi-icon="mdi-cog"
          color="primary"
          :click-function="editEvent"
      /></v-card-title>
      <v-card-text class="pt-5">
        <YandexMap
          v-model="eventStore.selectedEvent.eventLocation"
          label="Местоположение"
          :readonly="!isEdit"
        />
        <v-card-title>Стиль</v-card-title>
        <v-item-group
          v-model="eventStore.selectedEvent.eventDesignId"
          selected-class="bg-primary"
          :mandatory="true"
        >
          <v-container>
            <v-row>
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
        <v-row>
          <v-col
            ><v-card-title
              >Напитки
              <ButtonIcon
                v-if="isEdit"
                mdi-icon="mdi-plus"
                color="primary"
                :click-function="addNewDrink"
              />
            </v-card-title>
            <div
              v-for="drink in eventStore.selectedEvent.eventDrinks"
              :key="drink.id"
            >
              <InputText
                v-model="drink.drinkName"
                :readonly="!isEdit"
                @input-change="(newName: string) => updateDrink(drink.id, newName)"
              >
                <template #append-inner>
                  <v-icon
                    v-if="isEdit"
                    @click="deleteDrink(drink.id)"
                    color="error"
                    >mdi-close</v-icon
                  >
                </template>
              </InputText>
            </div></v-col
          >
          <v-col
            ><v-card-title
              >Статусы
              <ButtonIcon
                v-if="isEdit"
                mdi-icon="mdi-plus"
                color="primary"
                :click-function="addNewStatus"
              />
            </v-card-title>
            <div
              v-for="status in eventStore.selectedEvent.guestStatuses"
              :key="status.id"
            >
              <InputText
                v-model="status.status"
                :readonly="!isEdit"
                @input-change="(newName: string) => updateStatus(status.id, newName)"
              >
                <template #append-inner>
                  <v-icon
                    v-if="isEdit"
                    @click="deleteStatus(status.id)"
                    color="error"
                    >mdi-close</v-icon
                  >
                </template>
              </InputText>
            </div></v-col
          >
        </v-row>
      </v-card-text>
      <v-card-actions
        class="pt-5 ml-3 d-flex justify-space-between align-center"
      >
        <v-btn v-if="isEdit" @click="saveSettings">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import InputText from "./components/template/InputText.vue";
import ButtonIcon from "./template/ButtonIcon.vue";
import YandexMap from "./components/template/YandexMap.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/event";
import { ref, onMounted } from "vue";

// Получаем маршрут
const route = useRoute();
const router = useRouter();

const eventStore = useEventStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

const isEdit = ref(false);

const backToDashboard = () => {
  router.push("/dashboard");
};

const editEvent = () => {
  isEdit.value = true;
};

const saveSettings = async () => {
  await eventStore.updateEvent(eventId);
  await eventStore.getEventById(eventId);
  isEdit.value = false;
};

const addNewStatus = () => {
  eventStore.addStatusSelectedEvent();
};

const updateStatus = (id: string, name: string) => {
  eventStore.updateStatusNameSelectedEvent(id, name);
};

const deleteStatus = (id: string) => {
  eventStore.deleteStatusSelectedEvent(id);
};

const addNewDrink = () => {
  eventStore.addDrinkSelectedEvent();
};

const updateDrink = (id: string, name: string) => {
  eventStore.updateDrinkNameSelectedEvent(id, name);
};

const deleteDrink = (id: string) => {
  eventStore.deleteDrinkSelectedEvent(id);
};

// Загрузка ивентов (если они еще не были загружены)
onMounted(async () => {
  await eventStore.getEventById(eventId);
  await eventStore.getDesigns();
});
</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>
