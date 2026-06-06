# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import documents, jobs, auth

app = FastAPI(title="Language Resource Workbench API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(jobs.router)

@app.get("/")
def root():
    return {"message": "Language Resource Workbench API running"}