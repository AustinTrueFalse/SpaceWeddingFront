<template>
  <v-theme-provider :theme="localTheme" >
    <Frame class="pa-5" />
  </v-theme-provider>
</template>

<script lang="ts" setup>
import Frame from "./gothic/Frame.vue";
import { useRoute } from "vue-router";
import { useEventStore } from "../../event/stores/event"
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{
  isPreview: boolean;
}>();

const route = useRoute();
const eventStore = useEventStore();

const eventId = route.params.id as string;
const localTheme = ref<"light" | "dark">("light");

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

