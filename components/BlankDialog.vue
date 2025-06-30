<template>
  <DialogDefault
    v-if="
      dialogStore.type === 'groomBlank' || dialogStore.type === 'brideBlank'
    "
    title="Анкета"
    confirmText="Да"
    width="800px"
    @update:modelValue="onDialogClose"
  >
    <InputTextArea v-model="tempValue" :rows="30" />

    <v-row justify="center" class="pt-10">
      <v-col cols="6">
        <ButtonDefault
          class="mb-5 w-100"
          text="Сохранить"
          :click-function="updateBlank"
          :loading-status="eventStore.loadingStatuses.eventCreate"
        ></ButtonDefault>
      </v-col>
    </v-row>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useDialogStore } from "@/stores/dialog";
import { computed } from "vue";

import DialogDefault from "@/components/template/DialogDefault.vue";
import InputTextArea from "@/components/template/InputTextArea.vue";
import ButtonDefault from "@/components/template/ButtonDefault.vue";

// Определяем интерфейс eventCouple с индексной сигнатурой
interface EventCouple {
  groomName: string;
  groomBlank: string;
  brideName: string;
  brideBlank: string;
  [key: string]: string;
}

// Получаем маршрут
const route = useRoute();
const eventId = route.params.id as string;

const eventStore = useEventStore();
const dialogStore = useDialogStore();

// Вычисляем текущий ивент
const currentEvent = computed(() => eventStore.selectedEvent);

// Определяем тип анкеты из dialogStore (приводим к ключу EventCouple)
const blankType = computed<keyof EventCouple | null>(() => {
  const type = dialogStore.type;
  return type === "groomBlank" || type === "brideBlank" ? type : null;
});

// Временное значение для инпута
const tempValue = ref("");

// Следим за открытием диалога и заполняем tempValue значением из БД
watch(dialogStore, () => {
  if (blankType.value) {
    tempValue.value = currentEvent.value.eventCouple?.[blankType.value] || "";
  }
});

// Динамическое вычисляемое свойство для v-model
const eventCoupleValue = computed({
  get: () =>
    blankType.value
      ? currentEvent.value.eventCouple?.[blankType.value] || ""
      : "",
  set: (newValue: string) => {
    if (blankType.value && currentEvent.value.eventCouple) {
      currentEvent.value.eventCouple[blankType.value] = newValue;
    }
  },
});

// Функция сохранения данных
const updateBlank = async () => {
  if (blankType.value && currentEvent.value.eventCouple) {
    currentEvent.value.eventCouple[blankType.value] = tempValue.value;
    await eventStore.updateEvent(eventId);
    await eventStore.getEventById(eventId);
  }
  dialogStore.hideDialog();
};

// Функция очистки tempValue при закрытии диалога
const onDialogClose = (newValue: string) => {
  if (!newValue) {
    tempValue.value = ""; // Очищаем значение
    dialogStore.hideDialog(); // Закрываем диалог
  }
};
</script>
