// stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import apiFetch from "../../../shared/services/api";
import { useSnackbarStore } from "../../../stores/snackbar";

import type { User } from "@/features/user/types/user";

interface LoadingStatuses {
  [key: string]: boolean;
}

interface UsersState {
  usersList: User[];
  loadingStatuses: LoadingStatuses;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    usersList: [],
    
    loadingStatuses: {
      addAllowedUser: false,
      removeAllowedUser: false,
      searchUsers: false
    },
  }),
  actions: {
    resetUsers() {
      this.usersList = [];
    },
    async addAllowedUser(eventId: string, addingUserId: string) {
      try {
        this.loadingStatuses.addAllowedUser = true;
        await apiFetch("api/users/add_allowed_user", {
          eventId: eventId,
          addingUserId: addingUserId,
        });
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Пользователь добавлен", "success");
        this.loadingStatuses.addAllowedUser = false;
      } catch (error) {
        this.loadingStatuses.addAllowedUser = false;
        console.error(error);
      }
    },
    async removeAllowedUser(eventId: string, removingUserId: string) {
      try {
        this.loadingStatuses.removeAllowedUser = true;
        await apiFetch("api/users/remove_allowed_user", {
          eventId: eventId,
          removingUserId: removingUserId,
        });
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbar("Пользователь удален", "success");
        this.loadingStatuses.removeAllowedUser = false;
      } catch (error) {
        this.loadingStatuses.removeAllowedUser = false;
        console.error(error);
      }
    },
    async searchUsers(query: string) {
      try {
        this.loadingStatuses.searchUsers = true;
        const res = await apiFetch<User[]>("api/users/search_users", {
            query: query
        });
        this.usersList = res;
        this.loadingStatuses.searchUsers = false;
      } catch (error) {
        this.loadingStatuses.searchUsers = false;
        console.error(error);
      }
    },
  },
});
