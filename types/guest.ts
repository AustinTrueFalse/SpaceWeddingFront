import type { Drink } from "./drink";

export interface Guest {
  id: string;
  created: Date
  eventId: string;
  guestName: string;
  guestPhone: string;
  guestStatus: number;
  guestDrinks: Drink[];
}


