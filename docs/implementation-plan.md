# Task Management System - Implementation Plan

**Source Document**: [SRS - Task Management System](https://pdc-amat-prod.atlassian.net/wiki/spaces/GENAI/pages/952303813/SRS+-+Task+Management+System)
**Created**: 2026-03-12
**Status**: Draft

---

## 1. Executive Summary

### 1.1 Project Overview

This plan outlines the implementation of a Task Management System consisting of:
- **Backend API**: RESTful service using FastAPI (Python) for task CRUD operations
- **Frontend UI**: React-based single-page application for task management

### 1.2 Technology Stack Selection

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Backend | Python 3.10+ / FastAPI | Rapid development, built-in validation with Pydantic, excellent documentation |
| Frontend | React 18+ / Vite | Modern tooling, fast HMR, better DX than CRA |
| Styling | Tailwind CSS | Utility-first, rapid UI development |
| HTTP Client | Axios | Promise-based, interceptors for error handling |
| Testing | pytest (backend), Jest/RTL (frontend) | Industry standard, good coverage tools |
| Storage | In-memory (Python dict) | Simplicity per SRS requirements |

### 1.3 Estimated Structure

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
├── docs/
│   └── implementation-plan.md
└── README.md
```

---

## 2. Backend Implementation Plan

### 2.1 Data Model (FR-1)

- [ ] Create `Task` Pydantic model with fields:
  - `id`: str (UUID, auto-generated)
  - `title`: str (required, max 100 chars)
  - `description`: Optional[str] (max 500 chars)
  - `status`: Enum (TODO, IN_PROGRESS, DONE)
  - `createdAt`: datetime (auto-generated)
  - `updatedAt`: datetime (auto-updated)

- [ ] Create request/response schemas:
  - `TaskCreate` (input for POST)
  - `TaskUpdate` (input for PUT)
  - `TaskResponse` (output)

### 2.2 Storage Layer

- [ ] Implement in-memory storage class with:
  - `tasks: Dict[str, Task]`
  - Thread-safe operations (if needed)
  - Methods: `create()`, `get_all()`, `get_by_id()`, `update()`, `delete()`

### 2.3 API Endpoints

- [ ] **FR-2**: `POST /api/tasks` - Create task
  - Validate title (required, non-empty)
  - Validate status enum
  - Return 201 with created task

- [ ] **FR-3**: `GET /api/tasks` - List all tasks
  - Optional query param `?status=` for filtering
  - Return 200 with task array

- [ ] **FR-4**: `GET /api/tasks/{id}` - Get task by ID
  - Return 200 with task
  - Return 404 if not found

- [ ] **FR-5**: `PUT /api/tasks/{id}` - Update task
  - Validate inputs
  - Update `updatedAt` timestamp
  - Return 200 with updated task
  - Return 404 if not found

- [ ] **FR-6**: `DELETE /api/tasks/{id}` - Delete task
  - Return 204 No Content
  - Return 404 if not found

### 2.4 CORS Configuration (FR-7)

- [ ] Configure CORS middleware to allow:
  - Origin: `http://localhost:3000` and `http://localhost:5173` (Vite default)
  - Methods: GET, POST, PUT, DELETE
  - Headers: Content-Type

### 2.5 Error Handling

- [ ] Implement global exception handler
- [ ] Return consistent error response format:
  ```json
  {
    "detail": "Error message",
    "code": "ERROR_CODE"
  }
  ```

### 2.6 Unit Tests (NFR-4)

- [ ] Test 1: Task creation with valid data
- [ ] Test 2: Task retrieval by ID (success and 404)
- [ ] Test 3: Task update functionality
- [ ] Additional tests for 70%+ coverage:
  - [ ] Test status filtering
  - [ ] Test validation errors
  - [ ] Test delete operation

---

## 3. Frontend Implementation Plan

### 3.1 Project Setup

- [ ] Initialize Vite + React project
- [ ] Install dependencies:
  - axios
  - tailwindcss, postcss, autoprefixer
- [ ] Configure Tailwind CSS
- [ ] Set up project structure

### 3.2 API Service Layer

- [ ] Create `api/taskService.js`:
  - `getAllTasks(status?)`
  - `getTaskById(id)`
  - `createTask(task)`
  - `updateTask(id, task)`
  - `deleteTask(id)`
- [ ] Configure axios instance with base URL
- [ ] Implement error interceptor

### 3.3 Components

#### 3.3.1 Layout Components
- [ ] `Header` - App title and branding
- [ ] `Layout` - Main layout wrapper

#### 3.3.2 Task List (FR-8)
- [ ] `TaskList` - Container for task items
  - Display tasks in list/card format
  - Show title, status, creation date
  - Edit and Delete action buttons
  - Empty state message

- [ ] `TaskItem` - Individual task card
  - Task information display
  - Status badge with color coding
  - Action buttons

#### 3.3.3 Status Filter (FR-8)
- [ ] `StatusFilter` - Filter tabs/buttons
  - All, TODO, IN_PROGRESS, DONE options
  - Visual indication of active filter

#### 3.3.4 Task Form (FR-9, FR-10)
- [ ] `TaskForm` - Create/Edit form component
  - Title input (required)
  - Description textarea (optional)
  - Status dropdown
  - Client-side validation
  - Submit and Cancel buttons
  - Loading state during submission

#### 3.3.5 Quick Status Update (FR-12)
- [ ] `StatusDropdown` - Inline status selector
  - Dropdown in task list
  - Immediate API call on change

#### 3.3.6 Feedback Components (FR-13)
- [ ] `LoadingSpinner` - Loading indicator
- [ ] `Toast` / `Notification` - Success/error messages
- [ ] `ConfirmDialog` - Delete confirmation (FR-11)

### 3.4 Custom Hooks

- [ ] `useTasks` - Task state management
  - Fetch tasks
  - CRUD operations
  - Loading/error states
  - Filter state

- [ ] `useNotification` - Toast notifications
  - Show success/error messages
  - Auto-dismiss

### 3.5 State Management

- [ ] Use React hooks (useState, useEffect)
- [ ] Lift state to App component or use context if needed
- [ ] Optimistic updates for better UX (optional)

### 3.6 Error Handling (FR-13)

- [ ] Display user-friendly error messages
- [ ] Handle network errors gracefully
- [ ] Show validation feedback inline
- [ ] Loading indicators for all API operations

---

## 4. Integration Plan

### 4.1 Development Setup

- [ ] Backend runs on `http://localhost:8000`
- [ ] Frontend runs on `http://localhost:5173`
- [ ] CORS configured for cross-origin requests

### 4.2 Integration Testing Checklist

- [ ] Create task from UI -> verify in API response
- [ ] List tasks -> verify all displayed correctly
- [ ] Edit task -> verify changes persisted
- [ ] Delete task -> verify removal
- [ ] Status filter -> verify correct filtering
- [ ] Quick status update -> verify immediate reflection
- [ ] Error scenarios -> verify user feedback

### 4.3 End-to-End Verification

- [ ] Complete user flow: Create -> View -> Edit -> Status Change -> Delete
- [ ] Verify no console errors during normal usage
- [ ] Test with empty state (no tasks)
- [ ] Test with multiple tasks

---

## 5. Parallel Execution Opportunities

### 5.1 Independent Workstreams

The following tasks can be executed in parallel by sub-agents:

#### Stream A: Backend Core (Agent 1)
```
Priority: HIGH
Dependencies: None
Tasks:
- Set up FastAPI project structure
- Implement Pydantic models
- Implement storage layer
- Create API routes
- Configure CORS
```

#### Stream B: Backend Testing (Agent 2)
```
Priority: MEDIUM
Dependencies: Stream A (models only)
Tasks:
- Set up pytest configuration
- Write unit tests for all endpoints
- Achieve 70%+ coverage
```

#### Stream C: Frontend Core (Agent 3)
```
Priority: HIGH
Dependencies: None (can use mock data initially)
Tasks:
- Initialize Vite + React project
- Configure Tailwind CSS
- Build UI components
- Implement local state management
```

#### Stream D: Frontend API Integration (Agent 4)
```
Priority: MEDIUM
Dependencies: Stream A (API spec), Stream C (components)
Tasks:
- Implement API service layer
- Connect components to API
- Add error handling
- Add loading states
```

#### Stream E: Documentation (Agent 5)
```
Priority: LOW
Dependencies: Stream A, Stream C (for accurate docs)
Tasks:
- Write README.md
- Document API endpoints
- Add setup instructions
```

### 5.2 Parallel Execution Diagram

```
Time →

Agent 1 (Backend):    [====Models====][====Routes====][====CORS====]
                            ↓
Agent 2 (Tests):            [wait] [========Tests========]

Agent 3 (Frontend):   [====Setup====][====Components====][====Hooks====]
                                              ↓
Agent 4 (Integration):                   [wait] [====API Service====][====Connect====]

Agent 5 (Docs):       [wait]──────────────────────────────────────[====README====]
```

### 5.3 Sub-Agent Task Specifications

#### Agent 1: Backend Core Implementation
```
Task: Implement FastAPI backend for Task Management System
Deliverables:
- backend/app/main.py (FastAPI app with CORS)
- backend/app/models.py (Pydantic models)
- backend/app/routes.py (CRUD endpoints)
- backend/app/storage.py (in-memory storage)
- backend/requirements.txt
```

#### Agent 2: Backend Unit Tests
```
Task: Write comprehensive unit tests for backend
Deliverables:
- backend/tests/test_tasks.py
- Minimum 3 tests (create, get, update)
- Target 70%+ coverage
```

#### Agent 3: Frontend UI Components
```
Task: Build React UI components with Tailwind CSS
Deliverables:
- All components in frontend/src/components/
- Tailwind configuration
- Component styling
```

#### Agent 4: Frontend-Backend Integration
```
Task: Integrate frontend with backend API
Deliverables:
- frontend/src/services/taskService.js
- Connected components with real API calls
- Error handling and loading states
```

#### Agent 5: Documentation
```
Task: Create comprehensive README documentation
Deliverables:
- README.md with all sections per NFR-5
```

---

## 6. Critical Path and Dependencies

### 6.1 Critical Path

```
[Backend Models] → [Backend Routes] → [Frontend API Service] → [Integration Testing]
       ↓
[Backend Tests]
```

**Critical path duration estimate**: Models + Routes + API Service + Integration

### 6.2 Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEPENDENCY GRAPH                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                               │
│  │ Backend      │                                               │
│  │ Models       │─────────┬──────────────────────┐              │
│  │ (models.py)  │         │                      │              │
│  └──────────────┘         ▼                      ▼              │
│         │          ┌──────────────┐      ┌──────────────┐       │
│         │          │ Backend      │      │ Backend      │       │
│         │          │ Routes       │      │ Tests        │       │
│         │          │ (routes.py)  │      │ (test_*.py)  │       │
│         │          └──────────────┘      └──────────────┘       │
│         │                 │                                     │
│         │                 ▼                                     │
│         │          ┌──────────────┐                             │
│         └─────────▶│ CORS Config  │                             │
│                    │ (main.py)    │                             │
│                    └──────────────┘                             │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ Frontend     │  │ Frontend     │                             │
│  │ Components   │─▶│ API Service  │                             │
│  │ (*.jsx)      │  │ (service.js) │                             │
│  └──────────────┘  └──────────────┘                             │
│                           │                                     │
│                           ▼                                     │
│                    ┌──────────────┐                             │
│                    │ Integration  │                             │
│                    │ Testing      │                             │
│                    └──────────────┘                             │
│                           │                                     │
│                           ▼                                     │
│                    ┌──────────────┐                             │
│                    │ README.md    │                             │
│                    │ Documentation│                             │
│                    └──────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| CORS misconfiguration | HIGH - Frontend can't reach API | Test early with simple endpoint |
| Pydantic validation complexity | MEDIUM | Use simple validation first, enhance later |
| State management complexity | MEDIUM | Start with useState, add context only if needed |
| Timestamp handling | LOW | Use ISO 8601 format consistently |

### 6.4 Blockers and Resolutions

| Potential Blocker | Resolution |
|-------------------|------------|
| Frontend team waiting for API | Provide API contract early; use mock data |
| Test coverage < 70% | Prioritize happy path tests first |
| Tailwind setup issues | Use CDN fallback if configuration fails |

---

## 7. Acceptance Criteria

### 7.1 Backend Acceptance Checklist

- [ ] **AC-1**: All endpoints respond as specified
  - [ ] POST /api/tasks returns 201 with task object
  - [ ] GET /api/tasks returns 200 with array
  - [ ] GET /api/tasks/{id} returns 200 or 404
  - [ ] PUT /api/tasks/{id} returns 200 or 404
  - [ ] DELETE /api/tasks/{id} returns 204 or 404

- [ ] **AC-2**: Validation works correctly
  - [ ] Empty title rejected with 422
  - [ ] Invalid status rejected with 422
  - [ ] Title > 100 chars rejected
  - [ ] Description > 500 chars rejected

- [ ] **AC-3**: Status filtering works
  - [ ] GET /api/tasks?status=TODO returns only TODO tasks
  - [ ] GET /api/tasks?status=IN_PROGRESS returns only IN_PROGRESS tasks
  - [ ] GET /api/tasks?status=DONE returns only DONE tasks

- [ ] **AC-4**: Timestamps are correct
  - [ ] createdAt set on creation
  - [ ] updatedAt updated on modification
  - [ ] ISO 8601 format

- [ ] **AC-5**: Unit tests pass
  - [ ] Minimum 3 tests implemented
  - [ ] 70%+ code coverage achieved
  - [ ] All tests pass

### 7.2 Frontend Acceptance Checklist

- [ ] **AC-6**: Task list displays correctly
  - [ ] All tasks visible
  - [ ] Title, status, date shown
  - [ ] Edit/Delete buttons present
  - [ ] Empty state shown when no tasks

- [ ] **AC-7**: Create task works
  - [ ] Form validates title required
  - [ ] Task appears in list after creation
  - [ ] Success message shown
  - [ ] Form clears after success

- [ ] **AC-8**: Edit task works
  - [ ] Form pre-populated with task data
  - [ ] Changes saved correctly
  - [ ] List updates immediately
  - [ ] Success message shown

- [ ] **AC-9**: Delete task works
  - [ ] Confirmation dialog shown
  - [ ] Task removed from list
  - [ ] Success notification (optional)

- [ ] **AC-10**: Status filter works
  - [ ] All filter shows all tasks
  - [ ] Status filters show correct subset
  - [ ] Active filter visually indicated

- [ ] **AC-11**: Quick status update works
  - [ ] Status changeable from list view
  - [ ] Change persists to backend
  - [ ] UI updates immediately

- [ ] **AC-12**: Error handling works
  - [ ] Network errors show message
  - [ ] Validation errors shown inline
  - [ ] Loading indicators visible

### 7.3 Integration Acceptance Checklist

- [ ] **AC-13**: End-to-end CRUD works
  - [ ] Create task from UI, visible in list
  - [ ] Edit task, changes persist
  - [ ] Delete task, removed from list
  - [ ] Refresh page, data persists (in memory)

- [ ] **AC-14**: No console errors
  - [ ] No JavaScript errors during normal usage
  - [ ] No unhandled promise rejections
  - [ ] No React warnings

### 7.4 Documentation Acceptance Checklist

- [ ] **AC-15**: README complete
  - [ ] Project description
  - [ ] Prerequisites listed
  - [ ] Setup instructions (backend)
  - [ ] Setup instructions (frontend)
  - [ ] Instructions to run tests
  - [ ] API documentation
  - [ ] Technology stack description

- [ ] **AC-16**: Application runnable from README
  - [ ] Fresh clone can follow instructions
  - [ ] Backend starts successfully
  - [ ] Frontend starts successfully
  - [ ] Application works as expected

---

## Appendix A: API Quick Reference

| Method | Endpoint | Request Body | Success Response |
|--------|----------|--------------|------------------|
| POST | /api/tasks | `{title, description?, status}` | 201 + Task |
| GET | /api/tasks | - | 200 + Task[] |
| GET | /api/tasks?status=X | - | 200 + Task[] |
| GET | /api/tasks/{id} | - | 200 + Task |
| PUT | /api/tasks/{id} | `{title, description?, status}` | 200 + Task |
| DELETE | /api/tasks/{id} | - | 204 |

## Appendix B: Task Status Values

| Status | Description |
|--------|-------------|
| TODO | Task not started |
| IN_PROGRESS | Task being worked on |
| DONE | Task completed |

## Appendix C: Commands Quick Reference

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Run tests
pytest --cov=app tests/

# Frontend
cd frontend
npm install
npm run dev

# Build for production
npm run build
```
