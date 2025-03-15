<template>
  <v-container max-width="1000px" class="mb-15">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="newTaskName"
          label="New Task"
          outlined
        ></v-text-field>
        <v-btn color="primary" @click="addTask">Add Task</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="task in eventStore.selectedEvent.todoList"
        :key="task.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-actions>
            <v-checkbox
              v-model="task.completed"
              :label="'Completed'"
              @update:modelValue="(value) => updateTaskStatus(task.id, value)"
            ></v-checkbox>
            <v-btn color="red" @click="deleteTask(task.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { themeColors, gradientSettings } from "@/config/themeConfig";

const route = useRoute();

const eventStore = useEventStore();

const newTaskName = ref("");

// Получаем ID ивента из параметров маршрута
const eventId = route.params.id as string;

watch(
  () => eventStore.selectedEvent.todoList,
  () => {
    console.log("todoList изменился:");

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
