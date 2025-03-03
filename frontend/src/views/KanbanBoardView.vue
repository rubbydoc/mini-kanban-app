<script setup>
import { useTaskStore } from "@/stores/tasks";
import TaskCard from "@/components/TaskCard.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed, watch } from "vue";
import draggable from "vuedraggable";

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
  { immediate: true }
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




</script>

<template>
  <div class="flex flex-col h-screen p-5 bg-gray-50">
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-700">Mini Kanban Board</h1>
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
