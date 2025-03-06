<template>
  <v-container class="pt-15">
    <v-row>
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form" rounded="xl" variant="flat">
          <v-card-title class="d-flex justify-center pt-8">
            Регистрация
          </v-card-title>
          <v-row justify="center">
            <v-col cols="10">
              <InputText
                v-model="formData.email"
                label="Email"
                :rules="emailRule"
              />
              <InputText
                v-model="formData.password"
                label="Пароль"
                :type="passwordFieldType"
                :rules="passwordRule"
                ><template #append-inner>
                  <v-btn icon @click="changePasswordFieldType">
                    <v-icon v-if="passwordField" size="20">mdi-eye-off-outline</v-icon>
                    <v-icon v-else size="20">mdi-eye-outline</v-icon>
                  </v-btn>
                </template></InputText
              >
              <InputText
                v-model="formData.username"
                label="Username"
                :loading-status="authStore.loadingStatuses.checkUserName"
                :custom-rules="usernameRule"
                @input="checkUsername"
              />
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-row justify="center">
              <v-col cols="10">
                <ButtonDefault
                  class="mb-5 w-100"
                  text="Зарегистрироваться"
                  :loading-status="authStore.loadingStatuses.registerStatus"
                  :disabled="authStore.isEmailSended"
                  :click-function="register"
                ></ButtonDefault>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="authStore.isEmailSended">
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form" rounded="xl" variant="flat">
          <v-card-title class="d-flex justify-center pt-8">
            Регистрация
          </v-card-title>
          <v-card-text class="d-flex justify-center pt-8">
            Ссылка с подтверждением вашего аккаунта отправлена на email
            {{ authStore.emailForSend }}
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-row justify="center">
              <v-col cols="10">
                <ButtonDefault
                  class="mb-5 w-100"
                  text="Отправить еще раз"
                  :loading-status="authStore.loadingStatuses.resendEmailStatus"
                  :click-function="resendEmailVerify"
                ></ButtonDefault>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";

import ButtonDefault from "./components/template/ButtonDefault.vue";
import InputText from "./components/template/InputText.vue";

import type { RegisterData } from "../types/auth";

import { validationRules } from "@/helpers/validationRules";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

const formData = ref<FormData>({
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
});

const passwordField = ref<boolean>(true);

const changePasswordFieldType = () => {
  passwordField.value = !passwordField.value;
};

const passwordFieldType = computed(() => {
  return passwordField.value ? "password" : "";
});

const authStore = useAuthStore();

// Функция регистрации
const register = async () => {
  const user: RegisterData = {
    email: formData.value.email,
    password: formData.value.password,
    username: formData.value.username,
  };

  await authStore.register(user);
};

const resendEmailVerify = async () => {
  await authStore.resendEmailVerify();
};

const checkUsername = async () => {
  if (formData.value.username) {
    await authStore.checkUsername(formData.value.username);
  }
};

const usernameRule = computed(() => {
  if (!authStore.isUserNameValid) {
    return "Логин занят";
  } else {
    return "";
  }
});

const emailRule = computed(() => {
  if (!formData.value.email.toLowerCase().match(validationRules.emailRule)) {
    return ["Введите корректный email"];
  } else {
    return [];
  }
});

const passwordRule = computed(() => {
  if (!formData.value.password.match(validationRules.passwordRule)) {
    return [
      "Пароль должен содержать минимум 6 символов, одну заглавную букву и хотя бы один специальный символ",
    ];
  } else {
    return [];
  }
});
</script>
