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
      <v-card-text class="pt-0">
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

const props = withDefaults(defineProps<{
  title?: string;
  width?: string;
}>(), {
  title: "",
  width: "500px",
});

// Закрытие диалога по кнопке
const closeDialog = (): void => {
  dialogStore.hideDialog();
};

// Обработчик закрытия диалога (при изменении v-model)
const onDialogClose = (newValue: boolean): void => {
  if (!newValue) {
    dialogStore.hideDialog();
  }
};
</script>
