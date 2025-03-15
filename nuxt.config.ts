export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  ssr: false, // если нужно для SSR, установи true
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt", 
    "vue-yandex-maps/nuxt", 
    "vuetify-nuxt-module",  // Добавляем Vuetify
  ],
  vuetify: {
    // Если хочешь использовать свою тему или кастомизировать Vuetify
    
  },
  imports: {
    dirs: ["stores"],
  },
  yandexMaps: {
    apikey: "5ffff158-a6f7-4967-99ff-b8f8cfdb290f",
  },
  css: [
    "./assets/styles/main.css",
  ],
});
