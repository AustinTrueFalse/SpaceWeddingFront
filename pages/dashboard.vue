<template>
  <UserDashboard />
</template>

<script>
import UserDashboard from '@/components/UserDashboard.vue';

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

export default {
  components: {
    UserDashboard,
  },
};
</script>
