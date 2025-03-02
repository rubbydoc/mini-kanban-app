<script setup>
import { defineProps } from "vue";

const props = defineProps(["task"]);
</script>

<template>
  <div class="p-3 bg-white border-l-4 border-blue-400 rounded-lg shadow cursor-pointer">
    <p class="font-medium text-gray-800">{{ task.title }}</p>
  </div>
</template>
