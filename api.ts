// api.ts
const BASE_URL = "http://localhost:5000";

import { showSnackbar } from "./helpers/snackbar";

// Общая функция для выполнения API запросов
const apiFetch = async <T = unknown>(
  url: string,
  body: Record<string, unknown> = {}
): Promise<T> => {
  try {
    const response = await $fetch(url, {
      baseURL: BASE_URL, // Используем статический baseURL
      method: "POST", // Всегда используем метод POST
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // Убедитесь, что тело сериализуется в JSON
    });

    // Явное приведение типа результата, чтобы не ругалось на 'unknown'
    return response as T;
  } catch (error: any) {
    showSnackbar(error, "error");
    console.log("Ошибка запроса", error);
    throw error;
  }
};

export default apiFetch;
