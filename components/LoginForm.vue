<template>
  <v-container class="pt-15">
    <v-row>
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form" rounded="xl" variant="flat">
          <v-card-title
            v-if="authStore.isConfirmed"
            class="d-flex justify-center pt-8"
          >
            Ваш аккаунт успешно подтвержден
          </v-card-title>
          <v-card-title class="d-flex justify-center pt-8">
            Войти в Space Wedding
          </v-card-title>
          <v-row justify="center">
            <v-col cols="10">
              <v-text-field
                v-model="email"
                class="pt-5"
                color="transparent"
                rounded="xl"
                label="Email"
                variant="outlined"
                flat
              />
              <v-text-field
                v-model="password"
                rounded="xl"
                label="Password"
                type="password"
                variant="outlined"
                flat
              />
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-row justify="center">
              <v-col cols="10">
                <ButtonDefault
                  class="mb-5 w-100"
                  text="Войти"
                  :loading-status="authStore.loadingStatuses.signInStatus"
                  :click-function="signIn"
                ></ButtonDefault>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="!authStore.isConfirmed">
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form" rounded="xl">
          <v-card-text class="d-flex justify-center">
            Еще не зарегистрировались?
          </v-card-text>
          <v-row justify="center">
            <v-col cols="10">
              <NuxtLink to="/register">
                <ButtonDefault
                  class="mb-5 w-100"
                  text="Зарегистрироваться"
                ></ButtonDefault>
              </NuxtLink>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router"; // Импортируем роутер
import { useAuthStore } from "../stores/auth";

import ButtonDefault from "./components/template/ButtonDefault.vue";

import type { SignInData } from "../types/auth";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const router = useRouter(); // Инициализация роутера

const signIn = async () => {
  const user: SignInData = {
    email: email.value,
    password: password.value,
  };

  await authStore.signIn(user);

  if (authStore.user) {
    // Если авторизация успешна, перенаправляем на главную страницу "/"
    router.push("/");
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
