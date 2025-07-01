<template>
  <DialogDefault
    v-if="dialogStore.type === 'drinkInfo'"
    title="Информация"
    confirmText="Да"
  >
    <v-card v-for="drink in guestDrinks" :key="drink.id" flat>
      <v-card-title>
        <v-row>
          <v-col cols="3">
            {{ drink.drinkName }}
          </v-col>
          <v-col>
            <v-chip
              v-for="(guest, index) in drink.guests"
              :key="index"
              class="ml-2"
            >
              {{ guest }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { useDialogStore } from "@/stores/dialog";
import { computed, defineProps } from "vue";

import DialogDefault from "@/components/template/DialogDefault.vue";
import type { Drink } from "@/types/drink";



const route = useRoute();

const eventStore = useEventStore();
const dialogStore = useDialogStore();

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

// Вычисляем текущий ивент
const currentEvent = computed(() => eventStore.selectedEventCurrent);

const guestDrinks = computed(() => {
  // Массив для хранения результатов
  const drinksArray: { id: string; drinkName: string; guests: string[] }[] = [];

  // Проходим по каждому гостю и его напиткам
  eventStore.selectedEventCurrent.guests.forEach((guest) => {
    guest.guestDrinks.forEach((drink: Drink) => {
      // Ищем напиток в массиве
      const existingDrink = drinksArray.find(
        (item) => item.drinkName === drink.drinkName
      );

      if (existingDrink) {
        // Если напиток уже есть в массиве, добавляем нового гостя
        existingDrink.guests.push(guest.guestName);
      } else {
        // Если напитка нет в массиве, добавляем новый объект с данным напитком и гостем
        drinksArray.push({
          id: drink.id,
          drinkName: drink.drinkName,
          guests: [guest.guestName], // Инициализируем массив с именем гостя
        });
      }
    });
  });

  // Возвращаем массив с напитками и списками гостей
  return drinksArray;
});
</script>
