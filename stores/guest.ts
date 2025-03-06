// stores/auth.ts
import { defineStore } from "pinia";
import apiFetch from "../api";
import { useSnackbarStore } from "../stores/snackbar";

import type { Drink } from "@/types/drink";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface GuestState {
  guestName: string;
  guestPhone: string;
  guestStatus: number;
  guestDrinks: Drink[];
  loadingStatuses: LoadingStatuses;
}

export const useGuestStore = defineStore("guest", {
  state: (): GuestState => ({
    guestName: "",
    guestPhone: "",
    guestStatus: 0,
    guestDrinks: [],

    loadingStatuses: {
      guestAdd: false,
      guestList: false,
      drinkList: false,
    },
  }),

  actions: {
    async addGuest(eventId: string) {
      try {
        this.loadingStatuses.guestAdd = true;

        await apiFetch("api/guests/add", {
          eventId: eventId,
          guestName: this.guestName,
          guestPhone: this.guestPhone,
          guestStatus: this.guestStatus,
          guestDrinks: this.guestDrinks,
        });

        this.loadingStatuses.guestAdd = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Гость записан", "success");
      } catch (error: any) {
        this.loadingStatuses.guestAdd = false;
        console.error(error);
      }
    },
  },
});
