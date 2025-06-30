<template>
  <v-dialog
    v-model="dialogStore.isVisible"
    :width="width"
    @update:modelValue="onDialogClose"
  >
    <v-card rounded="xl">
      <!-- Заголовок -->
      <v-card-title class="d-flex justify-space-between align-center pl-8 pt-5">
        {{ title }}
        <v-btn icon variant="text" color="primary" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Основной контент -->
      <v-card-text>
        <slot> </slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500px",
  },
});

// Закрытие диалога
const closeDialog = () => {
  dialogStore.hideDialog();
};

// Если диалог закрыли "извне" (например, клик вне окна)
const onDialogClose = (newValue) => {
  if (!newValue) {
    dialogStore.hideDialog();
  }
};
</script>
