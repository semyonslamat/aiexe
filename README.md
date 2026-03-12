# Task Management System

A full-stack task management application with a FastAPI backend and React frontend.

## Project Overview

This application allows users to create, read, update, and delete tasks with status tracking. Tasks can be filtered by status (TODO, IN_PROGRESS, DONE) and updated quickly via inline controls.

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.10+ / FastAPI |
| Frontend | React 18 / Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Testing | pytest (backend) |

## Project Structure

```
aiexe/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── models.py         # Pydantic models
│   │   ├── routes.py         # API routes
│   │   └── storage.py        # In-memory storage
│   ├── tests/
│   │   └── test_tasks.py     # Unit tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom hooks
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Running Tests

### Backend Tests

```bash
cd backend
pytest --cov=app tests/
```

## API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Create a new task |
| GET | /api/tasks | List all tasks (optional ?status= filter) |
| GET | /api/tasks/{id} | Get a task by ID |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |

### Task Model

```json
{
  "id": "uuid-string",
  "title": "Task title (required, max 100 chars)",
  "description": "Optional description (max 500 chars)",
  "status": "TODO | IN_PROGRESS | DONE",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Example Requests

**Create Task:**
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My Task", "description": "Task description", "status": "TODO"}'
```

**Get All Tasks:**
```bash
curl http://localhost:8000/api/tasks
```

**Filter by Status:**
```bash
curl http://localhost:8000/api/tasks?status=TODO
```

**Update Task:**
```bash
curl -X PUT http://localhost:8000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "DONE"}'
```

**Delete Task:**
```bash
curl -X DELETE http://localhost:8000/api/tasks/{id}
```

## Features

- Create tasks with title, description, and status
- View all tasks in a list/card format
- Filter tasks by status (All, TODO, IN_PROGRESS, DONE)
- Edit existing tasks
- Quick status updates from the task list
- Delete tasks with confirmation dialog
- Success/error notifications
- Loading indicators
- Responsive design

## License

MIT
