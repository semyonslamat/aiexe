import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { StatusFilter } from './components/StatusFilter'
import { Toast } from './components/Toast'
import { ConfirmDialog } from './components/ConfirmDialog'
import { useTasks } from './hooks/useTasks'
import { useNotification } from './hooks/useNotification'
import './App.css'

function App() {
  const {
    tasks,
    loading,
    error,
    filter,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setStatusFilter,
    fetchTasks,
  } = useTasks()

  const { notification, showNotification, hideNotification } = useNotification()

  const [editingTask, setEditingTask] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData)
      showNotification('Task created successfully!', 'success')
    } catch (err) {
      showNotification(
        err.message || 'Failed to create task',
        'error'
      )
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData)
      setEditingTask(null)
      showNotification('Task updated successfully!', 'success')
    } catch (err) {
      showNotification(
        err.message || 'Failed to update task',
        'error'
      )
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus)
      showNotification('Task status updated!', 'success')
    } catch (err) {
      showNotification(
        err.message || 'Failed to update task status',
        'error'
      )
    }
  }

  const handleDeleteClick = (taskId) => {
    setDeleteConfirm(taskId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    setIsDeleting(true)
    try {
      await deleteTask(deleteConfirm)
      showNotification('Task deleted successfully!', 'success')
      setDeleteConfirm(null)
    } catch (err) {
      showNotification(
        err.message || 'Failed to delete task',
        'error'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <div className="mb-8">
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            initialTask={editingTask}
            loading={loading}
          />
          {editingTask && (
            <button
              onClick={() => setEditingTask(null)}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              Cancel editing
            </button>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Filter Tasks</h2>
          <StatusFilter currentFilter={filter} onFilterChange={setStatusFilter} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            {filter === 'ALL'
              ? `All Tasks (${tasks.length})`
              : `${filter === 'IN_PROGRESS' ? 'In Progress' : filter} Tasks (${tasks.length})`}
          </h2>
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
            loading={loading}
          />
        </div>
      </main>

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeleting}
      />
    </div>
  )
}

export default App
