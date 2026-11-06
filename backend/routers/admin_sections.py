import json
import sqlite3
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_admin
from backend.models.schemas import SectionCreateUpdate, SectionsReorderRequest

router = APIRouter(prefix="/admin/sections", tags=["Admin Sections"])

@router.get("")
def list_sections(page_id: Optional[str] = Query(None), current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    query = """
        SELECT cs.*, p.title as page_title, p.slug as page_slug
        FROM content_sections cs
        LEFT JOIN pages p ON p.id = cs.page_id
    """
    params = []

    if page_id is not None and page_id != "":
        if page_id == "null" or page_id == "0":
            query += " WHERE cs.page_id IS NULL"
        else:
            query += " WHERE cs.page_id = ?"
            params.append(int(page_id))

    query += " ORDER BY cs.sort_order ASC, cs.id ASC"
    sections = db.execute(query, params).fetchall()

    result = []
    for row in sections:
        s = dict(row)
        if s.get("custom_data"):
            try:
                s["custom_data"] = json.loads(s["custom_data"])
            except Exception:
                s["custom_data"] = {}
        else:
            s["custom_data"] = {}
        result.append(s)

    return {
        "success": True,
        "sections": result
    }

@router.post("", status_code=status.HTTP_201_CREATED)
def create_section(req: SectionCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    if not req.section_key:
        raise HTTPException(status_code=400, detail="Section key is required.")

    custom_data_str = json.dumps(req.custom_data) if req.custom_data is not None else "{}"

    cursor = db.execute("""
        INSERT INTO content_sections (page_id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, is_visible, custom_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        req.page_id,
        req.section_key.strip(),
        req.title,
        req.subtitle,
        req.content_html,
        req.image_url,
        req.button_text,
        req.button_url,
        req.section_type or "standard",
        req.sort_order or 0,
        req.is_visible if req.is_visible is not None else 1,
        custom_data_str
    ))

    return {
        "success": True,
        "message": "Section created successfully",
        "section_id": cursor.lastrowid
    }

@router.put("/{section_id}")
def update_section(section_id: int, req: SectionCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    section = dict_from_row(db.execute("SELECT id FROM content_sections WHERE id = ?", (section_id,)).fetchone())
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    custom_data_str = json.dumps(req.custom_data) if req.custom_data is not None else "{}"

    db.execute("""
        UPDATE content_sections
        SET page_id = ?, section_key = ?, title = ?, subtitle = ?, content_html = ?, image_url = ?, button_text = ?, button_url = ?, section_type = ?, sort_order = ?, is_visible = ?, custom_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (
        req.page_id,
        req.section_key.strip(),
        req.title,
        req.subtitle,
        req.content_html,
        req.image_url,
        req.button_text,
        req.button_url,
        req.section_type or "standard",
        req.sort_order or 0,
        req.is_visible if req.is_visible is not None else 1,
        custom_data_str,
        section_id
    ))

    return {
        "success": True,
        "message": "Section updated successfully"
    }

@router.post("/reorder")
def reorder_sections(req: SectionsReorderRequest, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    for index, sid in enumerate(req.ordered_ids):
        db.execute("UPDATE content_sections SET sort_order = ? WHERE id = ?", (index, sid))

    return {
        "success": True,
        "message": "Sections reordered successfully"
    }

@router.delete("/{section_id}")
def delete_section(section_id: int, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    db.execute("DELETE FROM content_sections WHERE id = ?", (section_id,))
    return {
        "success": True,
        "message": "Section deleted successfully"
    }
