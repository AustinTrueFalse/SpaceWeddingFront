<template>
  <v-container class="pt-15">
    <v-row>
      <v-col class="d-flex justify-center align-center">
        <v-card class="login-form" rounded="xl" variant="flat">
          <v-card-title v-if="!isSented" class="d-flex justify-center pt-8">
            Введите ваш email
          </v-card-title>
          <v-card-title v-if="isSented" class="d-flex justify-center pt-8">
            Письмо со ссылкой на сброс пароля отправлено на почту
          </v-card-title>
          <v-row justify="center">
            <v-col cols="10">
              <v-text-field
                v-model="email"
                class="pt-5"
                
                rounded="xl"
                label="Email"
                variant="outlined"
                flat
              />
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-row justify="center">
              <v-col cols="10">
                <v-btn
                  class="mb-5 w-100"
                  :disabled="isButtonDisabled"
                  @click="passwordReset"
                >
                  {{ buttonText }}
                </v-btn>
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

const authStore = useAuthStore();

const email = ref("");
const isButtonDisabled = ref(false);
const buttonText = ref("Отправить письмо для восстановления");
const isSented = ref<boolean>(false);

const passwordReset = async () => {
  try {
    await authStore.sendEmailPasswordReset(email.value);
    startTimer();
    isSented.value = true
  } catch {
    console.log(12345)
    isSented.value = false
  }
  
  
  
};

const startTimer = () => {
  let seconds = 5;
  isButtonDisabled.value = true;
  updateButtonText(seconds);

  const timer = setInterval(() => {
    seconds--;
    updateButtonText(seconds);

    if (seconds <= 0) {
      clearInterval(timer);
      isButtonDisabled.value = false;
      buttonText.value = "Отправить письмо еще раз";
    }
  }, 1000);
};

const updateButtonText = (seconds: number) => {
  const minutesPart = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsPart = String(seconds % 60).padStart(2, "0");
  buttonText.value = `${minutesPart}:${secondsPart}`;
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
