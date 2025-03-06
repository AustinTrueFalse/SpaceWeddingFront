import type { Drink } from "./drink";
import type { Guest } from "./guest";
import type { User } from "./user";
import type { GuestStatus } from "./guestStatus";
import type { Timing } from "./timing";

export interface Event {
  id: string;
  created: Date;
  eventName: string;
  eventDate: Date;
  eventDesignId: number;
  eventLocation: string;
  eventDrinks: Drink [];
  eventTiming: Timing [];
  guestStatuses: GuestStatus [];
  userId: string;
  hostId: string;
  guests: Guest[];
  allowedUsers: User[];
}

export interface EventDesign {
  id: number;
  name: string;
}
