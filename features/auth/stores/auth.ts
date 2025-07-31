// stores/auth.ts
import { defineStore } from "pinia";
import apiFetch from "../../../shared/services/api";
import { useSnackbarStore } from "../../../stores/snackbar";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase.client";

import type { SignInData, RegisterData } from "../types/auth";
import type PasswordReset from "@/components/auth/PasswordReset.vue";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface AuthState {
  authChecked: boolean;
  user: string;
  userNameOriginal: string;
  userNameCurrent: string;
  error: string;
  isUserNameValid: boolean;
  isAccountConfirmed: boolean | null;
  isConfirmed: boolean | null;
  isEmailSended: boolean;
  emailForSend: string;
  loadingStatuses: LoadingStatuses;
}

interface UserInfo {
  user: string;
  username: string;
  is_account_confirmed: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    authChecked: false,
    user: "",
    userNameOriginal: "",
    userNameCurrent: "",
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
      changeAvatar: false,
      sendEmailPasswordReset: false,
      passwordReset: false,
      updateUserName: false,
    },
  }),

  actions: {
    resetUserName() {
      this.userNameCurrent = this.userNameOriginal;
    },
    setUser(res: UserInfo) {
      if (res) {
        this.user = res.user;
        this.userNameCurrent = res.username;
        this.userNameOriginal = res.username;
        this.isAccountConfirmed = res.is_account_confirmed;
        this.error = "";
        this.loadingStatuses.signInStatus = false;
        this.isConfirmed = false;

        // Сохраняем пользователя в localStorage
        if (this.user) {
          localStorage.setItem("user", JSON.stringify(this.user));
        }
      } else {
      }
    },
    resetUser() {
      this.user = "";
      this.userNameCurrent = "";
      this.userNameOriginal = "";
      this.isAccountConfirmed = false;
      localStorage.removeItem("user");
    },
    async checkUser() {
      try {
        this.loadingStatuses.signInStatus = true;

        const res = await apiFetch<UserInfo>("/auth/check_user");
        this.setUser(res);
        this.loadingStatuses.signInStatus = false;
      } catch (error: any) {
        this.resetUser();
        this.loadingStatuses.signInStatus = false;
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar(getErrorMessage(error), "error");
        console.error(error);
      }
    },
    async signInCookie() {
      try {
        this.loadingStatuses.signInStatus = true;

        const res = await apiFetch<{
          user: string;
          username: string;
          is_account_confirmed: boolean;
        }>("/auth/signin_cookie", undefined, false);

        this.setUser(res);

        this.loadingStatuses.signInStatus = false;
      } catch (error: any) {
        this.resetUser();
        this.loadingStatuses.signInStatus = false;
        const snackbarStore = useSnackbarStore();
        // snackbarStore.showSnackbar(getErrorMessage(error), "error");
        console.error(error);
      }
    },
    async signIn(user: SignInData) {
      try {
        this.loadingStatuses.signInStatus = true;

        const res = await apiFetch<{
          user: string;
          username: string;
          is_account_confirmed: boolean;
        }>("/auth/signin", {
          email: user.email,
          password: user.password,
        });

        this.setUser(res);
        this.loadingStatuses.signInStatus = false;
      } catch (error: any) {
        this.resetUser();
        this.loadingStatuses.signInStatus = false;

        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar(getErrorMessage(error), "error");

        console.error(error);
        throw error;
      }
    },
    async signInWithGoogle() {
      try {
        this.loadingStatuses.signInStatus = true;

        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        const refreshToken = result.user.refreshToken;

        const res = await apiFetch<{
          user: string;
          username: string;
          is_account_confirmed: boolean;
        }>("/auth/google", { idToken, refreshToken });

        this.setUser(res);

        this.signInCookie();
        this.loadingStatuses.signInStatus = false;
      } catch (error: any) {
        this.resetUser();
        this.loadingStatuses.signInStatus = false;

        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar(getErrorMessage(error), "error");

        console.error(error);
        throw error;
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
    async sendEmailPasswordReset(email: string) {
      const snackbarStore = useSnackbarStore();
      try {
        this.loadingStatuses.sendEmailPasswordReset = true;
        // Передаём email в теле запроса
        await apiFetch("/auth/send_email_password_reset", { email });

        this.loadingStatuses.sendEmailPasswordReset = false;
        snackbarStore.showSnackbar("Письмо отправлено", "success");
      } catch (error: any) {
        this.loadingStatuses.sendEmailPasswordReset = false;
        snackbarStore.showSnackbar("Ошибка отправки письма", "error");
        console.error(error);
        throw new Error(error);
      }
    },
    async passwordReset(oobCode: string, newPassword: string) {
      const snackbarStore = useSnackbarStore();
      try {
        this.loadingStatuses.passwordReset = true;
        // Передаём oobCode в теле запроса
        await apiFetch("/auth/reset_password", { oobCode, newPassword });

        this.loadingStatuses.passwordReset = false;
        snackbarStore.showSnackbar("Новый пароль установлен", "success");
      } catch (error: any) {
        this.loadingStatuses.passwordReset = false;
        snackbarStore.showSnackbar("Ошибка сброса пароля", "success");
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
    async updateUsername(username: string) {
      try {
        this.loadingStatuses.updateUserName = true;

        const res = await apiFetch<{ available: boolean }>(
          "/auth/update_username",
          { username, userId: this.user }
        );

        this.isUserNameValid = res.available;
        this.loadingStatuses.updateUserName = false;
      } catch (error: any) {
        this.loadingStatuses.updateUserName = false;
        console.error(error);
      }
    },
    async signOut() {
      await apiFetch("/auth/signout");
      this.resetUser();

      localStorage.removeItem("user");
    },
  },
});
