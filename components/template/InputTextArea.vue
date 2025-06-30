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
  time: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 5
  }
});

const localValue = ref(props.modelValue);
const emit = defineEmits();

const customErrorMessages = computed(() => {
  return props.customRules ? [props.customRules] : [];
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

</script>
