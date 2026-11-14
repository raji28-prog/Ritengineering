import sqlite3
from fastapi import APIRouter, Depends, HTTPException, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_admin
from backend.models.schemas import AnnouncementCreateUpdate

router = APIRouter(prefix="/admin/announcements", tags=["Admin Announcements"])

@router.get("")
def list_admin_announcements(current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("SELECT * FROM announcements_news ORDER BY sort_order ASC, id DESC").fetchall()
    return {
        "success": True,
        "announcements": dicts_from_rows(rows)
    }

@router.post("", status_code=status.HTTP_201_CREATED)
def create_announcement(req: AnnouncementCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    if not req.title:
        raise HTTPException(status_code=400, detail="Announcement title is required.")

    cursor = db.execute("""
        INSERT INTO announcements_news (title, summary, link_url, badge_text, badge_color, is_flash, status, start_date, end_date, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        req.title.strip(),
        req.summary,
        req.link_url,
        req.badge_text or "NEW",
        req.badge_color or "#159B62",
        req.is_flash if req.is_flash is not None else 1,
        req.status or "published",
        req.start_date,
        req.end_date,
        req.sort_order or 0
    ))

    return {
        "success": True,
        "message": "Announcement published successfully",
        "id": cursor.lastrowid
    }

@router.put("/{announcement_id}")
def update_announcement(announcement_id: int, req: AnnouncementCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    existing = db.execute("SELECT id FROM announcements_news WHERE id = ?", (announcement_id,)).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Announcement not found.")

    db.execute("""
        UPDATE announcements_news
        SET title = ?, summary = ?, link_url = ?, badge_text = ?, badge_color = ?, is_flash = ?, status = ?, start_date = ?, end_date = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (
        req.title.strip(),
        req.summary,
        req.link_url,
        req.badge_text or "NEW",
        req.badge_color or "#159B62",
        req.is_flash if req.is_flash is not None else 1,
        req.status or "published",
        req.start_date,
        req.end_date,
        req.sort_order or 0,
        announcement_id
    ))

    return {
        "success": True,
        "message": "Announcement updated successfully"
    }

@router.delete("/{announcement_id}")
def delete_announcement(announcement_id: int, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    db.execute("DELETE FROM announcements_news WHERE id = ?", (announcement_id,))
    return {
        "success": True,
        "message": "Announcement deleted successfully"
    }
