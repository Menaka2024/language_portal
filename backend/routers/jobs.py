# routers/jobs.py

from fastapi import APIRouter, HTTPException
from db.database import jobs_collection

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("/{job_id}")
async def get_job(job_id: str):
    job = await jobs_collection.find_one({"id": job_id})
    if not job:
        raise HTTPException(404, "Job not found")
    return {
        "status":     job["status"],
        "steps":      job.get("steps", {}),
        "documentId": job.get("document_id"),
    }