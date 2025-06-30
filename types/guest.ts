import type { Drink } from "./drink";
import type { Tag } from "./tag";

export interface Guest {
  id: string;
  created: Date
  updated: Date
  eventId: string;
  guestName: string;
  guestPhone: string;
  guestStatus: string;
  guestDrinks: Drink[];
  guestTag: Tag;
  guestDescr: string;
}


