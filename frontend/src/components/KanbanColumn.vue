<template>
  <div class="p-3 bg-gray-200 rounded">
    <h2 class="mb-3 text-lg font-bold">{{ column.replace('_', ' ').toUpperCase() }}</h2>
    <div v-for="task in tasks" :key="task.id">
      <TaskCard :task="task" />
    </div>
  </div>
</template>

<script setup>
import TaskCard from "@/components/TaskCard.vue";
import { PropType } from "vue";

defineProps({
  column: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    validator: (value) => true,
    required: true
  }
});
</script>
