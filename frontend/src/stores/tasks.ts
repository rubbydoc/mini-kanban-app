import { defineStore } from "pinia";
import api from "@/api/axios";
import { toRaw } from "vue";



export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as { id: number; title: string; status: string }[],
  }),

  actions: {
    async fetchTasks() {
        try {
            const response = await api.get("/tasks/all");
            this.tasks = Array.isArray(response.data) ? response.data : Object.values(response.data);
            
            // Convert Proxy to JSON before returning
            return JSON.parse(JSON.stringify(this.tasks));
          } catch (error) {
            console.error("Error fetching tasks:", error);
            return JSON.stringify({ error: "Failed to fetch tasks" }); // Return error message in JSON format
          }},

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
