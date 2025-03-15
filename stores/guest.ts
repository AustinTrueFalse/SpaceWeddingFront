// stores/auth.ts
import { defineStore } from "pinia";
import apiFetch from "../api";
import { useSnackbarStore } from "../stores/snackbar";

import type { Drink } from "@/types/drink";
import type { Guest } from "@/types/guest";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface GuestState {
  guest: Guest;
  loadingStatuses: LoadingStatuses;
}

export const useGuestStore = defineStore("guest", {
  state: (): GuestState => ({
    guest: {
      id: "",
      created: new Date(),
      updated: new Date(),
      eventId: "",
      guestName: "",
      guestPhone: "",
      guestStatus: "",
      guestDrinks: [],
    },

    loadingStatuses: {
      guestAdd: false,
      guestList: false,
      drinkList: false,
    },
  }),

  actions: {
    async addGuestAuth(eventId: string) {
      try {
        this.loadingStatuses.guestAdd = true;

        await apiFetch("api/guests/add_auth", {
          eventId: eventId,
          guestName: this.guest.guestName,
          guestPhone: this.guest.guestPhone,
          guestStatus: this.guest.guestStatus,
          guestDrinks: this.guest.guestDrinks,
        });

        this.loadingStatuses.guestAdd = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Гость записан", "success");
      } catch (error: any) {
        this.loadingStatuses.guestAdd = false;
        console.error(error);
        throw error;
        
      }
    },
    async addGuest(eventId: string) {
      try {
        this.loadingStatuses.guestAdd = true;

        await apiFetch("api/guests/add", {
          eventId: eventId,
          guestName: this.guest.guestName,
          guestPhone: this.guest.guestPhone,
          guestStatus: this.guest.guestStatus,
          guestDrinks: this.guest.guestDrinks,
        });

        this.loadingStatuses.guestAdd = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Гость записан", "success");
      } catch (error: any) {
        this.loadingStatuses.guestAdd = false;
        console.error(error);
        throw error;
      }
    },
    async updateGuest(guestId: string) {
      try {
        this.loadingStatuses.guestAdd = true;

        await apiFetch("api/guests/update", {
          guestId: guestId,
          guestName: this.guest.guestName,
          guestPhone: this.guest.guestPhone,
          guestStatus: this.guest.guestStatus,
          guestDrinks: this.guest.guestDrinks,
        });

        this.loadingStatuses.guestAdd = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Гость записан", "success");
      } catch (error: any) {
        this.loadingStatuses.guestAdd = false;
        console.error(error);
        throw error;
      }
    },
    async deleteGuest(guestId: string, eventId: string) {
      try {
        this.loadingStatuses.guestAdd = true;

        await apiFetch("api/guests/delete", {
          guestId: guestId,
          eventId: eventId,
          guestName: this.guest.guestName,
          guestPhone: this.guest.guestPhone,
          guestStatus: this.guest.guestStatus,
          guestDrinks: this.guest.guestDrinks,
        });

        this.loadingStatuses.guestAdd = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Гость удален", "info");
      } catch (error: any) {
        this.loadingStatuses.guestAdd = false;
        console.error(error);
        throw error;
      }
    },
  },
});
