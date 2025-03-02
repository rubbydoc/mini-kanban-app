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
      console.log(this.tasks);
    },

    async addTask(title: string, status: string) {
      try {
        const response = await api.post("/tasks", { title, status });
        this.tasks.push(response.data);
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    },

    async updateTask(id: number, title: string, status: string) {
      try {
        await api.put(`/tasks/${id}`, { title, status });
        this.fetchTasks();
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    },

    async deleteTask(id: number) {
      try {
        await api.delete(`/tasks/${id}`);
        this.tasks = this.tasks.filter((task: any) => task.id !== id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
  },
});
