import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  ssr: false, // если нужно для SSR, установи true
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "vue-yandex-maps/nuxt",
    // "vuetify-nuxt-module",
    // "@nuxtjs/i18n",
  ],

  css: [
    "@fontsource/roboto/index.css",
    "@fontsource/roboto/900.css",
    "@fontsource/roboto/700.css",
    "@fontsource/roboto/500.css",
    "@fontsource/roboto/400.css",
    "@fontsource/roboto/300.css",
    "@fontsource/roboto/100.css",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  // i18n: {
  //   defaultLocale: "en",
  //   lazy: true,
  //   langDir: "i18n/locales/",
  //   locales: [
  //     { code: "en", name: "English", file: "en.json" },
  //     { code: "ru", name: "Russian", file: "ru.json" },
  //   ],
  // },



  imports: {
    dirs: ["stores"],
  },
  yandexMaps: {
    apikey: "5ffff158-a6f7-4967-99ff-b8f8cfdb290f",
  },

  plugins: ["~/plugins/head.global.ts", "~/plugins/vuetify.ts"],
});
