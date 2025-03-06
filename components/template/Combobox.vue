<template>
  <v-combobox
    v-model="model"
    :items="items"
    :item-title="itemLabel"
    :item-value="itemValue"
    :label="label"
    multiple
    chips
    clearable
    variant="outlined"
    rounded="xl"
    item-color="orange-darken-1"
  >
    <template #append-inner v-if="loadingStatus">
      <v-progress-circular indeterminate size="20" width="2" color="primary" />
    </template>
  </v-combobox>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: Array<any>;
  label?: string;
  items: Array<any>;
  loadingStatus?: boolean;
  itemLabel: string;
  itemValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
