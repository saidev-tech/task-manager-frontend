<template>
  <div class="task-list">
    <h2>Tasks ({{ tasks.length }})</h2>
    
    <div class="task-filters">
      <button 
        :class="{ active: filter === 'all' }"
        @click="filter = 'all'"
      >
        All ({{ tasks.length }})
      </button>
      <button 
        :class="{ active: filter === 'pending' }"
        @click="filter = 'pending'"
      >
        Pending ({{ pendingCount }})
      </button>
      <button 
        :class="{ active: filter === 'completed' }"
        @click="filter = 'completed'"
      >
        Completed ({{ completedCount }})
      </button>
    </div>
    
    <div class="tasks-container">
      <div v-for="task in filteredTasks" :key="task.id" class="task-wrapper">
        <TaskItem 
          :task="task" 
          @task-updated="$emit('task-updated')" 
          @task-deleted="$emit('task-deleted')" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import TaskItem from './TaskItem.vue';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
});

const filter = ref('all');

const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'pending':
      return props.tasks.filter(task => !task.completed);
    case 'completed':
      return props.tasks.filter(task => task.completed);
    default:
      return props.tasks;
  }
});

const pendingCount = computed(() => props.tasks.filter(task => !task.completed).length);
const completedCount = computed(() => props.tasks.filter(task => task.completed).length);
</script>

<style scoped>
.task-list h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

.task-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

.task-filters button {
  padding: 8px 16px;
  border: 2px solid #e1e8ed;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.task-filters button:hover {
  border-color: #667eea;
  color: #667eea;
}

.task-filters button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-wrapper {
  transition: all 0.3s ease;
}

.task-wrapper:hover {
  transform: translateY(-2px);
}
</style>

