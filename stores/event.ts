// stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import apiFetch from "../api";
import { useSnackbarStore } from "./snackbar";

import type { Event } from "@/types/event";
import type { Design } from "@/types/design";
import type { Drink } from "@/types/drink";
import type { GuestStatus } from "@/types/guestStatus";
import type { Timing } from "@/types/timing";
import type { Guest } from "@/types/guest";
import type { Todo } from "@/types/todo";
import type { Tag } from "@/types/tag";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface EventState {
  eventList: Event[];
  selectedEvent: Event;
  designList: Design[];
  drinksDictionary: Drink[];
  tagsDictionary: Tag[];
  loadingStatuses: LoadingStatuses;
}

export const useEventStore = defineStore("event", {
  state: (): EventState => ({
    designList: [],
    eventList: [],
    selectedEvent: {
      id: "",
      created: new Date(),
      eventName: "",
      eventTime: "",
      eventDate: new Date(),
      eventDesignId: "",
      eventLocation: "",
      eventDrinks: [],
      eventTags: [],
      eventTiming: [
        {
          id: "1",
          time: "18:00",
          description: "Встреча на площадке",
        },
        {
          id: "1",
          time: "18:00",
          description: "Церемония",
        },
        {
          id: "1",
          time: "19:00",
          description: "Ужин",
        },
      ],
      eventCouple: {
        groomName: "",
        groomBlank: "",
        brideName: "",
        brideBlank: "",
      },
      guestStatuses: [],
      userId: "",
      hostId: "",
      guests: [],
      todoList: [],
      allowedUsers: [],
      eventInvite: {
        header: "",
        mainPhoto: "",
        secondPhoto: "",
        locationInfo: {
          header: "",
          text: "",
        },
        colorsInfo: {
          header: "",
          colors: [],
          manInfo: {
            header: "",
            text: "",
          },
          womanInfo: {
            header: "",
            text: "",
          },
        },
        bottomInfo: {
          header: "",
          text: "",
          subtext: "",
        },
        footerInfo: {
          text: "",
        },
      },
    },
    drinksDictionary: [],
    tagsDictionary: [],
    loadingStatuses: {
      eventCreate: false,
      eventList: false,
      eventDelete: false,
      selecetedEvent: false,
      designList: false,
      drinksDictionary: false,
      guestList: false,
      guestsUpdate: false,
    },
  }),
  getters: {
    eventGuestCount: (state) => state.selectedEvent.guests.length,
    eventGuestComeCount: (state) =>
      state.selectedEvent.guests.filter((g) => g.guestStatus === "1").length,
    eventGuestNotComeCount: (state) =>
      state.selectedEvent.guests.filter((g) => g.guestStatus === "2").length,
    eventGuestUnknownComeCount: (state) =>
      state.selectedEvent.guests.filter((g) => g.guestStatus === "3").length,
  },
  actions: {
    addEventColor(color: string) {
      this.selectedEvent.eventInvite.colorsInfo.colors.push(color);
    },
    deleteEventColor(color: string) {
      this.selectedEvent.eventInvite.colorsInfo.colors =
        this.selectedEvent.eventInvite.colorsInfo.colors.filter(
          (existingColor) => existingColor !== color
        );
    },
    resetEventList() {
      this.eventList = [];
    },
    resetSelectedEvent() {
      this.selectedEvent = {
        id: "",
        created: new Date(),
        eventName: "",
        eventTime: "",
        eventDate: new Date(),
        eventDesignId: "",
        eventLocation: "",
        eventDrinks: [],
        eventTags: [],
        eventTiming: [
          {
            id: "1",
            time: "18:00",
            description: "Встреча на площадке",
          },
          {
            id: "2",
            time: "18:30",
            description: "Церемония",
          },
          {
            id: "3",
            time: "19:00",
            description: "Ужин",
          },
        ],
        eventCouple: {
          groomName: "",
          groomBlank: "",
          brideName: "",
          brideBlank: "",
        },
        guestStatuses: [],
        userId: "",
        hostId: "",
        guests: [],
        todoList: [],
        allowedUsers: [],
        eventInvite: {
          header: "",
          mainPhoto: "",
          secondPhoto: "",
          locationInfo: {
            header: "",
            text: "",
          },
          colorsInfo: {
            header: "",
            colors: [],
            manInfo: {
              header: "",
              text: "",
            },
            womanInfo: {
              header: "",
              text: "",
            },
          },
          bottomInfo: {
            header: "",
            text: "",
            subtext: "",
          },
          footerInfo: {
            text: "",
          },
        },
      };
    },
    setDate(value: Date) {
      this.selectedEvent.eventDate = value; // Обновление даты
    },
    addTiming() {
      const maxId = this.selectedEvent.eventTiming.reduce(
        (max, timing) => Math.max(max, parseInt(timing.id, 10) || 0),
        0
      );
      this.selectedEvent.eventTiming.push({
        id: (maxId + 1).toString(),
        time: "",
        description: "",
      });
    },
    updateTimingTime(id: string, time: string) {
      const timing = this.selectedEvent.eventTiming.find((d) => d.id === id);
      if (timing) {
        timing.time = time;
      }
    },
    updateTimingDescr(id: string, descr: string) {
      const timing = this.selectedEvent.eventTiming.find((d) => d.id === id);
      if (timing) {
        timing.description = descr;
      }
    },
    deleteTiming(id: string) {
      const index = this.selectedEvent.eventTiming.findIndex(
        (d) => d.id === id
      );
      if (index !== -1) {
        this.selectedEvent.eventTiming.splice(index, 1);
      }
    },
    async createEvent() {
      try {
        this.loadingStatuses.eventCreate = true;

        await apiFetch("api/events/add", {
          eventName: this.selectedEvent.eventName,
          eventDate: this.selectedEvent.eventDate,
          eventTime: this.selectedEvent.eventTime,
          eventLocation: this.selectedEvent.eventLocation,
          eventDesignId: this.selectedEvent.eventDesignId,
          eventDrinks: this.selectedEvent.eventDrinks,
          eventTags: this.selectedEvent.eventTags,
          eventTiming: this.selectedEvent.eventTiming,
          eventCouple: this.selectedEvent.eventCouple,
          guestStatuses: this.selectedEvent.guestStatuses,
          eventInvite: this.selectedEvent.eventInvite,
        });

        this.loadingStatuses.eventCreate = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Мероприятие создано", "success");
      } catch (error: any) {
        this.loadingStatuses.eventCreate = false;
        console.error(error);
      }
    },
    async updateEvent(eventId: string) {
      try {
        this.loadingStatuses.eventCreate = true;
        await apiFetch("api/events/update", {
          eventName: this.selectedEvent.eventName,
          eventDate: this.selectedEvent.eventDate,
          eventTime: this.selectedEvent.eventTime,
          eventLocation: this.selectedEvent.eventLocation,
          eventDesignId: this.selectedEvent.eventDesignId,
          eventDrinks: this.selectedEvent.eventDrinks,
          eventTags: this.selectedEvent.eventTags,
          eventTiming: this.selectedEvent.eventTiming,
          eventCouple: this.selectedEvent.eventCouple,
          guestStatuses: this.selectedEvent?.guestStatuses,
          eventInvite: this.selectedEvent.eventInvite,
          eventId: eventId,
        });

        this.getEventById(eventId);
        // this.getEvents();
        this.loadingStatuses.eventCreate = false;
      } catch (error) {
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

        // Преобразование даты
        if (res.eventDate) {
          res.eventDate = new Date(res.eventDate);
        }

        // Преобразование даты
        if (res.created) {
          res.created = new Date(res.created);
        }

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
        this.drinksDictionary = [];
        this.loadingStatuses.drinksDictionary = true;
        const res = await apiFetch<Drink[]>("api/guests/drinks");
        this.drinksDictionary = res;
        this.loadingStatuses.drinksDictionary = false;
      } catch (error) {
        this.loadingStatuses.drinksDictionary = false;
        console.error(error);
      }
    },
    async getTags() {
      try {
        this.tagsDictionary = [];
        this.loadingStatuses.tagsDictionary = true;
        const res = await apiFetch<Tag[]>("api/guests/tags");
        this.tagsDictionary = res;
        this.loadingStatuses.tagsDictionary = false;
      } catch (error) {
        this.loadingStatuses.tagsDictionary = false;
        console.error(error);
      }
    },
    async getGuests(eventId: string) {
      try {
        this.loadingStatuses.guestList = true;
        const res = await apiFetch<Guest[]>("api/guests/list", {
          eventId: eventId,
        });
        console.log(res);
        this.selectedEvent.guests = res;
        console.log(this.selectedEvent.guests);
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
        this.selectedEvent.guestStatuses = res;
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

    async updateGuestList() {
      try {
        this.loadingStatuses.guestsUpdate = true;

        await apiFetch("api/guests/update_list", {
          guests: this.selectedEvent.guests,
        });

        this.loadingStatuses.guestsUpdate = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Гость записан", "success");
      } catch (error: any) {
        this.loadingStatuses.guestsUpdate = false;
        console.error(error);
        throw error;
      }
    },
    addTodoTask(name: string) {
      const newTask: Todo = {
        id: Date.now().toString(), // Генерируем уникальный ID
        name: name,
        completed: false,
      };

      this.selectedEvent.todoList.push(newTask);
    },
    updateTodoTask(id: string, completed: boolean | null) {
      const task = this.selectedEvent.todoList.find((task) => task.id === id);
      if (task && completed !== null) {
        task.completed = completed;
      }
    },
    deleteTodoTask(id: string) {
      const taskToRemove = this.selectedEvent.todoList.find(
        (task) => task.id === id
      );
      if (!taskToRemove) return;

      this.selectedEvent.todoList = this.selectedEvent.todoList.filter(
        (task) => task.id !== id
      );
    },
    async updateTodo(eventId: string) {
      try {
        await apiFetch("api/events/update_todo", {
          eventId,
          todoList: this.selectedEvent.todoList,
        });

        this.loadingStatuses.eventCreate = false;
      } catch (error: any) {
        console.error(error);
      }
    },
  },
});
