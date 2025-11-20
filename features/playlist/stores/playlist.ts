import { defineStore } from "pinia";
import { cloneDeep } from "lodash-es";
import apiFetch from "@/shared/services/api";
import { useSnackbarStore } from "@/stores/snackbar";

import {
  initialPlaylistState,
  type Playlist,
  type PlaylistCreate,
  type PlaylistUpdate,
  type TrackInfo,
} from "../types/playlist";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface PlaylistState {
  playlists: Playlist[];
  selectedPlaylistCurrent: Playlist;
  selectedPlaylistOriginal: Playlist;
  loadingStatuses: LoadingStatuses;
}

export type ParseType = "youtube" | "yandex";

export const usePlaylistStore = defineStore("playlist", {
  state: (): PlaylistState => ({
    playlists: [],
    selectedPlaylistCurrent: { ...initialPlaylistState },
    selectedPlaylistOriginal: { ...initialPlaylistState },
    loadingStatuses: {
      playlistCreate: false,
      playlistUpdate: false,
      playlists: false,
      playlistDelete: false,
      selecetedPlaylist: false,
    },
  }),
  actions: {
    resetPlaylists(): void {
      this.playlists = [];
    },
    setSelectedPlaylist(playlist: Playlist): void {
      this.selectedPlaylistCurrent = cloneDeep(playlist);
      this.selectedPlaylistOriginal = cloneDeep(playlist);
    },
    resetSelectedPlaylist() {
      this.setSelectedPlaylist({ ...initialPlaylistState });
    },
    resetCurrentToOriginal(): void {
      if (this.selectedPlaylistOriginal) {
        this.selectedPlaylistCurrent = cloneDeep(this.selectedPlaylistOriginal);
      }
    },
    async searchTrack(url: string, type: ParseType): Promise<any> {
      try {
        const snackbarStore = useSnackbarStore();
        if (!this.isTrackExists(url)) {
          const response = await apiFetch<TrackInfo>(
            `api/music/parse_${type}`,
            url
          );

          console.log(response);

          this.selectedPlaylistCurrent.tracks.push(response);

          return response;
        } else {
          snackbarStore.showSnackbar("Трек уже есть в плэйлисте", "orange");
        }
      } catch (error: any) {
        console.error("Ошибка при парсинге трека:", error);
        throw error;
      }
    },
    deleteTrack(url: string): void {
      try {
        this.selectedPlaylistCurrent.tracks =
          this.selectedPlaylistCurrent.tracks.filter((t) => t.url !== url);
      } catch (error: any) {
        throw error;
      }
    },
    isTrackExists(url: string): boolean {
      return this.selectedPlaylistCurrent.tracks.some((t) => t.url === url);
    },

    async createPlaylist(): Promise<void> {
      try {
        this.loadingStatuses.playlistCreate = true;

        await apiFetch("api/playlists/add", this.createPlaylistBody());

        this.loadingStatuses.playlistCreate = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Плейлист создан", "success");
      } catch (error: any) {
        this.loadingStatuses.playlistCreate = false;
        console.error(error);
      }
    },

    // Обновление плейлиста
    async updatePlaylist(playlistId: string): Promise<void> {
      try {
        this.loadingStatuses.playlistUpdate = true;
        const playlistBody: PlaylistCreate = this.createPlaylistBody();
        const bodyForUpdate: PlaylistUpdate = {
          ...playlistBody,
          id: playlistId,
        };

        await apiFetch("api/playlists/update", bodyForUpdate);

        this.getPlaylistById(playlistId);
        this.loadingStatuses.playlistUpdate = false;
      } catch (error) {
        this.loadingStatuses.playlistUpdate = false;
        console.error(error);
      }
    },
    async getPlaylists(): Promise<void> {
      try {
        this.loadingStatuses.playlistList = true;
        const res = await apiFetch<Playlist[]>("api/playlists/list");
        this.playlists = res;
        this.loadingStatuses.playlistList = false;
      } catch (error) {
        this.loadingStatuses.playlistList = false;
        console.error(error);
      }
    },

    // Получение плейлиста по ID
    async getPlaylistById(playlistId: string): Promise<void> {
      try {
        this.loadingStatuses.selectedPlaylist = true;
        const res = await apiFetch<Playlist>("api/playlists/id", {
          playlistId: playlistId,
        });

        this.setSelectedPlaylist(res);
        this.loadingStatuses.selectedPlaylist = false;
      } catch (error) {
        this.loadingStatuses.selectedPlaylist = false;
        console.error(error);
      }
    },

    // Удаление плейлиста
    async deletePlaylist(playlistId: string): Promise<void> {
      try {
        this.loadingStatuses.playlistDelete = true;
        await apiFetch("api/playlists/delete", {
          playlistId: playlistId,
        });

        this.getPlaylists();
        this.loadingStatuses.playlistDelete = false;
      } catch (error) {
        this.loadingStatuses.playlistDelete = false;
        console.error(error);
      }
    },

    createPlaylistBody(): PlaylistCreate {
      return {
        playlistName: this.selectedPlaylistCurrent?.playlistName || "",
        tracks: this.selectedPlaylistCurrent?.tracks || [],
      };
    },
  },
});
