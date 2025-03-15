import { defineStore } from "pinia";

interface Dialog {
  isVisible: boolean;
  type: string;
}

export const useDialogStore = defineStore("dialog", {
  state: (): Dialog => ({
    isVisible: false,
    type: "",
  }),

  actions: {
    showDialog(type: string) {
      this.isVisible = true;

      if (type) {
        this.type = type;
      }
    },
    hideDialog() {
      console.log(
        "Вызвался хайд"
      )
      this.isVisible = false;
    },
  },
});
