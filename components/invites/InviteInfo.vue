<template>
  <div class="device-preview-controls">
    <v-btn
      :variant="containerSize === 'desktop' ? 'tonal' : 'text'"
      size="x-large"
      @click="containerSize = 'desktop'"
    >
      <v-icon size="40">mdi-desktop-tower-monitor</v-icon>
    </v-btn>
    <v-btn
      :variant="containerSize === 'mobile' ? 'tonal' : 'text'"
      size="x-large"
      @click="containerSize = 'mobile'"
    >
      <v-icon size="40">mdi-cellphone</v-icon>
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
      <v-theme-provider :theme="localTheme">
        <Frame />
      </v-theme-provider>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import Frame from "./gothic/Frame.vue";
import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{
  isPreview: boolean;
}>();

const route = useRoute();
const eventStore = useEventStore();

const eventId = route.params.id as string;
const localTheme = ref<"light" | "dark">("light");
const containerSize = ref<"desktop" | "mobile">("desktop");

const containerStyles = {
  desktop: { maxWidth: "1200px", width: "100%" },
  tablet: { maxWidth: "768px", width: "768px" },
  mobile: { maxWidth: "390px", width: "390px" },
};

// Получаем текущий ивент
const currentEvent = computed(() => eventStore.selectedEventCurrent);

// При монтировании получаем событие (если не предпросмотр)
onMounted(async () => {
  if (!props.isPreview) {
    await eventStore.getEventById(eventId);
  }
});

// Установка локальной темы при изменении eventDesignId
watch(
  currentEvent,
  (newEvent) => {
    if (!newEvent || !newEvent.eventDesignId) return;

    const isDarkDesign = ["gothic", "dark"].includes(newEvent.eventDesignId);
    localTheme.value = isDarkDesign ? "dark" : "light";
  },
  { immediate: true }
);
</script>

<style scoped>
.device-preview-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
}

.preview-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.preview-container.mobile,

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
