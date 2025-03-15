<template>
  <v-text-field
    :class="{ 'no-text-cursor': readonly }"
    v-model="localValue"
    :label="label"
    :placeholder="computedPlaceholder"
    :type="inputType"
    :rules="rules"
    :messages="customErrorMessages"
    :error="!!customErrorStatus"
    :readonly="readonly"
    rounded="xl"
    :variant="variant"
    :bg-color="bgColor"
    flat
    @input="onInputChange"
    @keypress="onKeyPress"
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

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  bgColor: {
    type: String,
    default: ""
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
    default: false,
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
  time: {
    type: Boolean,
    default: false,
  },
});

const localValue = ref(props.modelValue);
const emit = defineEmits();

const customErrorMessages = computed(() => {
  return props.customRules ? [props.customRules] : [];
});

const customErrorStatus = computed(() => {
  return props.customRules;
});

const computedPlaceholder = computed(() => {
  return props.time ? "hh:mm" : "";
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

const onKeyPress = (event: KeyboardEvent) => {
  if (!props.time) return;

  const allowedChars = /[0-9:]/;
  const maxLength = 5;

  if (!allowedChars.test(event.key) || localValue.value.length >= maxLength) {
    event.preventDefault();
    return;
  }

  if (localValue.value.length === 2 && event.key !== ":") {
    localValue.value += ":";
  }
};
</script>
