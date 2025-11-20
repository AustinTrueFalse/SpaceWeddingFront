<template>
  <PlaylistEdit />
</template>

<script setup>
import PlaylistEdit from "@/features/playlist/components/PlaylistEdit.vue";

definePageMeta({
  middleware: "auth",
});
</script>
