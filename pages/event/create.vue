<template>
  <EventCreate />
</template>

<script>

import EventCreate from "~/components/EventCreate.vue";

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

export default {
  components: {
    EventCreate,
  },
};
</script>
