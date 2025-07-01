<template>
  <v-btn @click="onClick" icon :disabled="disabled" variant="text">
    <v-progress-circular
      v-if="loadingStatus"
      :size="20"
      :width="2"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-icon v-else :color="color" size="x-large">{{ mdiIcon }}</v-icon>
  </v-btn>
</template>

<script lang="ts" setup>
interface Props {
  mdiIcon: string;
  color?: string;
  clickFunction: () => void;
  disabled?: boolean;
  loadingStatus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mdiIcon: "",
  clickFunction: () => {},
  disabled: false,
  loadingStatus: false,
});

const onClick = () => {
  if (!props.loadingStatus) {
    props.clickFunction();
  }
};
</script>