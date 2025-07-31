import type { Drink } from "./drink";
import type { Event } from "./event";
import type { Tag } from "./tag";

export interface Guest {
  id: string;
  created: Date;
  updated: Date;
  eventId: string;
  guestName: string;
  guestPhone: string;
  guestStatus: string;
  guestDrinks: Drink[];
  guestTag: Tag;
  guestDescr: string;
}

export interface GuestCreate
  extends Pick<
    Guest,
    | "guestName"
    | "guestPhone"
    | "guestStatus"
    | "guestDrinks"
    | "guestTag"
    | "guestDescr"
    | "eventId"
  > {}

export interface GuestUpdate extends Partial<Omit<GuestCreate, "eventId">> {
  guestId: Guest["id"];
}
