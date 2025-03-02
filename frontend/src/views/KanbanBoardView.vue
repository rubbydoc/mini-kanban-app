<script setup>
import { useTaskStore } from "@/stores/tasks";
import TaskCard from "@/components/TaskCard.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore); // Reactive tasks from store

// **Ensure consistency in keys**
const columns = ["todo", "in_progress", "done"];
const columnNames = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

// **Computed property to filter tasks by status**
const tasksByStatus = computed(() => {
  return {
    todo: tasks.value.filter((task) => task.status === "todo"),
    in_progress: tasks.value.filter((task) => task.status === "in_progress"),
    done: tasks.value.filter((task) => task.status === "done"),
  };
});

// Fetch tasks when the component is mounted
onMounted(async () => {
  try {
    await taskStore.fetchTasks();
    console.log("Tasks fetched:", JSON.stringify(tasks.value, null, 2));
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
});

// **Fix: Use an object to store task titles per column**
const newTaskTitle = ref({
  todo: "",
  in_progress: "",
  done: "",
});

// **Fix: Ensure tasks are added to the correct status**
const addTask = async (column) => {
  if (newTaskTitle.value[column].trim() !== "") {
    await taskStore.addTask(newTaskTitle.value[column], column);
    newTaskTitle.value[column] = ""; // Clear input after adding
  }
};
</script>

<template>
  <div class="flex flex-col h-screen p-5 bg-gray-50">
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-700">Kanban Board</h1>
    </div>
    <div class="flex flex-1 gap-4 overflow-x-auto">
      <div 
        v-for="column in columns" 
        :key="column" 
        class="flex flex-col flex-1 min-h-0 p-4 bg-gray-100 rounded-lg shadow w-96"
      >
        <h2 class="mb-3 text-lg font-bold text-gray-700">
          {{ columnNames[column] }}
        </h2>

        <!-- Task Cards -->
        <div class="flex-1 space-y-3 overflow-y-auto">
          <TaskCard 
            v-for="task in tasksByStatus[column]" 
            :key="task.id" 
            :task="task" 
          />
        </div>

        <!-- Add Task -->
        <div class="mt-3">
          <input 
            v-model="newTaskTitle[column]" 
            placeholder="Enter a title..." 
            class="w-full p-2 text-sm border border-gray-300 rounded" 
            @keyup.enter="addTask(column)" 
          />
          <button 
            class="w-full py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            @click="() => addTask(column)"
          >
            + Add a card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}

.flex-1 {
  min-height: 0;
}


</style>
