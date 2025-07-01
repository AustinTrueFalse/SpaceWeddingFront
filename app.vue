<template>
  <v-app class="custom-dark-background">
    <!-- Панель навигации -->
    <v-app-bar
      v-if="route.path !== '/login'"
      app
      elevation="0"
      color="transparent"
    >
      <v-spacer></v-spacer>
      <UsernameMenu />
      <v-btn icon @click="toggle()">
        <v-icon>{{
          themeStore.isDark ? "mdi-weather-night" : "mdi-white-balance-sunny"
        }}</v-icon>
      </v-btn>
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
import "./assets/styles/main.css";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router"; // Импортируем роутер
import { useAuthStore } from "./stores/auth";
import { useEventStore } from "./stores/event";
import { useGuestStore } from "./stores/guest";
import { useUsersStore } from "./stores/users";

import { useTheme } from "vuetify";
import { useThemeStore } from "@/stores/theme";

import ButtonDefault from "./components/template/ButtonDefault.vue";
import SnackbarDefault from "./components/template/SnackbarDefault.vue";

import UsernameMenu from "./components/user/UsernameMenu.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const eventStore = useEventStore();
const guestStore = useGuestStore();
const usersStore = useUsersStore();

const theme = useTheme();
const themeStore = useThemeStore();

// При загрузке
themeStore.initTheme(theme);

function toggle() {
  themeStore.toggleTheme(theme);
}
// Функция для выхода
const logout = () => {
  authStore.signOut();
  eventStore.resetSelectedEvent();
  eventStore.resetEventList();
  guestStore.resetGuest();
  usersStore.resetUsers();
  router.push("/");
};
</script>
