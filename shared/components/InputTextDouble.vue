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
        variant="outlined"
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
        variant="outlined"
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

const props = withDefaults(
  defineProps<{
    modelValue: object;
    firstLabel?: string;
    secondLabel?: string;
    firstType?: string;
    secondType?: string;
    firstField: string;
    secondField: string;
    readonly?: boolean;
    bgColor?: string;
  }>(),
  {
    firstLabel: "Label 1",
    secondLabel: "Label 2",
    firstType: "text",
    secondType: "text",
    readonly: false,
    bgColor: "",
  }
);

const emit = defineEmits(["update:modelValue"]);

const localValue = ref<Record<string, any>>({ ...props.modelValue });

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
