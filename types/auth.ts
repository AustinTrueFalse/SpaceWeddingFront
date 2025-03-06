
// Интерфейс для данных авторизации
export interface SignInData {
  email: string;
  password: string;
}

// Интерфейс для данных регистрации, наследует LoginData
export interface RegisterData extends SignInData {
  username: string;
}


