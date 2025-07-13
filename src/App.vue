<template>
  <div class="app">
    <header class="app-header">
      <h1>✓ My Todo App</h1>
      <p>Stay organized and get things done!</p>
    </header>
    
    <main class="app-main">
      <div class="task-form-container">
        <TaskForm @task-added="fetchTasks" />
      </div>
      
      <div class="task-list-container">
        <div v-if="loading" class="loading">Loading tasks...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="tasks.length === 0" class="empty-state">
          <p>No tasks yet. Create your first task above!</p>
        </div>
        <TaskList v-else :tasks="tasks" @task-updated="fetchTasks" @task-deleted="fetchTasks" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { taskApi } from './api.js';
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';

const tasks = ref([]);
const loading = ref(false);
const error = ref('');

const fetchTasks = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const res = await taskApi.getTasks();
    tasks.value = res.data;
  } catch (err) {
    error.value = 'Failed to fetch tasks. Please check if your backend is running.';
    console.error('Error fetching tasks:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTasks);
</script>

<style>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.app-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
}

.task-form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.task-list-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.error {
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  background: #fdf2f2;
  border-radius: 8px;
  border: 1px solid #fadbd8;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state p {
  font-size: 1.1rem;
}
</style>

