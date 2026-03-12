import { useState, useEffect } from 'react'

export const TaskForm = ({ onSubmit, initialTask = null, loading = false }) => {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [status, setStatus] = useState(initialTask?.status || 'TODO')
  const [errors, setErrors] = useState({})

  // Update form fields when initialTask changes (for edit mode)
  useEffect(() => {
    setTitle(initialTask?.title || '')
    setDescription(initialTask?.description || '')
    setStatus(initialTask?.status || 'TODO')
    setErrors({})
  }, [initialTask])

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
      })
      setTitle('')
      setDescription('')
      setStatus('TODO')
      setErrors({})
    } catch (error) {
      setErrors({ submit: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {initialTask ? 'Edit Task' : 'Create New Task'}
      </h2>

      {errors.submit && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) setErrors({ ...errors, title: '' })
            }}
            placeholder="Enter task title"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.title && (
            <p className="text-red-600 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            disabled={loading}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </form>
  )
}
