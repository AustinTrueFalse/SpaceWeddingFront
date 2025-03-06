<template>
  <div class="flex flex-col items-start">
    <v-menu v-model="isOpen" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-text-field
          v-bind="props"
          class="cursor-pointer"
          readonly
          rounded="xl"
          variant="solo-filled"
          :label="label"
          flat
          :model-value="formattedTime"
          @click="isOpen = true"
        >
        </v-text-field>
      </template>

      <v-time-picker
        v-model="localValue"
        @update:model-value="updateTime"
        locale="ru"
        class="rounded-xl"
      >
        <v-spacer></v-spacer>
        <v-btn text @click="isOpen = false">Закрыть</v-btn>
      </v-time-picker>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";

const props = defineProps({
  modelValue: {
    type: String, // используем строку для времени
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  onUpdate: {
    type: Function,
    required: false,
    default: () => {},
  },
});

const localValue = ref(props.modelValue);
const isOpen = ref(false);

// Форматирование времени
const formattedTime = computed(() => {
  if (!localValue.value) return "";
  const [hours, minutes] = localValue.value.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
});

// Обновление выбранного времени
const updateTime = (time) => {
  localValue.value = time; // Обновляем локальное значение
  props.onUpdate(time); // Передаем обновленное время в родительский компонент
};
</script>

<style scoped>
.v-input--is-focused .v-label {
  font-size: 12px; /* уменьшенный шрифт для поднятого лейбла */
  transform: translateY(-20px); /* поднятие лейбла */
  color: #1976d2; /* цвет лейбла при фокусе */
}
.v-input--is-focused .v-input__control {
  border-bottom: none; /* убираем подчеркивание */
}
</style>
