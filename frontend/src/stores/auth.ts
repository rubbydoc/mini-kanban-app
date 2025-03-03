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
            window.location.href = "/login"; // Redirect to login page
            } catch (error) {
            console.error("Logout failed:", error);
            throw new Error("Logout failed");
            }
        },

        async register(name:string, email: string, password: string, password_confirmation: string) {
            if (password !== password_confirmation) {
            throw new Error("Passwords do not match");
            }
            try {
            const response = await api.post("/register", { name, email, password, password_confirmation });
            this.token = response.data.access_token;
            localStorage.setItem("token", this.token);
            } catch (error) {
            console.error("Registration failed:", error);
            throw new Error("Registration failed");
            }
        },

        async fetchUserData() {
            try {
            const response = await api.get("/user", { headers: { Authorization: `Bearer ${this.token}` } });
            this.user = response.data;
            } catch (error) {
            console.error("Fetching user data failed:", error);
            throw new Error("Fetching user data failed");
            }
        }
    },
});
