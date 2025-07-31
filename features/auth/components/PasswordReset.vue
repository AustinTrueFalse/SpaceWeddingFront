<template>
  <v-container class="pt-15">
    <v-row>
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form" rounded="xl" variant="flat">
          <v-card-title class="d-flex justify-center pt-8">
            Придумайте новый пароль
          </v-card-title>
          <v-row justify="center">
            <v-col cols="10">
              <InputText
                v-model="newPassword"
                label="Пароль"
                :type="passwordFieldType"
                :rules="passwordRule"
                ><template #append-inner>
                  <v-btn icon @click="changePasswordFieldType">
                    <v-icon v-if="passwordField" size="20"
                      >mdi-eye-off-outline</v-icon
                    >
                    <v-icon v-else size="20">mdi-eye-outline</v-icon>
                  </v-btn>
                </template></InputText
              >
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-row justify="center">
              <v-col cols="10">
                <ButtonDefault
                  class="mb-5 w-100"
                  text="Подтвердить"
                  @click="passwordReset"
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
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

import { validationRules } from "@/shared/utils/validationRules";

import ButtonDefault from "@/shared/components/ButtonDefault.vue";
import InputText from "@/shared/components/InputText.vue";

const authStore = useAuthStore();

const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get("oobCode");

const newPassword = ref("");
const passwordField = ref<boolean>(true);

const passwordFieldType = computed(() => {
  return passwordField.value ? "password" : "";
});

const passwordRule = computed(() => {
  if (!newPassword.value.match(validationRules.passwordRule)) {
    return [
      "Пароль должен содержать минимум 6 символов, одну заглавную букву и хотя бы один специальный символ",
    ];
  } else {
    return [];
  }
});

const passwordReset = async () => {
  if (oobCode) {
    await authStore.passwordReset(oobCode, newPassword.value);
  }
};

const changePasswordFieldType = () => {
  passwordField.value = !passwordField.value;
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
