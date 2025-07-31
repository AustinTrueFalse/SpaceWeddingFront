import { useSnackbarStore } from "@/stores/snackbar";

export function showSnackbar(message: string, color: string = "info") {
  const snackbar = useSnackbarStore();
  snackbar.showSnackbar(message, color);
}

export function hideSnackbar() {
  const snackbar = useSnackbarStore();
  snackbar.hideSnackbar();
}
