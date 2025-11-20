<template>
  <v-container class="bingo-container pa-2 pa-sm-3">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-card-title class="text-h5 text-sm-h4 font-weight-bold mb-2 mb-sm-4">
          Бинго!
          {{ playlistStore.selectedPlaylistCurrent?.playlistName }}
        </v-card-title>
      </v-col>
    </v-row>

    <!-- Сетка бинго -->
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-row dense>
          <v-col
            v-for="(track, index) in bingoStore.currentBingoTracks"
            :key="`${track.url}-${index}`"
            cols="4"
            class="pa-1 pa-sm-2"
          >
            <v-card
              variant="outlined"
              :color="bingoStore.selectedCells[index] ? 'primary' : ''"
              class="bingo-cell d-flex align-center justify-center text-center"
              :height="mobile ? 80 : 120"
              @click="toggleCell(index)"
            >
              <v-card-text class="pa-1 pa-sm-2">
                <v-avatar :size="mobile ? 24 : 40" class="mb-0 mb-sm-1">
                  <v-img :src="track.image_url" :alt="track.title" />
                </v-avatar>
                <div
                  class="text-caption font-weight-bold line-clamp-2"
                  :class="{ 'text-body-2': mobile }"
                >
                  {{ track.title }}
                </div>
                <div
                  class="text-caption text-medium-emphasis line-clamp-2"
                  :class="{ 'text-body-2': mobile }"
                >
                  {{ track.artist }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center" v-if="bingoStore.isBingo">
      <v-col cols="12" class="text-center">
        <v-alert
          type="success"
          variant="tonal"
          class="text-h6 text-sm-h5 font-weight-bold mt-2 mt-sm-4"
        >
          🎉 БИНГО! 🎉
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { usePlaylistStore } from "@/features/playlist/stores/playlist";
import { useBingoStore } from "../stores/bingo";
import { useDisplay } from "vuetify";

const route = useRoute();
const playlistId = route.params.id as string;
const { mobile } = useDisplay();

// Сторы
const playlistStore = usePlaylistStore();
const bingoStore = useBingoStore();

// Загружаем плейлист при входе на страницу
onMounted(async () => {
  await playlistStore.getPlaylistById(playlistId);
  bingoStore.initializeBingo(playlistId);
});

// Переключение ячейки
const toggleCell = (index: number) => {
  bingoStore.toggleCell(index, playlistId);
};

// Сброс при выходе со страницы
onUnmounted(() => {
  // Можно добавить логику сохранения при необходимости
});
</script>

<style scoped>
.bingo-cell {
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
}

.bingo-cell:hover {
  transform: scale(1.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Адаптивные стили для очень маленьких экранов */
@media (max-width: 360px) {
  .bingo-cell {
    height: 70px !important;
  }

  .v-card-text {
    padding: 4px !important;
  }
}

/* Убираем transform на тач-устройствах чтобы избежать дрожания */
@media (hover: none) {
  .bingo-cell:hover {
    transform: none;
  }
}
</style>
