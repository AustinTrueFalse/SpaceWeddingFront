<template>
  <EventInfo />
</template>

<script>
import EventInfo from '@/features/event/components/EventInfo.vue';

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

export default {
  components: {
    EventInfo,
  },
};
</script>
