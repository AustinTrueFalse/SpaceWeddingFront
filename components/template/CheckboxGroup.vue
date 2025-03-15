<template>
  <v-container class="pa-0">
    <v-row>
      <v-card-title>
        {{ title }}
      </v-card-title>
    </v-row>

    <v-row dense>
      <v-col v-for="item in items" :key="item.id" cols="auto">
        <v-checkbox
          v-model="selectedItems"
          :label="item.label"
          :value="item.id"
          density="compact"
          class="mt-0 pt-0"
        />
      </v-col>
    </v-row>
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
  title: string;
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
