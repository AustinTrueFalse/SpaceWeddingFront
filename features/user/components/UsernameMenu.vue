<template>
  <v-menu
    v-model="userMenu"
    transition="slide-y-transition"
    offset-y
    min-width="300"
    :close-on-content-click="false"
    @update:modelValue="onMenuClose"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="authStore.user"
        v-bind="props"
        prepend-icon="mdi-account"
        color="primary"
        variant="tonal"
      >
        {{ authStore.userNameCurrent }}
      </v-btn>
    </template>

    <v-card width="265px">
      <v-card-text>
        <div>Имя пользователя</div>
        <div class="d-flex align-center mt-3">
          <InputText
            v-model="authStore.userNameCurrent"
            :loading="authStore.loadingStatuses.checkUserName"
            :custom-rules="usernameRule"
            :readonly="!isUserNameEdit"
            @input="checkUsername"
          />
          <ButtonIcon
            v-if="!isUserNameEdit"
            class="ml-1 mb-5"
            mdi-icon="mdi-pencil"
            @click="() => (isUserNameEdit = true)"
          />
          <ButtonIcon
            v-else
            class="ml-1 mb-5"
            mdi-icon="mdi-content-save"
            :disabled="usernameRule !== ''"
            :loading="authStore.loadingStatuses.updateUserName"
            @click="updateUserName"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/features/auth/stores/auth";

import InputText from "@/shared/components/InputText.vue";
import ButtonIcon from "@/shared/components/ButtonIcon.vue";

const authStore = useAuthStore();

const themeStore = useThemeStore();

const userMenu = ref(false);
const isUserNameEdit = ref(false);

const checkUsername = async () => {
  if (authStore.userNameCurrent) {
    await authStore.checkUsername(authStore.userNameCurrent);
  }
};

const updateUserName = async () => {
  if (authStore.userNameCurrent) {
    await authStore.updateUsername(authStore.userNameCurrent);
    isUserNameEdit.value = false;
    await authStore.checkUser();
  }
  isUserNameEdit.value = false;
};

const usernameRule = computed(() => {
  if (!authStore.isUserNameValid) {
    return "Логин занят";
  } else {
    return "";
  }
});

const onMenuClose = (isOpen: boolean) => {
  if (!isOpen) {
    authStore.resetUserName();
    isUserNameEdit.value = false;
  }
};
</script>
