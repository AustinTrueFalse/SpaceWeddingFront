<template>
  <v-radio-group v-model="selectedItem">
    <v-radio
      v-for="item in items"
      :key="item.id"
      
      :label="item.label"
      :value="item.id"
    ></v-radio>
  </v-radio-group>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";
 
interface RadioGroupItem {
  id: string | number;
  label: string;
}

const props = defineProps<{
  items: RadioGroupItem[]; // Список элементов для радио
  modelValue: (string | number); // Выбранное значение
}>();

const emit = defineEmits();

// Используем ref для хранения выбранных значений
const selectedItem = ref(props.modelValue)


// Наблюдаем за изменениями в selectedItems и передаем их обратно в родительский компонент
watch(selectedItem, (newValue) => {
  emit("update:modelValue", newValue); // Отправляем изменения обратно
});
</script>

<style scoped>
/* Стили для компонента, если нужно */
</style>
