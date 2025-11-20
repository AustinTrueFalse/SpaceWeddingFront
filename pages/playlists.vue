<template>
  <BingoPlaylists />
</template>

<script>
import BingoPlaylists from '@/features/start/components/BingoPlaylists.vue';

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

export default {
  components: {
    BingoPlaylists,
  },
};
</script>
