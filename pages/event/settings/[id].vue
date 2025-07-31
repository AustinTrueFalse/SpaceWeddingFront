<template>
  <EventDetails />
</template>

<script>
import EventDetails from '@/features/event/components/EventDetails.vue';

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

export default {
  components: {
    EventDetails,
  },
};
</script>
