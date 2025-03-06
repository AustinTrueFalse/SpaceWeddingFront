<template>
  <v-app theme="dark" class="custom-dark-background">
    <!-- Панель навигации -->
    <v-app-bar
      v-if="route.path !== '/login'"
      app
      elevation="0"
      color="transparent"
    >
      <v-spacer></v-spacer>
      <div v-if="authStore.user">
        <v-btn class="mr-10" icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <NuxtLink to="/login">
          <ButtonDefault class="mr-10" text="Sign in"></ButtonDefault>
        </NuxtLink>
      </div>
    </v-app-bar>

    <!-- Основное содержимое -->
    <v-main> <NuxtPage /> </v-main>

    <!-- Всплывающие уведомления -->
    <SnackbarDefault />
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useRouter } from "vue-router"; // Импортируем роутер
import { useAuthStore } from "./stores/auth";
import ButtonDefault from "./components/template/ButtonDefault.vue";
import SnackbarDefault from "./components/template/SnackbarDefault.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Функция для выхода
const logout = () => {
  authStore.signOut();
  router.push("/");
};
</script>
