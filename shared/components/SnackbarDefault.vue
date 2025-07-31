<template>
  <v-snackbar v-model="snackbarStore.isVisible" :color="snackbarStore.color">
    {{ snackbarStore.message }}
    <template #actions>
      <v-btn variant="text" @click="snackbarStore.hideSnackbar">
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from "../../stores/snackbar";

const snackbarStore = useSnackbarStore();
</script>
