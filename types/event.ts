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
