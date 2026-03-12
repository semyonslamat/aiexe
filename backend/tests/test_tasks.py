import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.storage import storage


@pytest.fixture(autouse=True)
def clear_storage():
    """Clear storage before each test."""
    storage.tasks.clear()
    yield
    storage.tasks.clear()


@pytest.fixture
def client():
    return TestClient(app)


class TestCreateTask:
    """Tests for POST /api/tasks endpoint."""

    def test_create_task_with_valid_data(self, client):
        """Test creating a task with valid data returns 201."""
        task_data = {
            "title": "Test Task",
            "description": "Test Description",
            "status": "TODO"
        }
        response = client.post("/api/tasks", json=task_data)

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["description"] == "Test Description"
        assert data["status"] == "TODO"
        assert "id" in data
        assert "createdAt" in data
        assert "updatedAt" in data

    def test_create_task_with_minimal_data(self, client):
        """Test creating a task with only required fields."""
        task_data = {"title": "Minimal Task"}
        response = client.post("/api/tasks", json=task_data)

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Minimal Task"
        assert data["status"] == "TODO"  # Default status
        assert data["description"] is None

    def test_create_task_without_title_fails(self, client):
        """Test creating a task without title returns 422."""
        task_data = {"description": "No title"}
        response = client.post("/api/tasks", json=task_data)

        assert response.status_code == 422

    def test_create_task_with_empty_title_fails(self, client):
        """Test creating a task with empty title returns 422."""
        task_data = {"title": ""}
        response = client.post("/api/tasks", json=task_data)

        assert response.status_code == 422

    def test_create_task_with_invalid_status_fails(self, client):
        """Test creating a task with invalid status returns 422."""
        task_data = {"title": "Test", "status": "INVALID"}
        response = client.post("/api/tasks", json=task_data)

        assert response.status_code == 422


class TestGetTasks:
    """Tests for GET /api/tasks endpoint."""

    def test_get_tasks_empty_list(self, client):
        """Test getting tasks when none exist returns empty list."""
        response = client.get("/api/tasks")

        assert response.status_code == 200
        assert response.json() == []

    def test_get_tasks_returns_all(self, client):
        """Test getting all tasks."""
        # Create tasks
        client.post("/api/tasks", json={"title": "Task 1"})
        client.post("/api/tasks", json={"title": "Task 2"})

        response = client.get("/api/tasks")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_get_tasks_filter_by_status(self, client):
        """Test filtering tasks by status."""
        client.post("/api/tasks", json={"title": "Task 1", "status": "TODO"})
        client.post("/api/tasks", json={"title": "Task 2", "status": "DONE"})
        client.post("/api/tasks", json={"title": "Task 3", "status": "TODO"})

        response = client.get("/api/tasks?status=TODO")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all(t["status"] == "TODO" for t in data)

    def test_get_tasks_filter_in_progress(self, client):
        """Test filtering tasks by IN_PROGRESS status."""
        client.post("/api/tasks", json={"title": "Task 1", "status": "IN_PROGRESS"})
        client.post("/api/tasks", json={"title": "Task 2", "status": "DONE"})

        response = client.get("/api/tasks?status=IN_PROGRESS")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "IN_PROGRESS"


class TestGetTaskById:
    """Tests for GET /api/tasks/{id} endpoint."""

    def test_get_task_by_id_success(self, client):
        """Test getting a task by valid ID returns 200."""
        create_response = client.post("/api/tasks", json={"title": "Test Task"})
        task_id = create_response.json()["id"]

        response = client.get(f"/api/tasks/{task_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == "Test Task"

    def test_get_task_by_id_not_found(self, client):
        """Test getting a task by invalid ID returns 404."""
        response = client.get("/api/tasks/nonexistent-id")

        assert response.status_code == 404


class TestUpdateTask:
    """Tests for PUT /api/tasks/{id} endpoint."""

    def test_update_task_success(self, client):
        """Test updating a task returns 200 with updated data."""
        create_response = client.post("/api/tasks", json={"title": "Original"})
        task_id = create_response.json()["id"]

        update_data = {"title": "Updated", "status": "DONE"}
        response = client.put(f"/api/tasks/{task_id}", json=update_data)

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated"
        assert data["status"] == "DONE"

    def test_update_task_partial(self, client):
        """Test partial update only changes specified fields."""
        create_response = client.post("/api/tasks", json={
            "title": "Original",
            "description": "Original Desc",
            "status": "TODO"
        })
        task_id = create_response.json()["id"]

        update_data = {"status": "IN_PROGRESS"}
        response = client.put(f"/api/tasks/{task_id}", json=update_data)

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Original"
        assert data["description"] == "Original Desc"
        assert data["status"] == "IN_PROGRESS"

    def test_update_task_not_found(self, client):
        """Test updating a nonexistent task returns 404."""
        response = client.put("/api/tasks/nonexistent-id", json={"title": "New"})

        assert response.status_code == 404

    def test_update_task_updates_timestamp(self, client):
        """Test that updating a task updates the updatedAt timestamp."""
        create_response = client.post("/api/tasks", json={"title": "Test"})
        task_id = create_response.json()["id"]
        original_updated = create_response.json()["updatedAt"]

        import time
        time.sleep(0.1)

        response = client.put(f"/api/tasks/{task_id}", json={"title": "Updated"})
        new_updated = response.json()["updatedAt"]

        assert new_updated != original_updated


class TestDeleteTask:
    """Tests for DELETE /api/tasks/{id} endpoint."""

    def test_delete_task_success(self, client):
        """Test deleting a task returns 204."""
        create_response = client.post("/api/tasks", json={"title": "To Delete"})
        task_id = create_response.json()["id"]

        response = client.delete(f"/api/tasks/{task_id}")

        assert response.status_code == 204

        # Verify it's deleted
        get_response = client.get(f"/api/tasks/{task_id}")
        assert get_response.status_code == 404

    def test_delete_task_not_found(self, client):
        """Test deleting a nonexistent task returns 404."""
        response = client.delete("/api/tasks/nonexistent-id")

        assert response.status_code == 404


class TestValidation:
    """Tests for input validation."""

    def test_title_max_length(self, client):
        """Test title exceeding 100 characters is rejected."""
        task_data = {"title": "x" * 101}
        response = client.post("/api/tasks", json=task_data)

        assert response.status_code == 422

    def test_description_max_length(self, client):
        """Test description exceeding 500 characters is rejected."""
        task_data = {"title": "Test", "description": "x" * 501}
        response = client.post("/api/tasks", json=task_data)

        assert response.status_code == 422
