<script setup>
import { useTaskStore } from "@/stores/tasks";
import TaskCard from "@/components/TaskCard.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed, watch } from "vue";
import draggable from "vuedraggable";
import { useAuthStore } from "@/stores/auth";

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const columns = ["todo", "in_progress", "done"];
const columnNames = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const tasksByStatus = ref({
  todo: [],
  in_progress: [],
  done: [],
});

watch(
  () => tasks.value,
  (newTasks) => {
    tasksByStatus.value = {
      todo: newTasks.filter((task) => task.status === "todo"),
      in_progress: newTasks.filter((task) => task.status === "in_progress"),
      done: newTasks.filter((task) => task.status === "done"),
    };
  },
  { deep: true, immediate: true }
);


onMounted(async () => {
  try {
    await taskStore.fetchTasks();
    // console.log("Tasks fetched:", JSON.stringify(tasks.value, null, 2));
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
});

const newTaskTitle = ref({
  todo: "",
  in_progress: "",
  done: "",
});

const addTask = async (column) => {
  if (newTaskTitle.value[column].trim() !== "") {
    await taskStore.addTask(newTaskTitle.value[column], column);
    newTaskTitle.value[column] = "";
  }
};

const onTaskDrop = async (event) => {
  const task = event.item._underlying_vm_ || event.item.__draggable_context__.element;

  if (task) {
    const destinationColumn = event.to.dataset.column; // Retrieve the correct column

    try {
      console.log(`Task ${task.id} moved to ${destinationColumn}`);

      // Update the task status
      await taskStore.moveTask(task.id, destinationColumn);

      // Update the task locally
      task.status = destinationColumn;

      // Ensure reactivity in Vue
      tasksByStatus.value = { ...tasksByStatus.value };
    } catch (error) {
      console.error("Error moving task:", error);
    }
  }
};

const userName = ref("");

const fetchUserName = async () => {
  try {
    const authStore = useAuthStore();
    await authStore.fetchUserData(); // Fetch user data and store it in Pinia
    
    // Assuming the user data is stored in `authStore.user`
    userName.value = authStore.user?.name || "Guest"; 
  } catch (error) {
    console.error("Error fetching user name:", error);
  }
};

onMounted(() => {
  fetchUserName();
});

const logout = async () => {
  try {
    const authStore = useAuthStore();
    await authStore.logout(); // Call the logout action in the auth store
    userName.value = ""; // Clear the user name
    // Optionally, redirect to the login page or home page
    // router.push({ name: 'login' });
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
</script>

<template>
  <div class="flex flex-col h-screen p-5 bg-gradient-to-r from-blue-500 to-purple-600">
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-100">Mini Kanban Board</h1>
      <div class="flex items-center space-x-4">
        <span class="text-gray-100">Hi {{ userName }}!</span>
        <button 
          class="px-4 py-2 text-white bg-red-500 rounded cursor-pointer hover:bg-red-600"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
    <div class="flex flex-1 gap-4 overflow-x-auto">
      <div 
        v-for="column in columns" 
        :key="column" 
        class="flex flex-col flex-1 min-h-0 p-4 bg-white rounded-lg shadow bg-opacity-80 w-96"
      >
        <h2 class="mb-3 text-lg font-bold text-gray-700">
          {{ columnNames[column] }}
        </h2>

        <draggable 
  v-model="tasksByStatus[column]"
  class="flex-1 space-y-3 overflow-y-auto"
  group="tasks"
  item-key="id"
  @end="onTaskDrop"
  :data-column="column" 
>
  <template #item="{ element }">
    <TaskCard :task="element" />
  </template>
</draggable>

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
