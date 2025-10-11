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
          size="large"
          rounded="lg"
          @click="getStarted"
        >
          Начать
        </v-btn>
      </v-col>

      <DStar
       
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"; 
import { useAuthStore } from "../../auth/stores/auth";
import DStar from "@/shared/components/3DStar.vue";

const router = useRouter();

const authStore = useAuthStore();

const getStarted = async () => {
  if (authStore.user) {
    router.push("/dashboard");
  } else {
    router.push("/login");
  }
};
</script>

<style scoped>

</style>
