<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <div class="text-center main-title">XXX</div>
      </v-col>
    </v-row>
    <v-row class="pt-10" justify="center">
      <v-col cols="8" class="d-flex justify-center align-center">
        <v-btn
          prepend-icon="mdi-chevron-right"
          color="indigo"
          size="large"
          rounded="lg"
          @click="getStarted"
        >
          Начать
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"; // Импортируем роутер
import { useAuthStore } from "../stores/auth";

const router = useRouter(); // Инициализация роутера

const authStore = useAuthStore();

const getStarted = async () => {
  if (authStore.user) {
    router.push("/dashboard")
  } else {
    router.push("/login")
  }
};
</script>

<style scoped>
/* Стили для компонента MainPage */
</style>
