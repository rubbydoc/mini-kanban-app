import { defineStore } from "pinia";
import api from "@/api/axios";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as { id: number; title: string; status: string }[],
  }),

  actions: {
    async fetchTasks() {
      const response = await api.get("/tasks");
      this.tasks = response.data;
    },

    async addTask(title: string) {
      const response = await api.post("/tasks", { title });
      this.tasks.push(response.data);
    },

    async updateTask(id: number, status: string) {
      await api.put(`/tasks/${id}`, { status });
      this.fetchTasks();
    },

    async deleteTask(id: number) {
      await api.delete(`/tasks/${id}`);
      this.tasks = this.tasks.filter((task: any) => task.id !== id);
    },
  },
});
