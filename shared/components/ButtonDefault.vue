<template>
  <v-btn
    :variant="variant"
    rounded="xl"
    :color="color"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="!loading">{{ text }}</span>
    <v-progress-circular
      v-if="loading"
      :size="20"
      :width="2"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-btn>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "click"): void;
}>();

interface Props {
  text: string;
  color?: string;
  variant?:
    | "text"
    | "flat"
    | "elevated"
    | "tonal"
    | "outlined"
    | "plain"
    | undefined;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  text: "",
  color: "",
  variant: "text",
  clickFunction: () => {},
  disabled: false,
  loading: false,
});

const onClick = () => {
  if (!props.loading) {
    emit("click");
  }
};
</script>

<style scoped></style>
