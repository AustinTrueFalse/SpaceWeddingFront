<template>
  <v-container class="pa-0 pb-5 mb-10">
    <v-sheet> ДАТА!!! {{ eventDate }} </v-sheet>
    <v-row justify="space-between" class="pt-10">
      <v-col cols="1">
        <v-row class="pb-10">
          <v-col>
            <v-sheet> THIS IS </v-sheet>
            <v-sheet> GOTHIC </v-sheet>
            <v-sheet> DESIGN </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="11">      
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="12">
        <v-sheet> AUG </v-sheet>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="6">
        <v-row class="">
          <v-col c>
            <v-sheet>
              MAKSIM
              <v-icon class="small-dot">mdi-circle</v-icon>
              VIOLA
            </v-sheet>
            <v-sheet> WEDDING </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-sheet> 24 </v-sheet>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="6">
        <v-row>
          <v-col class="text-left pl-10">
            <v-sheet> ДОРОГИЕ </v-sheet>
            <v-sheet> ДРУЗЬЯ И РОДНЫЕ </v-sheet>
            <v-sheet>
              В нашей жизни скоро состоится важное событие - свадьба!
            </v-sheet>
            <v-sheet>
              Мы будем очень рады, если вы разделите этот особенный день с нами!
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6"> </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

import { defineProps } from "vue";



const props = defineProps({
  eventDate: {
    type: String,
    required: true,
  }
})


</script>
