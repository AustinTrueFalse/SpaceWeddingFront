export const ResponseCodes: Record<number, string> = {
  400: "Ошибка выполнения процедуры",
  401: "Токен не действителен",
  403: "Отказано в доступе",
  500: "Ошибка бэкэнда",
};

export enum FirebaseErrorCodes {
  EMAIL_NOT_FOUND = "Пользователь с таким email не найден",
  INVALID_PASSWORD = "Неверный пароль. Пожалуйста, проверьте свои данные",
  INVALID_LOGIN_CREDENTIALS = "Указаны некорретные email или пароль",
  USER_DISABLED = "Ваш аккаунт был заблокирован. Пожалуйста, свяжитесь с поддержкой",
  EMAIL_EXISTS = "Этот email уже зарегистрирован",
  INVALID_EMAIL = "Неверный формат email",
  MISSING_PASSWORD = "Пароль не был предоставлен",
  USERNAME_EXISTS = "Логин занят другим пользователем"
}

export function getErrorMessage(error: any): string {
  // Проверка наличия свойства response и его вложенных свойств

  let errorMessage: string[] = [];

  if (
    error.response &&
    error.response.status &&
    typeof error.response.status === "number" &&
    ResponseCodes[error.response.status]
  ) {
    errorMessage.push(ResponseCodes[error.response.status]);
  }

  if (
    error.response &&
    error.response._data &&
    error.response._data.error &&
    error.response._data.error.message
  ) {
    const firebaseMessage = error.response._data.error
      .message as keyof typeof FirebaseErrorCodes;
    errorMessage.push(FirebaseErrorCodes[firebaseMessage] || "");
  }

  // Если ошибка не содержит message, возвращаем стандартное сообщение
  return errorMessage.join(". ") || "";
}
