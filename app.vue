<template>
  <v-app class="custom-dark-background">
    <!-- Панель навигации -->
    <v-app-bar
      v-if="route.path !== '/login' && !isInvite"
      app
      elevation="0"
      color="transparent"
    >
      <v-btn v-if="authStore.user" variant="text" @click="forwardToMain">
        Home
      </v-btn>
      <v-btn v-if="authStore.user" variant="text" @click="forwardToDashboard">
        Events
      </v-btn>
      <v-btn v-if="authStore.user" variant="text" @click="forwardToDashboard">
        About
      </v-btn>
      <v-spacer></v-spacer>

      <v-spacer></v-spacer>
      <UsernameMenu />
      <v-btn class="mx-2" icon @click="toggle()">
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
    <v-main> <NuxtPage class="mt-5" /> </v-main>

    <!-- Всплывающие уведомления -->
    <SnackbarDefault />
  </v-app>
</template>

<script setup lang="ts">
import "./assets/styles/main.scss";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router"; // Импортируем роутер
import { useAuthStore } from "./features/auth/stores/auth";
import { useEventStore } from "./features/event/stores/event";
import { useGuestStore } from "./features/event/stores/guest";
import { useUsersStore } from "./features/user/stores/users";

import { useTheme } from "vuetify";
import { useThemeStore } from "@/stores/theme";

import ButtonDefault from "./shared/components/ButtonDefault.vue";
import SnackbarDefault from "./shared/components/SnackbarDefault.vue";

import UsernameMenu from "./features/user/components/UsernameMenu.vue";

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

const isInvite = computed(() => route.path.includes("/invite/"));

function toggle() {
  themeStore.toggleTheme(theme);
}
const forwardToDashboard = async () => {
  router.push("/dashboard");
};

const forwardToMain = async () => {
  router.push("/");
};
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
