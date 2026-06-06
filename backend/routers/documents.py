# routers/documents.py

from fastapi import APIRouter, UploadFile, File, Form, Depends, BackgroundTasks, HTTPException
from db.database import documents_collection, jobs_collection
from services.cleaner import clean_text
from services.nlp import run_nlp
from services.ocr import extract_text_from_image
from services.stt import extract_text_from_audio
import httpx, json, uuid
from datetime import datetime

router = APIRouter(prefix="/api/documents", tags=["documents"])


async def process_job(job_id: str, payload: dict):
    try:
        steps      = {"extracting": False, "cleaning": False, "nlp": False}
        input_type = payload.get("inputType")
        raw_text   = ""

        if input_type == "text":
            raw_text = payload.get("text", "")

        elif input_type == "url":
            async with httpx.AsyncClient() as client:
                res      = await client.get(payload["url"], timeout=10)
                raw_text = res.text

        elif input_type == "image":
            raw_text = extract_text_from_image(payload["file_bytes"])

        elif input_type == "audio":
            raw_text = extract_text_from_audio(payload["file_bytes"])

        elif input_type == "pdf":
            import pdfplumber, io
            with pdfplumber.open(io.BytesIO(payload["file_bytes"])) as pdf:
                raw_text = "\n".join(p.extract_text() or "" for p in pdf.pages)

        steps["extracting"] = True
        await jobs_collection.update_one(
            {"id": job_id},
            {"$set": {"steps": steps}}
        )

        cleaned = clean_text(raw_text)
        steps["cleaning"] = True
        await jobs_collection.update_one(
            {"id": job_id},
            {"$set": {"steps": steps}}
        )

        nlp_result = run_nlp(cleaned)
        steps["nlp"] = True

        doc_id = str(uuid.uuid4())
        doc = {
            "id":         doc_id,
            "title":      payload.get("title"),
            "domain":     payload.get("domain"),
            "language":   payload.get("language", "Tamil"),
            "source":     payload.get("source", "Manual"),
            "license":    payload.get("license", "CC BY"),
            "raw_text":   raw_text,
            "clean_text": cleaned,
            "tokens":     json.loads(nlp_result["tokens"]),
            "pos":        json.loads(nlp_result["pos"]),
            "created_at": datetime.utcnow().isoformat(),
        }
        await documents_collection.insert_one(doc)

        await jobs_collection.update_one(
            {"id": job_id},
            {"$set": {
                "status":      "done",
                "document_id": doc_id,
                "steps":       steps
            }}
        )

    except Exception as e:
        await jobs_collection.update_one(
            {"id": job_id},
            {"$set": {"status": "failed"}}
        )
        raise e


@router.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    inputType: str        = Form(...),
    language:  str        = Form("Tamil"),
    source:    str        = Form("Manual"),
    license:   str        = Form("CC BY"),
    title:     str        = Form(""),
    domain:    str        = Form(""),
    text:      str        = Form(""),
    url:       str        = Form(""),
    file:      UploadFile = File(None),
):
    job_id = str(uuid.uuid4())
    await jobs_collection.insert_one({
        "id":     job_id,
        "status": "processing",
        "steps":  {}
    })

    payload = {
        "inputType": inputType,
        "language":  language,
        "source":    source,
        "license":   license,
        "title":     title,
        "domain":    domain,
        "text":      text,
        "url":       url,
        "file_bytes": await file.read() if file else None,
    }

    background_tasks.add_task(process_job, job_id, payload)
    return {"jobId": job_id}


@router.get("")
async def search_documents(
    query:    str = "",
    language: str = "",
    source:   str = "",
):
    filter = {}
    if language:
        filter["language"] = language
    if source:
        filter["source"] = source

    cursor = documents_collection.find(filter)
    docs   = await cursor.to_list(length=100)

    if query:
        docs = [d for d in docs if query.lower() in (d.get("clean_text") or "").lower()]

    return {
        "items": [
            {
                "id":        d["id"],
                "language":  d["language"],
                "source":    d["source"],
                "license":   d["license"],
                "excerpt":   (d.get("clean_text") or "")[:100] + "...",
                "createdAt": d.get("created_at"),
            }
            for d in docs
        ]
    }


@router.get("/{doc_id}")
async def get_document(doc_id: str):
    doc = await documents_collection.find_one({"id": doc_id})
    if not doc:
        raise HTTPException(404, "Document not found")
    return {
        "id":        doc["id"],
        "title":     doc.get("title"),
        "language":  doc["language"],
        "source":    doc["source"],
        "license":   doc["license"],
        "createdAt": doc.get("created_at"),
        "rawText":   doc.get("raw_text"),
        "cleanText": doc.get("clean_text"),
        "tokens":    doc.get("tokens", []),
        "pos":       doc.get("pos", []),
    }