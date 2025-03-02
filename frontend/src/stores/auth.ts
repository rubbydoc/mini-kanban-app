import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token") || "",
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                const response = await api.post("/login", { email, password });
                this.token = response.data.access_token;
                localStorage.setItem("token", this.token);
            } catch (error) {
                console.error("Login failed:", error);
                throw new Error("Login failed");
            }
        },

        async logout() {
            try {
                await api.post("/logout", {}, { headers: { Authorization: `Bearer ${this.token}` } });
                localStorage.removeItem("token");
                this.token = "";
            } catch (error) {
                console.error("Logout failed:", error);
                throw new Error("Logout failed");
            }
        },
    },
});
