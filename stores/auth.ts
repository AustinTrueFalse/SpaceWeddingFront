// stores/auth.ts
import { defineStore } from "pinia";
import apiFetch from "../api";
import { useSnackbarStore } from "../stores/snackbar";
import { getErrorMessage } from "../helpers/errorHandler";

import type { SignInData, RegisterData } from "../types/auth";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface AuthState {
  authChecked: boolean;
  user: string;
  error: string;
  isUserNameValid: boolean;
  isAccountConfirmed: boolean | null;
  isConfirmed: boolean | null;
  isEmailSended: boolean;
  emailForSend: string;
  loadingStatuses: LoadingStatuses;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    authChecked: false,
    user: "",
    error: "",
    isUserNameValid: true,
    isAccountConfirmed: null,
    isConfirmed: null,
    isEmailSended: false,
    emailForSend: "",
    loadingStatuses: {
      signInCookieStatus: true,
      signInStatus: false,
      registerStatus: false,
      verifyEmailStatus: false,
      resendEmailStatus: false,
      checkUserName: false,
    },
  }),

  actions: {
    async signInCookie() {
      try {
        this.loadingStatuses.signInStatus = true;

        const res = await apiFetch<{
          user: string;
          is_account_confirmed: boolean;
        }>("/auth/signin_cookie");

        this.user = res.user;
        this.isAccountConfirmed = res.is_account_confirmed;
        this.error = "";
        this.loadingStatuses.signInStatus = false;
        this.isConfirmed = false;

        // Сохраняем пользователя в localStorage
        if (this.user) {
          localStorage.setItem("user", JSON.stringify(this.user));
        }
      } catch (error: any) {
        this.user = "";
        this.isAccountConfirmed = false;
        this.loadingStatuses.signInStatus = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar(getErrorMessage(error), "error");
        localStorage.removeItem("user");
        console.error(error);
      }
    },
    async signIn(user: SignInData) {
      try {
        this.loadingStatuses.signInStatus = true;

        const res = await apiFetch<{
          user: string;
          is_account_confirmed: boolean;
        }>("/auth/signin", {
          email: user.email,
          password: user.password,
        });

        console.log(res.is_account_confirmed);

        this.user = res.user;
        this.isAccountConfirmed = res.is_account_confirmed;
        this.error = "";
        this.loadingStatuses.signInStatus = false;
        this.isConfirmed = false;
        // Сохраняем пользователя в localStorage
        if (this.user) {
          localStorage.setItem("user", JSON.stringify(this.user));
        }
      } catch (error: any) {
        this.user = "";
        this.isAccountConfirmed = false;
        this.loadingStatuses.signInStatus = false;

        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar(getErrorMessage(error), "error");
        localStorage.removeItem("user");
        console.error(error);
      }
    },

    async register(user: RegisterData) {
      try {
        this.loadingStatuses.registerStatus = true;

        const res = await apiFetch<{ user: string }>("/auth/register", {
          email: user.email,
          password: user.password,
          username: user.username,
        });

        this.user = res.user;
        this.error = "";
        this.isEmailSended = true;
        this.emailForSend = user.email;

        this.loadingStatuses.registerStatus = false;
      } catch (error: any) {
        this.loadingStatuses.registerStatus = false;
        this.isEmailSended = false;
        console.error(error.response._data.error.message);
      }
    },

    async resendEmailVerify() {
      try {
        this.loadingStatuses.resendEmailStatus = true;

        await apiFetch<{ user: string }>("/auth/resend_email_verify");

        this.isEmailSended = true;

        this.loadingStatuses.resendEmailStatus = false;
      } catch (error: any) {
        this.loadingStatuses.resendEmailStatus = false;
        console.error(error);
      }
    },

    async confirm(oobCode: string) {
      try {
        this.loadingStatuses.verifyEmailStatus = true;
        // Передаём oobCode в теле запроса
        await apiFetch("/auth/confirm", { oobCode });

        this.isConfirmed = true; // Успех
        this.error = "";
        this.loadingStatuses.verifyEmailStatus = false;
      } catch (error: any) {
        this.loadingStatuses.verifyEmailStatus = false;
        this.isConfirmed = false; // Ошибка
        console.error(error);
      }
    },

    async checkUsername(username: string) {
      try {
        this.loadingStatuses.checkUserName = true;

        const res = await apiFetch<{ available: boolean }>(
          "/auth/check_username",
          { username }
        );

        this.isUserNameValid = res.available;
        this.loadingStatuses.checkUserName = false;
      } catch (error: any) {
        this.loadingStatuses.checkUserName = false;
        console.error(error);
      }
    },

    async signOut() {
      await apiFetch("/auth/signout");
      this.user = "";
      this.isAccountConfirmed = false;
      
      localStorage.removeItem("user");
    },
  },
});
