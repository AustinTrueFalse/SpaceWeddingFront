<template>
  <EventEdit />
</template>

<script>
import EventEdit from '@/features/event/components/EventEdit.vue';

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

export default {
  components: {
    EventEdit,
  },
};
</script>
