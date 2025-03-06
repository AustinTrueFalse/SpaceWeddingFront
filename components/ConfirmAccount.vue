<template>
  <v-container class="pt-15"> Подтверждение email </v-container>
  <v-progress-circular
    v-if="authStore.loadingStatuses.verifyEmailStatus"
    color="primary"
    indeterminate
  ></v-progress-circular>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router"; // Импортируем роутер
import { useAuthStore } from "../stores/auth";

const router = useRouter(); // Инициализация роутера
const authStore = useAuthStore();

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get("oobCode");

  if (oobCode) {
    // Передаём oobCode в confirm
    await authStore.confirm(oobCode);
  }

  if (authStore.isConfirmed) {
    // Если подтверждение успешно, перенаправляем на главную
    router.push("/login");
  }
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
