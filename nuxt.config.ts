import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false, // если нужно для SSR, установи true
  compatibilityDate: "2024-04-03",

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:5000",
    },
  },

  // devServer: {
  //   host: "0.0.0.0",
  // },

  vite: {
    
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  },

  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "vue-yandex-maps/nuxt",
    // "vuetify-nuxt-module",
    // "@nuxtjs/i18n",
  ],

  css: [
    "@/assets/styles/main.scss",
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
    apikey: process.env.NUXT_PUBLIC_YANDEX_MAPS_APIKEY as string,
  },

  plugins: ["~/plugins/head.global.ts", "~/plugins/vuetify.ts"],
});
