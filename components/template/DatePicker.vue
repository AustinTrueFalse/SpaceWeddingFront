<template>
  <div class="flex flex-col items-start">
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-text-field
          v-bind="props"
          class="cursor-pointer"
          readonly
          rounded="xl"
          variant="solo-filled"
          :label="label"
          flat
          :model-value="formattedDate"
          :bg-color="bgColor"
          @click="isOpen = true"
        >
        </v-text-field>
      </template>

      <v-date-picker
        v-model="localValue"
        @update:model-value="updateDate"
        locale="ru"
        class="rounded-xl"
      >
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";

const props = defineProps({
  modelValue: {
    type: Date,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  bgColor: {
    type: String,
    default: ""
  },
  onUpdate: {
    type: Function,
    required: false,
    default: () => {},
  },
});

const localValue = ref(props.modelValue);
// Состояние для показа/скрытия DatePicker
const isOpen = ref(false);

// Форматирование даты
const formattedDate = computed(() => {
  if (!props.modelValue) return "";
  const date = new Date(props.modelValue);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Обновление выбранной даты
const updateDate = (date) => {
  props.onUpdate(date); // Передаем обновленную дату в родительский компонент
  // isOpen.value = false; // Закрываем DatePicker
};
</script>
