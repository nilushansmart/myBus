import api from './api';

export const taskApi = {
  /**
   * Fetch all tasks with optional status and priority filters
   * @param {Object} params { status?: string, priority?: string }
   */
  getTasks: (params = {}) => {
    const cleanParams = {};
    if (params.status && params.status !== 'ALL') cleanParams.status = params.status;
    if (params.priority && params.priority !== 'ALL') cleanParams.priority = params.priority;
    return api.get('/tasks', { params: cleanParams });
  },

  /**
   * Get single task by ID
   * @param {number|string} id
   */
  getTaskById: (id) => api.get(`/tasks/${id}`),

  /**
   * Create a new task
   * @param {Object} taskData { title: string, description?: string, status?: string, priority?: string }
   */
  createTask: (taskData) => api.post('/tasks', taskData),

  /**
   * Update an existing task
   * @param {number|string} id
   * @param {Object} taskData
   */
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),

  /**
   * Delete a task by ID
   * @param {number|string} id
   */
  deleteTask: (id) => api.delete(`/tasks/${id}`),

  /**
   * Quickly update task status
   * @param {number|string} id
   * @param {string} status PENDING | IN_PROGRESS | COMPLETED | CANCELLED
   */
  updateTaskStatus: (id, status) =>
    api.patch(`/tasks/${id}/status`, null, { params: { status } }),
};

export default taskApi;
