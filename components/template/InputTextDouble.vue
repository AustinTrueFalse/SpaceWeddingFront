<template>
  <v-row align="center">
    <v-col cols="2">
      <v-text-field
        class="mr-2"
        v-model="localValue[firstField]"
        :label="firstLabel"
        :type="firstType"
        :readonly="readonly"
        rounded="xl"
        variant="solo-filled"
        :bg-color="bgColor"
      />
    </v-col>
    <v-col>
      <v-text-field
        v-model="localValue[secondField]"
        :label="secondLabel"
        :type="secondType"
        :readonly="readonly"
        rounded="xl"
        variant="solo-filled"
        :bg-color="bgColor"
      />
    </v-col>
    <v-col cols="1" class="px-0" v-if="$slots.default">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  firstLabel: {
    type: String,
    default: "Label 1",
  },
  secondLabel: {
    type: String,
    default: "Label 2",
  },
  firstType: {
    type: String,
    default: "text",
  },
  secondType: {
    type: String,
    default: "text",
  },
  firstField: {
    type: String,
    required: true,
  },
  secondField: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  bgColor: {
    type: String,
    default: "",
  }
});

const emit = defineEmits(["update:modelValue"]);

const localValue = ref({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newValue) => {
    // Сравниваем значение, чтобы избежать рекурсии
    if (JSON.stringify(newValue) !== JSON.stringify(localValue.value)) {
      localValue.value = { ...newValue };
    }
  },
  { deep: true }
);

watch(
  localValue,
  (newValue) => {
    // Проверяем, изменилось ли значение
    if (JSON.stringify(newValue) !== JSON.stringify(props.modelValue)) {
      emit("update:modelValue", newValue);
    }
  },
  { deep: true }
);
</script>
