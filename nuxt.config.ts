export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  ssr: false,
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "vuetify-nuxt-module", "vue-yandex-maps/nuxt"],
  
  imports: {
    dirs: ["stores"], // укажите папку с вашими хранилищами для автоимпорта
  },
  yandexMaps: {
    apikey: "5ffff158-a6f7-4967-99ff-b8f8cfdb290f",
  },

  // plugins: [
  //   { src: '~/plugins/vuetify.ts' }, // Подключаем плагин Vuetify
  // ],
  css: [
    "./assets/styles/main.css", // Указываем путь к вашему CSS файлу
  ],
});
