<template>
  <div class="task-form">
    <h2>Add New Task</h2>
    <form @submit.prevent="addTask">
      <div class="form-group">
        <label for="title">Title *</label>
        <input 
          id="title"
          v-model="title" 
          type="text"
          placeholder="Enter task title..." 
          required 
          class="form-input"
        />
      </div>
      
      <div class="form-group">
        <label for="description">Description *</label>
        <textarea 
          id="description"
          v-model="description" 
          placeholder="Enter task description..." 
          required 
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="completed" />
          <span class="checkmark"></span>
          Mark as completed
        </label>
      </div>
      
      <button type="submit" class="submit-button" :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Task' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { taskApi } from '../api.js';
import { defineEmits } from 'vue';

const emit = defineEmits(['task-added']);
const title = ref('');
const description = ref('');
const completed = ref(false);
const loading = ref(false);

const addTask = async () => {
  loading.value = true;
  
  try {
    await taskApi.createTask({
      title: title.value,
      description: description.value,
      completed: completed.value
    });
    
    // Reset form
    title.value = '';
    description.value = '';
    completed.value = false;
    
    emit('task-added');
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Failed to add task. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.task-form h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.submit-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

