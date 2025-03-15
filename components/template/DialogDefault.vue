<template>
  <v-dialog v-model="dialogStore.isVisible" :width="width" dark>
    <v-card rounded="xl">
      <!-- Заголовок -->
      <v-card-title class="d-flex justify-space-between align-center">
        {{ title }}
        <v-btn icon flat @click="closeDialog">
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
</script>
