// stores/auth.ts
import { defineStore } from "pinia";
import apiFetch from "@/shared/services/api";
import { useSnackbarStore } from "@/stores/snackbar";

import type { Guest, GuestCreate, GuestUpdate } from "../types/guest";
import type { Event } from "../types/event";

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
      guestTag: {
        id: "-1",
        tagName: "",
      },
      guestDescr: "",
    },

    loadingStatuses: {
      guestAdd: false,
      guestList: false,
      drinkList: false,
    },
  }),

  actions: {
    createGuestBody() {
      return {
        guestName: this.guest.guestName,
        guestPhone: this.guest.guestPhone,
        guestStatus: this.guest.guestStatus,
        guestDrinks: this.guest.guestDrinks,
        guestTag: this.guest.guestTag,
        guestDescr: this.guest.guestDescr,
      };
    },
    resetGuest() {
      this.guest = {
        id: "",
        created: new Date(),
        updated: new Date(),
        eventId: "",
        guestName: "",
        guestPhone: "",
        guestStatus: "",
        guestDrinks: [],
        guestTag: {
          id: "-1",
          tagName: "",
        },
        guestDescr: "",
      };
    },
    async addGuestAuth(eventId: string) {
      try {
        this.loadingStatuses.guestAdd = true;

        await apiFetch("api/guests/add_auth", {
          eventId: eventId,
          guestName: this.guest.guestName,
          guestPhone: this.guest.guestPhone,
          guestStatus: this.guest.guestStatus,
          guestDrinks: this.guest.guestDrinks,
          guestTag: this.guest.guestTag,
          guestDescr: this.guest.guestDescr,
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
    async addGuest(eventId: Event["id"]) {
      try {
        this.loadingStatuses.guestAdd = true;
        const guestBody: GuestCreate = {
          ...this.createGuestBody(),
          eventId,
        };

        await apiFetch("api/guests/add", {
          ...guestBody,
          eventId,
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
    async updateGuest(guestId: Guest["id"]) {
      try {
        this.loadingStatuses.guestAdd = true;

        const guestBody: GuestUpdate = {
          ...this.createGuestBody(),
          guestId,
        };

        await apiFetch("api/guests/update", guestBody);

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
