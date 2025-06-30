<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template #activator="{ props }">
      <v-btn class="ml-5" icon v-bind="props" variant="tonal" >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-color-picker
        v-model="color"
        show-swatches
        hide-inputs
        flat
      ></v-color-picker>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="menu = false">Отмена</v-btn>
        <v-btn color="primary" @click="saveColor">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({});
const emit = defineEmits(["updateColor"]);

const menu = ref(false);
const color = ref("#FF0000");

const saveColor = () => {
  emit("updateColor", color.value);
  menu.value = false;
};
</script>
