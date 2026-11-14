import re
import sqlite3
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_admin
from backend.models.schemas import PageCreateUpdate

router = APIRouter(prefix="/admin/pages", tags=["Admin Pages"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^\w\-]+", "", text)
    text = re.sub(r"\-\-+", "-", text)
    return text

@router.get("")
def list_pages(current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    pages = db.execute("""
        SELECT p.*, COUNT(cs.id) as section_count
        FROM pages p
        LEFT JOIN content_sections cs ON cs.page_id = p.id
        GROUP BY p.id
        ORDER BY p.sort_order ASC, p.id ASC
    """).fetchall()

    return {
        "success": True,
        "pages": dicts_from_rows(pages)
    }

@router.post("", status_code=status.HTTP_201_CREATED)
def create_page(req: PageCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    if not req.title:
        raise HTTPException(status_code=400, detail="Page title is required.")

    final_slug = slugify(req.slug if req.slug else req.title)
    existing = db.execute("SELECT id FROM pages WHERE slug = ?", (final_slug,)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail=f"A page with slug '{final_slug}' already exists.")

    cursor = db.execute("""
        INSERT INTO pages (title, slug, meta_title, meta_description, template, status, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        req.title.strip(),
        final_slug,
        req.meta_title or req.title.strip(),
        req.meta_description or "",
        req.template or "standard",
        req.status or "published",
        req.sort_order or 0
    ))

    return {
        "success": True,
        "message": "Page created successfully",
        "page_id": cursor.lastrowid,
        "slug": final_slug
    }

@router.put("/{page_id}")
def update_page(page_id: int, req: PageCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    page = dict_from_row(db.execute("SELECT * FROM pages WHERE id = ?", (page_id,)).fetchone())
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    final_slug = slugify(req.slug if req.slug else req.title)
    if final_slug != page["slug"]:
        conflict = db.execute("SELECT id FROM pages WHERE slug = ? AND id != ?", (final_slug, page_id)).fetchone()
        if conflict:
            raise HTTPException(status_code=400, detail=f"Slug '{final_slug}' is already in use by another page.")

    db.execute("""
        UPDATE pages
        SET title = ?, slug = ?, meta_title = ?, meta_description = ?, template = ?, status = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (
        req.title.strip(),
        final_slug,
        req.meta_title,
        req.meta_description,
        req.template or "standard",
        req.status or "published",
        req.sort_order if req.sort_order is not None else page["sort_order"],
        page_id
    ))

    return {
        "success": True,
        "message": "Page updated successfully",
        "page": {
            **page,
            "title": req.title.strip(),
            "slug": final_slug
        }
    }

@router.delete("/{page_id}")
def delete_page(page_id: int, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    page = dict_from_row(db.execute("SELECT * FROM pages WHERE id = ?", (page_id,)).fetchone())
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    if page["slug"] == "home":
        raise HTTPException(status_code=400, detail="Cannot delete the default homepage.")

    db.execute("DELETE FROM content_sections WHERE page_id = ?", (page_id,))
    db.execute("DELETE FROM pages WHERE id = ?", (page_id,))

    return {
        "success": True,
        "message": f"Page '{page['title']}' deleted successfully"
    }
