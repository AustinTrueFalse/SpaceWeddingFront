<template>
  <v-container>
    <v-checkbox
      v-for="item in items"
      :key="item.id"
      v-model="selectedItems"
      :label="item.label"
      :value="item.id"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";

interface CheckboxItem {
  id: string | number;
  label: string;
}

const props = defineProps<{
  items: CheckboxItem[]; // Список элементов для чекбоксов
  modelValue: (string | number)[]; // Массив выбранных значений
}>();

const emit = defineEmits();

// Используем ref для хранения выбранных значений
const selectedItems = ref<Array<string | number>>(props.modelValue);

// Наблюдаем за изменениями в selectedItems и передаем их обратно в родительский компонент
watch(selectedItems, (newValue) => {
  emit("update:modelValue", newValue); // Отправляем изменения обратно
});
</script>

<style scoped>
/* Стили для компонента, если нужно */
</style>
