<template>
  <v-textarea
    :class="{ 'no-text-cursor': readonly }"
    v-model="localValue"
    :label="label"
    :placeholder="computedPlaceholder"
    :type="inputType"
    :messages="customErrorMessages"
    :readonly="readonly"
    bg-color="transparent"
    :variant="variant"
    :rows="rows"
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
  </v-textarea>
</template>

<script setup lang="ts">
import "../../assets/styles/main.css";

import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    bgColor?: string;
    type?: string;
    variant?: string;
    readonly?: boolean;
    loadingStatus?: boolean;
    customRules?: string;
    time?: boolean;
    rows?: number;
    placeholder?: string;
  }>(),
  {
    modelValue: "",
    label: "",
    bgColor: "",
    type: "",
    variant: "solo-filled",
    readonly: false,
    loadingStatus: false,
    customRules: "",
    time: false,
    rows: 5,
    placeholder: ""
  }
);

const localValue = ref(props.modelValue);
const emit = defineEmits();

const customErrorMessages = computed(() => {
  return props.customRules ? [props.customRules] : [];
});

const computedPlaceholder = computed(() => {
  return props.time ? "hh:mm" : props.placeholder;
});

const inputType = computed(() => {
  return props.time ? "text" : props.type;
});

watch(localValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const onInputChange = () => {
  emit("input-change", localValue.value);
};
</script>
