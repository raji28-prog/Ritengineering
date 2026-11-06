import os
import re
import time
import math
import sqlite3
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, status
from backend import config
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_admin

router = APIRouter(prefix="/admin/media", tags=["Admin Media"])

# Ensure upload directory exists
os.makedirs(config.UPLOAD_DIR, exist_ok=True)

@router.get("")
def list_media(
    search: Optional[str] = Query(None),
    page: int = Query(1),
    limit: int = Query(50),
    current_user: dict = Depends(require_admin),
    db: sqlite3.Connection = Depends(get_db)
):
    offset = (page - 1) * limit
    base_query = "SELECT * FROM media_library"
    count_query = "SELECT COUNT(*) as total FROM media_library"
    params = []

    if search:
        clause = " WHERE original_name LIKE ? OR alt_text LIKE ?"
        base_query += clause
        count_query += clause
        params.extend([f"%{search}%", f"%{search}%"])

    base_query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    count_params = list(params)
    params.extend([limit, offset])

    items = dicts_from_rows(db.execute(base_query, params).fetchall())
    total_row = db.execute(count_query, count_params).fetchone()
    total = total_row["total"] if total_row else 0

    for item in items:
        item["public_url"] = f"/uploads/media/{item['filename']}"

    return {
        "success": True,
        "items": items,
        "total": total,
        "page": page,
        "totalPages": math.ceil(total / limit) if limit > 0 else 1
    }

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(None),
    current_user: dict = Depends(require_admin),
    db: sqlite3.Connection = Depends(get_db)
):
    if file.content_type not in config.ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: Images (JPG, PNG, WebP, SVG, GIF) and PDF documents."
        )

    # Sanitize filename and create unique timestamped name
    original_name = file.filename or "uploaded_file"
    base, ext = os.path.splitext(original_name)
    clean_base = re.sub(r"[^a-z0-9_-]", "_", base.lower())
    unique_filename = f"{clean_base}_{int(time.time() * 1000)}{ext.lower()}"
    destination_path = os.path.join(config.UPLOAD_DIR, unique_filename)

    content = await file.read()
    if len(content) > config.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {config.MAX_FILE_SIZE // (1024*1024)}MB.")

    with open(destination_path, "wb") as f:
        f.write(content)

    file_size = len(content)
    relative_path = f"uploads/media/{unique_filename}"
    final_alt = alt_text if alt_text else original_name

    cursor = db.execute("""
        INSERT INTO media_library (filename, original_name, mime_type, file_size, file_path, alt_text)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (unique_filename, original_name, file.content_type, file_size, relative_path, final_alt))

    return {
        "success": True,
        "message": "File uploaded successfully",
        "media": {
            "id": cursor.lastrowid,
            "filename": unique_filename,
            "original_name": original_name,
            "url": f"/{relative_path}",
            "size": file_size,
            "mime_type": file.content_type
        }
    }

@router.delete("/{media_id}")
def delete_media(media_id: int, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    media = dict_from_row(db.execute("SELECT * FROM media_library WHERE id = ?", (media_id,)).fetchone())
    if not media:
        raise HTTPException(status_code=404, detail="Media file not found")

    full_path = os.path.join(config.UPLOAD_DIR, media["filename"])
    if os.path.exists(full_path):
        try:
            os.remove(full_path)
        except Exception:
            pass

    db.execute("DELETE FROM media_library WHERE id = ?", (media_id,))

    return {
        "success": True,
        "message": "Media file removed successfully"
    }
