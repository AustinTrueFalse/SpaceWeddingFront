// stores/auth.ts
import { defineStore } from "pinia";

interface Snackbar {
  isVisible: boolean;
  message: string;
  color: string;
}

export const useSnackbarStore = defineStore("snackbar", {
  state: (): Snackbar => ({
    isVisible: false,
    message: "",
    color: "",
  }),

  actions: {
    showSnackbar(message: string, color: string) {
      this.message = message;
      this.color = color;
      this.isVisible = true;

      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    },
    hideSnackbar() {
      this.message = "";
      this.color = "";
      this.isVisible = false;
    },
  },
});
