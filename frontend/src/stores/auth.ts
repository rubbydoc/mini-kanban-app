import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || "",
  }),

  actions: {
    async login(email: string, password: string) {
      const response = await api.post("/login", { email, password });
      this.token = response.data.token;
      localStorage.setItem("token", this.token);
    },

    async logout() {
      await api.post("/logout", {}, { headers: { Authorization: `Bearer ${this.token}` } });
      localStorage.removeItem("token");
      this.token = "";
    },
  },
});
