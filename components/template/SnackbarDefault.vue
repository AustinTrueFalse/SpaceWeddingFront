<template>
  <v-snackbar v-model="snackbarStore.isVisible" :color="snackbarStore.color">
    {{ snackbarStore.message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbarStore.hideSnackbar">
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { useSnackbarStore } from "../../stores/snackbar";

export default defineComponent({
  setup() {
    const snackbarStore = useSnackbarStore(); // Подключаем store для управления снэкбаром

    return {
      snackbarStore, // Возвращаем store в шаблон
    };
  },
});
</script>
