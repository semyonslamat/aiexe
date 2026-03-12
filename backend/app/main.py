from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router

app = FastAPI(
    title="Task Management System",
    description="RESTful API for managing tasks",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# Include routes
app.include_router(router)


@app.get("/")
def root():
    return {"message": "Task Management System API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
