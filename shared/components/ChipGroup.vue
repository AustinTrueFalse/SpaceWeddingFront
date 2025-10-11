<template>
  <v-container class="pa-0">
    <v-row>
      <v-card-title class="pb-0">
        {{ title }}
      </v-card-title>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-chip-group
          v-model="selectedItem"
          color="pink"
          column
        >
          <v-chip v-for="item in items" :key="item.id">
            {{ item.label }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";

interface TagItem {
  id: string | number;
  label: string;
}

const props = defineProps<{
  items: TagItem[]; // Список объектов для чипов
  modelValue: string | number; // Один выбранный тег (id)
  title: string;
}>();

const emit = defineEmits();

// Используем ref для хранения выбранного значения
const selectedItem = ref<string | number>(props.modelValue);

// Наблюдаем за изменениями в selectedItem и передаем их обратно в родительский компонент
watch(selectedItem, (newValue) => {
  emit("update:modelValue", newValue); // Отправляем изменения обратно в родительский компонент
});
</script>
