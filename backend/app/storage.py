from datetime import datetime
from typing import Dict, List, Optional
from .models import Task, TaskCreate, TaskUpdate, TaskStatus
import uuid


class TaskStorage:
    def __init__(self):
        self.tasks: Dict[str, Task] = {}

    def create(self, task_data: TaskCreate) -> Task:
        task = Task(
            id=str(uuid.uuid4()),
            title=task_data.title,
            description=task_data.description,
            status=task_data.status,
            createdAt=datetime.utcnow(),
            updatedAt=datetime.utcnow()
        )
        self.tasks[task.id] = task
        return task

    def get_all(self, status: Optional[TaskStatus] = None) -> List[Task]:
        tasks = list(self.tasks.values())
        if status:
            tasks = [t for t in tasks if t.status == status]
        return tasks

    def get_by_id(self, task_id: str) -> Optional[Task]:
        return self.tasks.get(task_id)

    def update(self, task_id: str, task_data: TaskUpdate) -> Optional[Task]:
        task = self.tasks.get(task_id)
        if not task:
            return None

        # Compatible with both pydantic v1 (.dict()) and v2 (.model_dump())
        if hasattr(task_data, 'model_dump'):
            update_data = task_data.model_dump(exclude_unset=True)
        else:
            update_data = task_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(task, field, value)

        task.updatedAt = datetime.utcnow()
        self.tasks[task_id] = task
        return task

    def delete(self, task_id: str) -> bool:
        if task_id in self.tasks:
            del self.tasks[task_id]
            return True
        return False


# Singleton instance
storage = TaskStorage()
