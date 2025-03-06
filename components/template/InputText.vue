<template>
  <v-text-field
    :class="{ 'no-text-cursor': readonly }"
    v-model="localValue"
    :label="label"
    :type="type"
    :rules="rules"
    :messages="customErrorMessages"
    :error="!!customErrorStatus"
    :readonly="readonly"
    rounded="xl"
    :variant="variant"
    flat
    @input="onInputChange"
  >
    <template #append-inner>
      <v-progress-circular
        v-if="loadingStatus"
        class="mr-3"
        :size="20"
        :width="2"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <slot name="append-inner"></slot>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import "../../assets/styles/main.css"
import { ref, computed, watch } from "vue";

// Пропсы, переданные в компонент
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "solo-filled",
  },
  readonly: {
    type: Boolean,
    default: false
  },
  loadingStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  customRules: {
    type: String,
    required: false,
    default: "",
  },
  rules: {
    type: Array,
    default: () => [],
  },
});

// Локальная реактивная переменная для связывания с v-model
const localValue = ref(props.modelValue);

// Эмитим событие для обновления modelValue
const emit = defineEmits();

const customErrorMessages = computed(() => {
  return props.customRules ? [props.customRules] : [];
});

const customErrorStatus = computed(() => {
  return props.customRules;
});

// Слежение за изменениями localValue и эмитирование события в родительский компонент
watch(localValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const onInputChange = () => {
  emit("input-change", localValue.value); // Генерация события input-change
};
</script>

