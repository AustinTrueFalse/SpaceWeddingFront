<template>
  <v-container max-width="1000px" class="mb-15">
    <div>
      {{ selectedPlaylist.playlistName }}
    </div>
    <div v-for="track in selectedPlaylist.tracks" :key="track.title">
      <div class="d-flex">
        {{ track.artist }}
        {{ track.title }}
        <v-btn icon @click="playlistStore.deleteTrack(track.url)"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
      </div>
    </div>
    <div class="d-flex align-center">
      <InputText v-model="link" time label="ссылка" variant="outlined" />

      <ButtonDefault
        variant="tonal"
        color="primary"
        text="Добавить Yandex"
        :loading="
          playlistStore.loadingStatuses.playlistCreate ||
          playlistStore.loadingStatuses.playlistUpdate
        "
        @click="searchTrack('yandex')"
      />
      <ButtonDefault
        variant="tonal"
        color="primary"
        text="Добавить YouTube"
        :loading="
          playlistStore.loadingStatuses.playlistCreate ||
          playlistStore.loadingStatuses.playlistUpdate
        "
        @click="searchTrack('youtube')"
      />
    </div>
    <ButtonDefault
      variant="tonal"
      color="primary"
      text="Сохранить плэйлист"
      :loading="
        playlistStore.loadingStatuses.playlistCreate ||
        playlistStore.loadingStatuses.playlistUpdate
      "
      @click="createPlaylist"
    />

    <ButtonDefault
      variant="tonal"
      color="primary"
      text="Играть"
      :loading="
        playlistStore.loadingStatuses.playlistCreate ||
        playlistStore.loadingStatuses.playlistUpdate
      "
      @click="generateNewBingo"
    />
    <ButtonDefault class="mt-15 w-100" text="Отмена" @click="exitFromEdit" />
  </v-container>
  <InvitePreviewDialog />
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useDialogStore } from "@/stores/dialog";
import { useBingoStore } from "../stores/bingo";
import { usePlaylistStore, type ParseType } from "../stores/playlist";

import InputText from "@/shared/components/InputText.vue";

import ButtonDefault from "@/shared/components/ButtonDefault.vue";

import InvitePreviewDialog from "@/features/invite/components/InvitePreviewDialog.vue";

const router = useRouter();
const route = useRoute();

const playlistStore = usePlaylistStore();
const dialogStore = useDialogStore();
const bingoStore = useBingoStore();

const link = ref<string | null>("");

const selectedPlaylist = computed(() => playlistStore.selectedPlaylistCurrent);

const playlistId = route.params.id as string;

onMounted(async () => {
  if (playlistId) {
    await playlistStore.getPlaylistById(playlistId);
  }
});

const canGenerateBingo = computed(() => {
  return playlistStore.selectedPlaylistCurrent?.tracks?.length >= 9;
});

// Генерация нового бинго
const generateNewBingo = () => {
  if (canGenerateBingo.value) {
    bingoStore.generateNewBingo(playlistId);
  }
  router.push(`/playlist/${playlistStore.selectedPlaylistCurrent.id}/bingo`);
};

const searchTrack = async (type: ParseType) => {
  if (link.value) {
    await playlistStore.searchTrack(link.value, type);
    link.value = null;
    console.log(link.value);
  }
};

const createPlaylist = async () => {
  if (playlistStore.selectedPlaylistCurrent.id) {
    await playlistStore.updatePlaylist(
      playlistStore.selectedPlaylistCurrent.id
    );
    router.push(`/playlist/${playlistStore.selectedPlaylistCurrent.id}`);
  } else {
    await playlistStore.createPlaylist();
    router.push("/playlists");
  }
};

const exitFromEdit = () => {
  if (playlistStore.selectedPlaylistCurrent.id) {
    
    router.push(`/playlists`);
    playlistStore.resetCurrentToOriginal();
  } else {
    router.push("/playlists");
  }
};
</script>
