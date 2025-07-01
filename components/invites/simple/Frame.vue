<template>
  <v-card class="custom-dark-background pa-5" rounded="xl" >
    <Header class="mb-10" />
    <Location class="my-10" />
    <DressCode class="my-10" />
    <div class="text-center header-font increase-font my-10">
      ПОЖАЛУЙСТА, ПОДТВЕРДИТЕ ВАШЕ ПРИСУТСТВИЕ
    </div>
    <v-form>
      <InputText
        v-model="guestStore.guest.guestName"
        label="Имя"
        bg-color="primary"
      />
      <InputText
        v-model="guestStore.guest.guestPhone"
        label="Номер телефона"
        bg-color="primary"
      />
      <CheckboxGroup
        class="pt-3"
        v-model="selectedGuestDrinks"
        :items="drinkListItems"
        title="Напитки"
      />
      <ChipGroup
        class="pt-3"
        v-model="selectedGuestTag"
        :items="tagListItems"
        title="Тип гостя"
      />

      <RadioGroup
        class="pt-5"
        v-model="guestStore.guest.guestStatus"
        :items="guestStatuses"
        title="Статус"
      />

      <v-row justify="center" class="pt-10">
        <v-col cols="6">
          <ButtonDefault
            class="mb-5 w-100"
            text="Отправить"
            :loading-status="guestStore.loadingStatuses.guestAdd"
            :click-function="addGuest"
       
          ></ButtonDefault>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import "../../../assets/styles/gothic.css";

import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useGuestStore } from "@/stores/guest";
import { computed, onMounted, defineAsyncComponent, defineProps } from "vue";


import Header from "./Header.vue";
import Location from "./Location.vue";
import DressCode from "./DressCode.vue";

import InputText from "@/components/template/InputText.vue";
import ButtonDefault from "@/components/template/ButtonDefault.vue";
import CheckboxGroup from "@/components/template/CheckboxGroup.vue";
import RadioGroup from "@/components/template/RadioGroup.vue";
import ChipGroup from "@/components/template/ChipGroup.vue";

const route = useRoute();

const eventStore = useEventStore();
const guestStore = useGuestStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

// Вычисляем текущий ивент
const currentEvent = computed(() => eventStore.selectedEventCurrent);

// Вычисляем список напитков
const drinkListItems = computed(() => {
  return currentEvent.value.eventDrinks.map((drink) => ({
    ...drink,
    label: drink.drinkName, // Для отображения названия напитка
  }));
});

// Вычисляем список тэгов
const tagListItems = computed(() => {
  return currentEvent.value.eventTags.map((tag) => ({
    ...tag,
    label: tag.tagName, // Для отображения названия напитка
  }));
});

// Массив выбранных напитков, который синхронизируется с guestStore.guest.guestDrinks
const selectedGuestDrinks = computed({
  get: () => guestStore.guest.guestDrinks.map((drink) => drink.id),
  set: (newSelectedDrinks: any[]) => {
    guestStore.guest.guestDrinks = drinkListItems.value.filter((drink) =>
      newSelectedDrinks.includes(drink.id)
    );
  },
});

const selectedGuestTag = computed({
  get: () => guestStore.guest.guestTag.id,
  set: (newSelectedTagId: any) => {
    // Находим выбранный тег по id
    const selectedTag = tagListItems.value[newSelectedTagId];
    if (selectedTag) {
      guestStore.guest.guestTag = selectedTag; // Сохраняем выбранный тег в guestTag
    }
  },
});

// Заполняем guestStatuses
const guestStatuses = computed(() => {
  const statuses = currentEvent.value.guestStatuses.map((sts) => ({
    ...sts,
    label: sts.status,
  }));
  return statuses;
});

const addGuest = async () => {
  try {
    await guestStore.addGuest(eventId); // Если здесь ошибка, выполнение перейдет в catch
    eventStore.getGuests(eventId); // Выполнится только если addGuestAuth успешен
  } catch (error) {}
};
</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>

<style scoped>
.test {
  background-color: #1f0707;
}
</style>
