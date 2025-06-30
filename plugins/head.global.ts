export default defineNuxtPlugin(() => {
  useHead({
    title: "SpaceWeedding",
    htmlAttrs: {
      lang: "ru",
      translate: "no",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "format-detection", content: "telephone=no" },
      { name: "google", content: "notranslate" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  });
});