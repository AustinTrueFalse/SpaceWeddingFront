import type { Drink } from "./drink";

export interface Guest {
  id: string;
  created: Date
  updated: Date
  eventId: string;
  guestName: string;
  guestPhone: string;
  guestStatus: string;
  guestDrinks: Drink[];
}


