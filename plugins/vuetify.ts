import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
// import { md2 } from 'vuetify/blueprints'
// import { md1 } from 'vuetify/blueprints'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { ru } from "vuetify/locale";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    locale: {
      locale: "ru",
      messages: { ru },
    },
    blueprint: md3,
    components,
    directives,
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: { mdi },
    },
    defaults: {
      VDataTable: {
        itemsPerPageText: "Элементов на странице",
        itemsPerPageOptions: [
          { value: 10, title: "10" },
          { value: 25, title: "25" },
          { value: 50, title: "50" },
          { value: 100, title: "100" },
          { value: -1, title: "Все" },
        ],
        pageText: "{0}-{1} из {2}",
      },
    },
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            // ===== КОСМИЧЕСКИЕ ФОНЫ  =====
            background: "#12151E", 
            surface: "#1D2345", 
            "surface-variant": "#28304D", // Для состояний hover/active

            // ===== АКЦЕНТНЫЕ ЦВЕТА =====
            primary: "#4D6AFF", // Яркий космический синий 
            "primary-darken-1": "#3A56E0",
            secondary: "#24308B", // Глубокий ультрамарин
            "secondary-darken-1": "#1A2260",

            // ===== СИСТЕМНЫЕ ЦВЕТА =====
            error: "#D32F2F", // Красный 
            info: "#1976D2", // Синий для информации
            success: "#388E3C", // Зеленый
            warning: "#FFA000", // Янтарный

            // ===== ЦВЕТА ТЕКСТА =====
            "on-primary": "#FFFFFF",
            "on-secondary": "#FFFFFF", 
            "on-surface": "#FFFFFF", 
            "on-background": "#FFFFFF", 
            "on-error": "#FFFFFF",
          },
        },
        light: {
          colors: {
            // ===== СВЕТЛАЯ ТЕМА =====
            background: "#F5F5F5",
            surface: "#FFFFFF",
            "surface-variant": "#ECEFF1",

            // Акценты
            primary: "#1A237E",
            "primary-darken-1": "#0D1440",
            secondary: "#3949AB",

            // Системные
            error: "#B71C1C",
            info: "#0D47A1",
            success: "#1B5E20",
            warning: "#E65100",

            // Текст
            "on-primary": "#FFFFFF",
            "on-secondary": "#FFFFFF",
            "on-surface": "#212121",
            "on-background": "#424242",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
