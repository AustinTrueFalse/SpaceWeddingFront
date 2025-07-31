import { showSnackbar } from "../utils/snackbar";

// Общая функция для выполнения API запросов
const apiFetch = async <Response = unknown, Body = unknown>(
  url: string,
  body?: Body,
  isMessage: boolean = true
): Promise<Response> => {
  const config = useRuntimeConfig();
  const BASE_URL = (config.public.apiUrl as string) || "http://localhost:5000";

  try {
    const response = await $fetch<T>(url, {
      baseURL: BASE_URL,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response;
  } catch (error: any) {
    if (isMessage) {
      showSnackbar(error, "error");
    }

    console.log("Ошибка запроса", error);
    throw error;
  }
};

export default apiFetch;
