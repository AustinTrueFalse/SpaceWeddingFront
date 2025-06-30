<template>
  <DialogDefault v-if="dialogStore.type === 'invitePreview'" width="1280">
    <InviteInfo is-preview />
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useDialogStore } from "@/stores/dialog";

import DialogDefault from "@/components/template/DialogDefault.vue";
import InviteInfo from "@/components/invites/InviteInfo.vue";

const dialogStore = useDialogStore();
</script>
