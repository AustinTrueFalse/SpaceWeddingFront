<template>
  <v-btn @click="onClick" icon :disabled="disabled" variant="text">
    <v-progress-circular
      v-if="loading"
      :size="20"
      :width="2"
      color="primary"
      indeterminate
    />
    <v-icon v-else :color="color" size="x-large">{{ mdiIcon }}</v-icon>
  </v-btn>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "click"): void;
}>();

interface Props {
  mdiIcon: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mdiIcon: "",
  disabled: false,
  loading: false,
});

const onClick = () => {
  if (!props.loading) {
    emit("click");
  }
};
</script>
