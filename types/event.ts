import type { Drink } from "./drink";
import type { Guest } from "./guest";
import type { User } from "./user";
import type { GuestStatus } from "./guestStatus";
import type { Timing } from "./timing";
import type { Couple } from "./couple";
import type { Todo } from "./todo";
import type { Tag } from "./tag";
import type { Invite } from "./invite";

export interface Event {
  id: string;
  created: Date;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  eventDesignId: string
  eventLocation: string;
  eventDrinks: Drink[];
  eventTags: Tag[];
  eventTiming: Timing[];
  eventCouple: Couple;
  guestStatuses: GuestStatus[];
  userId: string;
  hostId: string;
  guests: Guest[];
  todoList: Todo[];
  allowedUsers: User[];
  eventInvite: Invite;
}

export interface EventDesign {
  id: number;
  name: string;
}

export const initialEventState: Event = {
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
};
