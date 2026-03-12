from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from .models import TaskCreate, TaskUpdate, TaskResponse, TaskStatus
from .storage import storage

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate):
    """Create a new task."""
    task = storage.create(task_data)
    return task


@router.get("", response_model=List[TaskResponse])
def get_tasks(status: Optional[TaskStatus] = Query(None, description="Filter by status")):
    """Get all tasks, optionally filtered by status."""
    tasks = storage.get_all(status)
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str):
    """Get a task by ID."""
    task = storage.get_by_id(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Task not found", "code": "TASK_NOT_FOUND"}
        )
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, task_data: TaskUpdate):
    """Update a task by ID."""
    task = storage.update(task_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Task not found", "code": "TASK_NOT_FOUND"}
        )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str):
    """Delete a task by ID."""
    deleted = storage.delete(task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Task not found", "code": "TASK_NOT_FOUND"}
        )
    return None
