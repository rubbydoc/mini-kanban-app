<script setup>
import { useTaskStore } from "@/stores/TaskStore";
import TaskCard from "@/components/TaskCard.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const columns = ["todo", "in_progress", "done"];
const columnNames = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

// Handles adding a new task
const newTaskTitle = ref("");
const addTask = (column) => {
  if (newTaskTitle.value.trim() !== "") {
    taskStore.addTask(newTaskTitle.value, column);
    newTaskTitle.value = "";
  }
};
</script>

<template>
  <div class="flex gap-4 p-5 overflow-x-auto">
    <div v-for="column in columns" :key="column" class="p-4 bg-gray-100 rounded-lg shadow w-80">
      <h2 class="mb-3 text-lg font-bold text-gray-700">{{ columnNames[column] }}</h2>

      <!-- Task Cards -->
      <div class="space-y-3">
        <TaskCard v-for="task in tasks.filter(t => t.column === column)" :key="task.id" :task="task" />
      </div>

      <!-- Add Task -->
      <div class="mt-3">
        <input 
          v-model="newTaskTitle" 
          placeholder="Enter task name..." 
          class="w-full p-2 text-sm border border-gray-300 rounded" 
          @keyup.enter="addTask(column)" 
        />
        <button 
          class="w-full py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          @click="addTask(column)">
          + Add a card
        </button>
      </div>
    </div>
  </div>
</template>
