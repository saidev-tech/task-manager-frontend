<template>
  <div class="task-item" :class="{ completed: task.completed }">
    <div class="task-content">
      <div class="task-header">
        <div class="task-title-section">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-status">
            <span :class="{ 'status-completed': task.completed, 'status-pending': !task.completed }">
              {{ task.completed ? 'Completed' : 'Pending' }}
            </span>
          </div>
        </div>
        <div class="task-actions">
          <button 
            @click="toggleComplete" 
            :class="{ 'complete-btn': !task.completed, 'undo-btn': task.completed }"
            :disabled="loading"
          >
            {{ task.completed ? '↶ Undo' : '✓ Complete' }}
          </button>
          <button @click="toggleEditMode" class="edit-btn" :disabled="loading">
            {{ editMode ? 'Cancel' : 'Edit' }}
          </button>
          <button @click="deleteTask" class="delete-btn" :disabled="loading">
            🗑️ Delete
          </button>
        </div>
      </div>
      
      <div v-if="!editMode" class="task-description">
        <p>{{ task.description }}</p>
      </div>
      
      <div v-if="editMode" class="edit-form">
        <form @submit.prevent="updateTask">
          <div class="form-group">
            <label>Title</label>
            <input 
              v-model="editTitle" 
              type="text"
              placeholder="Task title" 
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="editDescription" 
              placeholder="Task description" 
              required
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="editCompleted" />
              <span class="checkmark"></span>
              Mark as completed
            </label>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" @click="cancelEdit" class="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { taskApi } from '../api.js';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({ 
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['task-updated', 'task-deleted']);

const editMode = ref(false);
const loading = ref(false);
const editTitle = ref(props.task.title);
const editDescription = ref(props.task.description);
const editCompleted = ref(props.task.completed);

// Reset form when task changes
watch(() => props.task, (newTask) => {
  editTitle.value = newTask.title;
  editDescription.value = newTask.description;
  editCompleted.value = newTask.completed;
}, { immediate: true });

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    // Reset form if canceling
    editTitle.value = props.task.title;
    editDescription.value = props.task.description;
    editCompleted.value = props.task.completed;
  }
};

const cancelEdit = () => {
  editMode.value = false;
  editTitle.value = props.task.title;
  editDescription.value = props.task.description;
  editCompleted.value = props.task.completed;
};

const updateTask = async () => {
  loading.value = true;
  
  try {
    await taskApi.updateTask(props.task.id, {
      title: editTitle.value,
      description: editDescription.value,
      completed: editCompleted.value
    });
    
    editMode.value = false;
    emit('task-updated');
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Failed to update task. Please try again.');
  } finally {
    loading.value = false;
  }
};

const toggleComplete = async () => {
  loading.value = true;
  
  try {
    await taskApi.updateTask(props.task.id, {
      title: props.task.title,
      description: props.task.description,
      completed: !props.task.completed
    });
    
    emit('task-updated');
  } catch (error) {
    console.error('Error toggling task completion:', error);
    alert('Failed to update task. Please try again.');
  } finally {
    loading.value = false;
  }
};

const deleteTask = async () => {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  loading.value = true;
  
  try {
    await taskApi.deleteTask(props.task.id);
    emit('task-deleted');
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.task-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.task-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.task-item.completed {
  background: #f8f9fa;
  border-color: #28a745;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #6c757d;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.task-title-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 15px;
  gap: 12px;
}

.task-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.status-completed {
  background: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.task-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.task-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.complete-btn {
  background: #28a745;
  color: white;
}

.complete-btn:hover:not(:disabled) {
  background: #218838;
}

.undo-btn {
  background: #ffc107;
  color: #212529;
}

.undo-btn:hover:not(:disabled) {
  background: #e0a800;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
}

.task-description {
  margin-bottom: 15px;
}

.task-description p {
  color: #555;
  line-height: 1.5;
  margin: 0;
}

.edit-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 15px;
  border: 1px solid #dee2e6;
}

.form-group {
  margin-bottom: 15px;
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
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
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.save-btn {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.save-btn:hover:not(:disabled) {
  background: #218838;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn:hover {
  background: #5a6268;
}
</style>

