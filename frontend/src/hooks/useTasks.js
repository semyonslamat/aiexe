import { useState, useEffect, useCallback } from 'react'

// Mock data for initial state
const MOCK_TASKS = [
  {
    id: '1',
    title: 'Build React frontend',
    description: 'Create a responsive task management interface',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Set up Tailwind CSS',
    description: 'Configure Tailwind for styling',
    status: 'DONE',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Create API endpoints',
    description: 'Build backend REST API',
    status: 'TODO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Write unit tests',
    description: 'Test all components',
    status: 'TODO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const useTasks = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const [filteredTasks, setFilteredTasks] = useState(MOCK_TASKS)
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextId, setNextId] = useState(5)

  // Filter tasks based on current filter
  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === filter))
    }
  }, [tasks, filter])

  // Simulate API call
  const simulateApiCall = useCallback(async (callback) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      callback()
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTasks = useCallback(async () => {
    await simulateApiCall(() => {
      // Tasks are already set from mock data
    })
  }, [simulateApiCall])

  const createTask = useCallback(
    async (taskData) => {
      return await simulateApiCall(() => {
        const newTask = {
          id: String(nextId),
          ...taskData,
          status: taskData.status || 'TODO',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setTasks((prevTasks) => [newTask, ...prevTasks])
        setNextId((prev) => prev + 1)
        return newTask
      })
    },
    [simulateApiCall, nextId]
  )

  const updateTask = useCallback(
    async (id, taskData) => {
      return await simulateApiCall(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...taskData,
                  updatedAt: new Date().toISOString(),
                }
              : task
          )
        )
      })
    },
    [simulateApiCall]
  )

  const deleteTask = useCallback(
    async (id) => {
      return await simulateApiCall(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
      })
    },
    [simulateApiCall]
  )

  const updateTaskStatus = useCallback(
    async (id, status) => {
      return await updateTask(id, { status })
    },
    [updateTask]
  )

  const setStatusFilter = useCallback((status) => {
    setFilter(status)
  }, [])

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    filter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setStatusFilter,
  }
}
