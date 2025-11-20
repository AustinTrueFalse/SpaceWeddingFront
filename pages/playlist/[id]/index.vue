<template>
  <PlaylistEdit />
</template>

<script>
import PlaylistEdit from '@/features/playlist/components/PlaylistEdit.vue';

definePageMeta({
  middleware: "auth", // Применяем middleware auth
});

export default {
  components: {
    PlaylistEdit,
  },
};
</script>
