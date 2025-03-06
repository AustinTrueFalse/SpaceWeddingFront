// stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue"
import apiFetch from "../api";
import { useSnackbarStore } from "./snackbar";

import type { Event } from "@/types/event";
import type { Design } from "@/types/design";
import type { Drink } from "@/types/drink";
import type { GuestStatus } from "@/types/guestStatus";
import type { Timing } from "@/types/timing";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface EventState {
  eventName: string;
  eventDate: Date | null;
  eventLocation: string | null;
  selectedDesign: string;
  eventDrinks: Drink[];
  eventTiming: Timing[];
  guestStatuses: GuestStatus[];
  designList: Design[];
  eventList: Event[];
  selectedEvent: Event | null;
  drinksDictionary: Drink[];
  loadingStatuses: LoadingStatuses;
}

export const useEventStore = defineStore("event", {
  state: (): EventState => ({
    eventName: "",
    eventDate: null,
    eventLocation: null,
    selectedDesign: "gothic",
    designList: [],
    eventList: [],
    selectedEvent: null,
    eventDrinks: [],
    eventTiming: [],
    guestStatuses: [],
    drinksDictionary: [
      {
        id: "1",
        drinkName: "Коньяк",
      },
      {
        id: "2",
        drinkName: "Вино",
      },
    ],
    loadingStatuses: {
      eventCreate: false,
      eventList: false,
      eventDelete: false,
      selecetedEvent: false,
      designList: false,
    },
  }),

  actions: {
    setDate(value: Date) {
      this.eventDate = value; // Обновление даты
    },
    addTimingSelectedEvent() {
      if (!this.selectedEvent) {
        console.error("selectedEvent is null");
        return;
      }
      if (!this.selectedEvent?.eventTiming) {
        this.selectedEvent.eventTiming = [
          { id: "0", time: "", description: "" },
        ];
      } else {
        const maxId = this.selectedEvent.eventTiming.reduce(
          (max, drink) => Math.max(max, parseInt(drink.id, 10) || 0),
          0
        );
        this.selectedEvent.eventTiming.push({
          id: (maxId + 1).toString(),
          time: "",
          description: "",
        });
      }
    },
    updateTimingTimeSelectedEvent(id: string, time: string) {
      const timing = this.selectedEvent?.eventTiming.find((d) => d.id === id);
      if (timing) {
        timing.time = time;
      }
    },
    updateTimingDescrSelectedEvent(id: string, descr: string) {
      const timing = this.selectedEvent?.eventTiming.find((d) => d.id === id);
      if (timing) {
        timing.description = descr;
      }
    },
    deleteTimingSelectedEvent(id: string) {
      if (!this.selectedEvent) {
        console.error("selectedEvent is null");
        return;
      }
      if (this.selectedEvent.eventTiming.length > 1) {
        this.selectedEvent.eventTiming = this.selectedEvent.eventTiming.filter(
          (d) => d.id !== id
        );
      }
    },
    addTiming() {
      const maxId = this.eventTiming.reduce(
        (max, timing) => Math.max(max, parseInt(timing.id, 10) || 0),
        0
      );
      this.eventTiming.push({
        id: (maxId + 1).toString(),
        time: "",
        description: "",
      });
    },
    updateTimingTime(id: string, time: string) {
      const timing = this.eventTiming.find((d) => d.id === id);
      if (timing) {
        timing.time = time;
      }
    },
    updateTimingDescr(id: string, descr: string) {
      const timing = this.eventTiming.find((d) => d.id === id);
      if (timing) {
        timing.description = descr;
      }
    },
    deleteTiming(id: string) {
      const index = this.eventTiming.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.eventTiming.splice(index, 1);
      }
    },
    async createEvent() {
      try {
        this.loadingStatuses.eventCreate = true;

        await apiFetch("api/events/add", {
          eventName: this.eventName,
          eventDate: this.eventDate,
          eventLocation: this.eventLocation,
          eventDesignId: this.selectedDesign,
          eventDrinks: this.eventDrinks,
          guestStatuses: this.guestStatuses,
        });

        this.loadingStatuses.eventCreate = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Мероприятие создано", "success");
      } catch (error: any) {
        this.loadingStatuses.eventCreate = false;
        console.error(error);
      }
    },
    async getEvents() {
      try {
        this.loadingStatuses.eventList = true;
        const res = await apiFetch<Event[]>("api/events/list");
        this.eventList = res;
        this.loadingStatuses.eventList = false;
      } catch (error) {
        this.loadingStatuses.eventList = false;
        console.error(error);
      }
    },
    async getEventById(eventId: string) {
      try {
        this.loadingStatuses.selecetedEvent = true;
        const res = await apiFetch<Event>("api/events/id", {
          eventId: eventId,
        });
        this.selectedEvent = res;
        this.loadingStatuses.selecetedEvent = false;
      } catch (error) {
        this.loadingStatuses.selecetedEvent = false;
        console.error(error);
      }
    },
    async getDesigns() {
      try {
        this.loadingStatuses.designList = true;
        const res = await apiFetch<Design[]>("api/events/designs");
        this.designList = res;
        this.loadingStatuses.designList = false;
      } catch (error) {
        this.loadingStatuses.designList = false;
        console.error(error);
      }
    },
    async getDrinks() {
      try {
        this.eventDrinks = [];
        this.loadingStatuses.guestList = true;
        const res = await apiFetch<Drink[]>("api/guests/drinks");
        this.eventDrinks = res;
        this.loadingStatuses.guestList = false;
      } catch (error) {
        this.loadingStatuses.guestList = false;
        console.error(error);
      }
    },
    async getGuestStatuses() {
      try {
        this.loadingStatuses.guestList = true;
        const res = await apiFetch<GuestStatus[]>("api/guests/visit_sts");
        this.guestStatuses = res;
        this.loadingStatuses.guestList = false;
      } catch (error) {
        this.loadingStatuses.guestList = false;
        console.error(error);
      }
    },
    async deleteEvent(eventId: string) {
      try {
        this.loadingStatuses.eventDelete = true;
        await apiFetch("api/events/delete", {
          eventId: eventId,
        });

        this.getEvents();
        this.loadingStatuses.eventDelete = false;
      } catch (error) {
        this.loadingStatuses.eventDelete = false;
        console.error(error);
      }
    },
    async updateEvent(eventId: string) {
      try {
        this.loadingStatuses.eventDelete = true;
        await apiFetch("api/events/update", {
          eventName: this.selectedEvent?.eventName,
          eventDate: this.eventDate,
          eventLocation: this.selectedEvent?.eventLocation,
          eventDesignId: this.selectedEvent?.eventDesignId,
          eventDrinks: this.selectedEvent?.eventDrinks,
          guestStatuses: this.selectedEvent?.guestStatuses,
          eventId: eventId,
        });

        this.getEventById(eventId);
        // this.getEvents();
        this.loadingStatuses.eventDelete = false;
      } catch (error) {
        this.loadingStatuses.eventDelete = false;
        console.error(error);
      }
    },
  },
});
