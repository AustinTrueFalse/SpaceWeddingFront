<template>
  <DialogDefault v-if="dialogStore.type === 'invitePreview'" width="1280">
    <div class="d-flex justify-center mb-10">
      <v-btn
        :variant="containerSize === 'desktop' ? 'tonal' : 'text'"
        size="x-large"
        @click="containerSize = 'desktop'"
      >
        Desktop<v-icon class="ml-3" size="40">mdi-desktop-tower-monitor</v-icon>
      </v-btn>
      <v-btn
        :variant="containerSize === 'mobile' ? 'tonal' : 'text'"
        class="ml-2"
        size="x-large"
        @click="containerSize = 'mobile'"
      >
        Phone<v-icon class="ml-3" size="30">mdi-cellphone</v-icon>
      </v-btn>
    </div>

    <div :class="['preview-container', containerSize]">
      <v-container
        :class="[
          'content-container',
          containerSize,
          {
            'mobile-view': containerSize === 'mobile',
          },
        ]"
        :style="containerStyles[containerSize]"
      >
        <v-card class="pa-0" variant="outlined" rounded="xl">
          <InviteInfo is-preview />
        </v-card>
      </v-container>
    </div>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useDialogStore } from "../../../stores/dialog"

import { ref } from "vue";

import DialogDefault from "../../../shared/components/DialogDefault.vue"
import InviteInfo from "./InviteInfo.vue";

const dialogStore = useDialogStore();

const containerSize = ref<"desktop" | "mobile">("desktop");

const containerStyles = {
  desktop: { maxWidth: "1200px", width: "100%" },
  tablet: { maxWidth: "768px", width: "768px" },
  mobile: { maxWidth: "390px", width: "390px" },
};
</script>

<style scoped>
.content-container {
  transition: all 0.3s ease;
  height: 100%;
  padding: 0;
}

.content-container.mobile {
  height: 667px;
  overflow-y: auto;
}

/* Стили для эмуляции мобильного/планшетного просмотра */
.content-container.mobile-view {
  /* Принудительно применяем мобильные стили */
  font-size: 14px;

  /* Для всех элементов внутри */
  :deep() {
    .increase-font {
      font-size: 20px !important;
    }

    .increase-font-small {
      font-size: 16px !important;
    }

    .increase-text-font-xs {
      font-size: 12px !important;
    }

    .increase-timing-font {
      font-size: 20px !important;
    }

    .decriase-font {
      font-size: 50px !important;
    }

    .decriase-main-font {
      font-size: 100px !important;
    }

    .decriase-font-bingo {
      font-size: 13px !important;
    }
  }
}
</style>
