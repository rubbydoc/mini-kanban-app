<script setup>
import { useTaskStore } from "@/stores/tasks";
import { defineProps, ref } from "vue";
import TaskModal from "@/components/TaskModal.vue";

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const taskStore = useTaskStore();
const isModalOpen = ref(false);

const deleteTask = async () => {
  await taskStore.deleteTask(props.task.id);
};

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<template>
  <div>
    <div 
      class="p-3 mb-2 bg-white border-l-4 border-blue-400 rounded-lg shadow cursor-pointer"
      @click="openModal"
    >
      <p class="font-medium text-gray-800">{{ task.title }}</p>
      <div class="flex justify-end mt-2">
        <button 
          class="text-red-500 cursor-pointer hover:text-red-600"
          @click.stop="deleteTask"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M9 6v12m6-12v12M4 6h16l-1 14H5L4 6z" />
          </svg>
        </button>
      </div>
    </div>
    <TaskModal v-if="isModalOpen" :task="task" @close="isModalOpen = false" />
  </div>
</template>
