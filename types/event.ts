import type { Drink } from "./drink";
import type { Guest } from "./guest";
import type { User } from "./user";
import type { GuestStatus } from "./guestStatus";
import type { Timing } from "./timing";
import type { Couple } from "./couple";
import type { Todo } from "./todo";

export interface Event {
  id: string;
  created: Date;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  eventDesignId: number;
  eventLocation: string;
  eventDrinks: Drink [];
  eventTiming: Timing [];
  eventCouple: Couple;
  guestStatuses: GuestStatus [];
  userId: string;
  hostId: string;
  guests: Guest[];
  todoList: Todo[];
  allowedUsers: User[];
}

export interface EventDesign {
  id: number;
  name: string;
}
