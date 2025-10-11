<template>
  <v-container class="pt-15">
    <v-row>
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form" rounded="xl">
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
              <InputText
                v-model="email"
                class="my-3"
                label="Email"
                variant="outlined"
              />
              <InputText v-model="password" label="Пароль" variant="outlined" />

              <div class="d-flex justify-end">
                <ButtonText
                  text="Забыл пароль"
                  @click="forwardToPasswordResetPage"
                />
              </div>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-row justify="center">
              <v-col cols="10">
                <ButtonDefault
                  class="w-100 mb-2 mt-2"
                  text="Войти"
                  :loading="authStore.loadingStatuses.signInStatus"
                  :disabled="isFormFilled"
                  @click="signIn"
                ></ButtonDefault>

                <v-divider></v-divider>
                <div class="d-flex justify-center">
                  <v-btn
                    class="text-capitalize px-5 my-4"
                    variant="outlined"
                    @click="signInGoogle()"
                  >
                    <v-icon class="mr-2">mdi-google</v-icon>
                    Google
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="!authStore.isConfirmed">
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form pb-3" rounded="xl">
          <v-card-text class="d-flex justify-center">
            Еще не зарегистрировались?
          </v-card-text>
          <v-row justify="center">
            <v-col cols="10">
              <ButtonDefault
                class="w-100"
                text="Зарегистрироваться"
                @click="forwardToRegisterPage"
              ></ButtonDefault>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="10" class="py-0"> </v-col>
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

import ButtonDefault from "@/shared/components/ButtonDefault.vue";
import ButtonText from "@/shared/components/ButtonText.vue";
import InputText from "@/shared/components/InputText.vue";

import type { SignInData } from "../types/auth";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const router = useRouter();

const isFormFilled = computed(() => {
  return !email.value || !password.value;
});

const signIn = async () => {
  try {
    const user: SignInData = {
      email: email.value,
      password: password.value,
    };

    await authStore.signIn(user);

    if (authStore.user) {
      router.push("/");
    }
  } catch (error) {
    console.log(error);
  }
};

const signInGoogle = async () => {
  try {
    await authStore.signInWithGoogle();
    if (authStore.user) {
      router.push("/");
    }
  } catch (error) {
    console.log(error);
  }
};

const forwardToRegisterPage = () => {
  router.push("/register");
};

const forwardToPasswordResetPage = () => {
  router.push("/password_send");
};
</script>

<style scoped></style>
