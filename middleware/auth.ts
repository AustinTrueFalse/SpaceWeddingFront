export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Проверяем, что middleware выполняется на клиенте
  if (process.client) {
    // Восстанавливаем пользователя из localStorage

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // await authStore.signInCookie();
      authStore.user = JSON.parse(storedUser); // Восстанавливаем состояние пользователя из localStorage
    }

    // Если пользователь не авторизован, пробуем выполнить signInCookie
    if (!authStore.user) {
      // Проверяем наличие флага в localStorage

      // Выполняем signInCookie только один раз
      await authStore.signInCookie();

      // После выполнения signInCookie, если пользователь всё равно не авторизован
      if (!authStore.user) {
        if (to.path !== "/") {
          return navigateTo("/"); // Редирект на главную
        }
        return; // Оставляем пользователя на главной странице
      }
    }
  } else {
    console.log("Middleware выполняется на сервере, пропускаем signInCookie");
  }
});
