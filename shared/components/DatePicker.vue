<template>
  <div class="flex flex-col items-start">
    <v-menu v-model="isOpen" :close-on-content-click="false">
      <template #activator="{ props: menuProps }">
        <v-text-field
          v-bind="menuProps"
          class="cursor-pointer"
          readonly
          rounded="xl"
          variant="outlined"
          :label="label"
          flat
          :model-value="formattedDate"
          :bg-color="bgColor"
        />
      </template>

      <v-date-picker
        v-model="localValue"
        @update:model-value="updateDate"
        locale="ru"
        class="rounded-xl"
      />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = withDefaults(defineProps<{
  modelValue?: Date | string;
  label?: string;
  bgColor?: string;
}>(), {
  modelValue: "",
  label: "",
  bgColor: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Date): void;
}>();

// Локальное состояние для v-date-picker
const localValue = ref<Date | null>(
  props.modelValue ? new Date(props.modelValue) : null
);

// Открытие меню выбора даты
const isOpen = ref(false);

// Следим за внешним modelValue и обновляем локальное значение
watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal ? new Date(newVal) : null;
  }
);

// Отображение форматированной даты
const formattedDate = computed(() => {
  if (!props.modelValue) return "";
  const date = new Date(props.modelValue);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Обновление даты при выборе
const updateDate = (date: Date | null) => {
  if (date) {
    emit("update:modelValue", date);
    isOpen.value = false;
  }
};

</script>
