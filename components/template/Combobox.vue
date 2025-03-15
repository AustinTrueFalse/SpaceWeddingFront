<template>
  <v-combobox
    v-model="model"
    :items="items"
    :item-title="itemLabel"
    :item-value="itemValue"
    :label="label"
    multiple
    clearable
    variant="outlined"
    rounded="xl"
    item-color="orange-darken-1"
    class="custom-combobox"
    style="min-height: 100px"
    @update:model-value="filterInput"
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
}>();

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Фильтрация, чтобы не добавлять произвольный текст, но сохранять выбранные элементы
const filterInput = (newValue: any[]) => {
  const filtered = newValue.filter((item) =>
    props.items.some(
      (existingItem) =>
        existingItem[props.itemValue] === item || existingItem === item
    )
  );
  emit("update:modelValue", filtered);
};
</script>

<style>
/* Увеличение размера вводимого текста */
.v-combobox .v-field .v-field__input > input {
  font-size: 16px !important;
  padding-top: 10px !important;
}
</style>
