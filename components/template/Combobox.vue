<template>
  <v-combobox
    v-model="model"
    :items="computedItems"
    :item-title="itemLabel"
    :item-value="itemValue"
    :label="label"
    multiple
    clearable
    variant="outlined"
    rounded="xl"
    :color="color"
    class="custom-combobox"
    style="min-height: 100px"
    @keydown.enter.prevent="handleEnter"
    :allow-new="false"
  >
    <template v-slot:selection="{ item }">
      <v-chip class="mx-1 mt-3 mb-1" size="large">
        {{ item.title }}
      </v-chip>
    </template>
    <template #append-inner v-if="loadingStatus">
      <v-progress-circular indeterminate size="20" width="2" color="primary" />
    </template>
  </v-combobox>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: any[];
  label?: string;
  items: any[];
  loadingStatus?: boolean;
  itemLabel: string;
  itemValue: string;
  color: string;
}>();

const emit = defineEmits(["update:modelValue", "update:items"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const computedItems = computed(() => {
  return [
    ...props.items,
    ...model.value.filter((item) => !props.items.includes(item)),
  ];
});

const handleEnter = (event: KeyboardEvent) => {
  const input = (event.target as HTMLInputElement).value.trim();
  if (!input) return;

  const numericIds = computedItems.value
    .map((item) => parseInt(item[props.itemValue], 10))
    .filter((id) => !isNaN(id));

  const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

  const newItem = {
    [props.itemValue]: newId.toString(),
    [props.itemLabel]: input,
  };

  // Добавляем в списки
  emit("update:items", [...props.items, newItem]);
  emit("update:modelValue", [...props.modelValue, newItem]);

  // Очищаем поле ввода
  (event.target as HTMLInputElement).value = "";
};
</script>

<style>
.v-combobox .v-field .v-field__input > input {
  font-size: 16px !important;
  padding-top: 10px !important;
}
</style>
