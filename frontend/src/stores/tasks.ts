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
      }
    },

    async addTask(title: string, status: string) {
      try {
        const response = await api.post("/tasks", { title, status });
        this.tasks.push(response.data);
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    },

    async updateTask(id: number, title: string, description: string, status: string) {
      try {
        const response = await api.put(`/tasks/${id}`, { title, description, status });
        const updatedTask = response.data;
        console.log("Updated task:", updatedTask);
    
        // Find the index of the task in the store
        const index = this.tasks.findIndex(task => task.id === id);
    
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...updatedTask }; // Ensure reactivity
          this.tasks = [...this.tasks]; // Trigger reactivity by assigning a new array
        } else {
          console.warn(`Task with ID ${id} not found in the store.`);
        }
        return updatedTask;
    
      } catch (error) {
        console.error("Failed to update task:", error);
        throw error; // Rethrow so the caller can handle it
      }
    },

    async moveTask(id: number, newStatus: string) {
      try {
      const response = await api.patch(`/tasks/${id}/move`, { status: newStatus });
      const updatedTask = response.data;

      // Find the index of the task in the store
      const index = this.tasks.findIndex(task => task.id === id);

      if (index !== -1) {
        this.tasks[index].status = newStatus; // Update the status of the task
        this.tasks = [...this.tasks]; // Trigger reactivity by assigning a new array
      } else {
        console.warn(`Task with ID ${id} not found in the store.`);
      }
      return updatedTask;

      } catch (error) {
      console.error("Failed to move task:", error);
      throw error; // Rethrow so the caller can handle it
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
