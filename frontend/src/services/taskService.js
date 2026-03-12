import axios from 'axios'

const API_BASE_URL = 'http://localhost:8001/api'

const taskService = {
  getAllTasks: async (status = null) => {
    try {
      const params = status ? { status } : {}
      const response = await axios.get(`${API_BASE_URL}/tasks`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  },

  getTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching task:', error)
      throw error
    }
  },

  createTask: async (task) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, task)
      return response.data
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  updateTask: async (id, task) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, task)
      return response.data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },
}

export default taskService
