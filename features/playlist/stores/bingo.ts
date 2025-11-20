import { defineStore } from "pinia";
import { usePlaylistStore } from "@/features/playlist/stores/playlist";
import type { TrackInfo } from "@/features/playlist/types/playlist";

interface BingoState {
  currentBingoTracks: TrackInfo[];
  selectedCells: boolean[];
  lastGeneratedDate: string | null;
}

interface BingoStorageState {
  tracks: TrackInfo[];
  selectedCells: boolean[];
  timestamp: number;
}

export const useBingoStore = defineStore("bingo", {
  state: (): BingoState => ({
    currentBingoTracks: [],
    selectedCells: Array(9).fill(false),
    lastGeneratedDate: null,
  }),

  getters: {
    isBingo: (state): boolean => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтальные
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикальные
        [0, 4, 8], [2, 4, 6] // Диагональные
      ];
      
      return lines.some(line => line.every(index => state.selectedCells[index]));
    },

    bingoStorageKey: () => (playlistId: string): string => {
      return `bingo_${playlistId}`;
    },
  },

  actions: {
    // Генерация нового бинго
    generateNewBingo(playlistId: string): void {
      const playlistStore = usePlaylistStore();
      
      if (!playlistStore.selectedPlaylistCurrent?.tracks?.length) {
        console.warn('No tracks available for bingo');
        return;
      }

      const allTracks = [...playlistStore.selectedPlaylistCurrent.tracks];
      
      if (allTracks.length < 9) {
        console.warn('Not enough tracks for bingo (minimum 9 required)');
        return;
      }

      const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
      this.currentBingoTracks = shuffled.slice(0, 9);
      this.selectedCells = Array(9).fill(false);
      this.lastGeneratedDate = new Date().toDateString();

      this.saveBingoState(playlistId);
    },

    toggleCell(index: number, playlistId: string): void {
      if (index >= 0 && index < this.selectedCells.length) {
        this.selectedCells[index] = !this.selectedCells[index];
        this.saveBingoState(playlistId);
      }
    },

    saveBingoState(playlistId: string): void {
      if (typeof window !== 'undefined') {
        const state: BingoStorageState = {
          tracks: this.currentBingoTracks,
          selectedCells: this.selectedCells,
          timestamp: new Date().getTime()
        };
        localStorage.setItem(this.bingoStorageKey(playlistId), JSON.stringify(state));
      }
    },
    loadBingoState(playlistId: string): boolean {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(this.bingoStorageKey(playlistId));
        if (saved) {
          try {
            const state: BingoStorageState = JSON.parse(saved);
            this.currentBingoTracks = state.tracks || [];
            this.selectedCells = state.selectedCells || Array(9).fill(false);
            this.lastGeneratedDate = new Date(state.timestamp).toDateString();
            return true;
          } catch (error) {
            console.error('Error loading bingo state:', error);
          }
        }
      }
      return false;
    },

    shouldGenerateNewDailyBingo(playlistId: string): boolean {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(this.bingoStorageKey(playlistId));
        if (saved) {
          try {
            const state: BingoStorageState = JSON.parse(saved);
            const savedDate = new Date(state.timestamp);
            const today = new Date();
            
            return savedDate.toDateString() !== today.toDateString();
          } catch (error) {
            return true;
          }
        }
      }
      return true;
    },

    initializeBingo(playlistId: string): void {
      const loaded = this.loadBingoState(playlistId);
      
      if (!loaded || this.shouldGenerateNewDailyBingo(playlistId)) {
        this.generateNewBingo(playlistId);
      }
    },

    resetBingo(): void {
      this.currentBingoTracks = [];
      this.selectedCells = Array(9).fill(false);
      this.lastGeneratedDate = null;
    },
  },
});