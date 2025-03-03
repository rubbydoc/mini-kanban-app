<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
      <div class="flex justify-end mb-4">
      
        <button @click="$emit('close')" class="text-gray-500 cursor-pointer hover:text-gray-700 ">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
      </div>
      <div class="mb-4">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-700">Title</label>

        <input 
          type="text" 
          class="w-full p-2 mb-2 text-xl font-bold border border-gray-300 rounded" 
          v-model="editedTitle" 
          :readonly="!isEditing" 
          :class="{ 'bg-gray-100': !isEditing }"
        />
        <label for="description" class="block mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea 
          id="description" 
          rows="4" 
          class="w-full p-2 border border-gray-300 rounded" 
          :readonly="!isEditing" 
          :class="{ 'bg-gray-100': !isEditing }"
          v-model="editedDescription"
        ></textarea>
        <div class="mb-4">
          <label for="status" class="block mb-2 text-sm font-medium text-gray-700">Status</label>
          <select 
            id="status" 
            class="w-full p-2 border border-gray-300 rounded" 
            v-model="editedStatus"
            :disabled="!isEditing"
            :class="{ 'bg-gray-100': !isEditing }"
            @change="saveStatus"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="flex justify-end mt-2">
          <button 
            v-if="!isEditing" 
            @click="isEditing = true" 
            class="px-4 py-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
          >
            Edit
          </button>
          <button 
            v-if="isEditing" 
            @click="saveTask" 
            class="px-4 py-2 text-white bg-green-500 rounded cursor-pointer hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>


    
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import axios from "@/api/axios";
import { useTaskStore } from "@/stores/tasks";

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const taskStore = useTaskStore();
const isEditing = ref(false);
const editedTitle = ref(props.task.title);
const editedDescription = ref(props.task.description);
const editedStatus = ref(props.task.status);
const userName = ref("");

const fetchUserName = async () => {
  try {
    const response = await axios.get(`/users/${props.task.user_id}`);
    userName.value = response.data.name;
  } catch (error) {
    console.error("Error fetching user name:", error);
  }
};

const saveTask = async () => {
  try {
    await taskStore.updateTask(props.task.id, editedTitle.value, editedDescription.value, editedStatus.value);
    isEditing.value = false;
  } catch (error) {
    console.error("Error saving task:", error);
  }
};

const saveStatus = async () => {
  try {
    await taskStore.updateTask(props.task.id, editedTitle.value, editedDescription.value, editedStatus.value);
  } catch (error) {
    console.error("Error saving status:", error);
  }
};

fetchUserName();
</script>
