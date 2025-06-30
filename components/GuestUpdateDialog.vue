<template>
  <DialogDefault
    v-if="dialogStore.type === 'guestUpdate'"
    title="Изменение гостя"
    confirmText="Да"
  >
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
      class=""
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
    <v-expansion-panels rounded="xl" flat>
      <v-expansion-panel title="Описание гостя">
        <v-expansion-panel-text>
          <InputTextArea v-model="guestStore.guest.guestDescr" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row justify="center" class="pt-10">
      <v-col cols="8">
        <ButtonDefault
          class="mb-5 w-100"
          text="Обновить"
          :loading-status="guestStore.loadingStatuses.guestAdd"
          :click-function="updateGuest"
 
        ></ButtonDefault>
      </v-col>
      <v-col cols="4">
        <ButtonDefault
          class="mb-5 w-100"
          text="Удалить"
          :loading-status="guestStore.loadingStatuses.guestAdd"
          :click-function="openGuestDelete"
          color="error"
        ></ButtonDefault>
      </v-col>
    </v-row>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useGuestStore } from "@/stores/guest";
import { useDialogStore } from "@/stores/dialog";
import { computed, defineProps, ref, watch } from "vue";


import DialogDefault from "@/components/template/DialogDefault.vue";
import InputText from "@/components/template/InputText.vue";
import InputTextArea from "@/components/template/InputTextArea.vue";
import ButtonDefault from "@/components/template/ButtonDefault.vue";
import CheckboxGroup from "@/components/template/CheckboxGroup.vue";
import ChipGroup from "@/components/template/ChipGroup.vue";
import RadioGroup from "@/components/template/RadioGroup.vue";
import type { Guest } from "@/types/guest";

// Получаем маршрут
const route = useRoute();

const eventStore = useEventStore();
const guestStore = useGuestStore();
const dialogStore = useDialogStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

// Вычисляем текущий ивент
const currentEvent = computed(() => eventStore.selectedEvent);

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

const openGuestDelete = () => {
  dialogStore.showDialog("guestDelete");
};

const updateGuest = async () => {
  try {
    await guestStore.updateGuest(guestStore.guest.id); // Если здесь ошибка, выполнение перейдет в catch
    eventStore.getGuests(eventId); // Выполнится только если addGuestAuth успешен
  } catch (error) {
  } finally {
    dialogStore.hideDialog();
  }
};
</script>

<style scoped>
/* Стили для страницы мероприятия */
</style>
