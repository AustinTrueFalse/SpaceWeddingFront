<template>
  <v-card
    rounded="xl"
    class="event-card h-100 custom-scrollbar"
    elevation="0"
    style="max-height: 500px"
  >
    <v-card-title class="text-center pt-4">Список задач</v-card-title>

    <v-card-text
      class="custom-scrollbar"
      style="overflow: auto; max-height: 400px"
    >
      <v-text-field
        v-model="newTaskName"
        class="pt-4"
        label="Новая задача"
        variant="outlined"
        rounded="xl"
      >
        <template v-slot:append-inner>
          <v-icon
            
            class="mr-1"
            size="25px"
            @click="addTask"
          >
            mdi-plus
          </v-icon>
        </template>
      </v-text-field>

      <v-row>
        <v-col>
          <v-card
            v-for="task in eventStore.selectedEventCurrent.todoList"
            :key="task.id"
            rounded="xl"
            variant="plain"
          >
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-checkbox
                  v-model="task.completed"
                  density="compact"
                  hide-details
                  @update:modelValue="
                    (value: any) => updateTaskStatus(task.id, value)
                  "
                ></v-checkbox>
                <span class="ml-2 text-body-2">{{ task.name }}</span>
              </div>
              <v-icon
                
                size="25px"
                @click="deleteTask(task.id)"
              >
                mdi-delete
              </v-icon>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import { useRoute } from "vue-router";
import { useEventStore } from "../stores/event";

const route = useRoute();

const eventStore = useEventStore();

const newTaskName = ref("");

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

watch(
  () => eventStore.selectedEventCurrent.todoList,
  () => {
    // Вызываем метод из Pinia, например, для синхронизации данных
    eventStore.updateTodo(eventId);
  },
  { deep: true } // Глубокое слежение, чтобы реагировать на изменения внутри массива
);

const addTask = () => {
  eventStore.addTodoTask(newTaskName.value.trim());

  newTaskName.value = ""; // Очищаем поле ввода
};

const deleteTask = (id: string) => {
  eventStore.deleteTodoTask(id);
};

const updateTaskStatus = (id: string, completed: boolean | null) => {
  eventStore.updateTodoTask(id, completed);
};
</script>
