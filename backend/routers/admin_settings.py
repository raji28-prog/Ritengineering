import json
import sqlite3
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Body
from backend.database import get_db, dicts_from_rows
from backend.auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin Settings & Audit"])

@router.get("/settings")
def get_admin_settings(current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("SELECT key, value, category, updated_at FROM college_settings").fetchall()
    settings = {}
    for r in rows:
        val = r["value"]
        try:
            settings[r["key"]] = json.loads(val)
        except Exception:
            settings[r["key"]] = val

    return {
        "success": True,
        "settings": settings
    }

@router.put("/settings/{category}")
def update_admin_settings(category: str, value: Any = Body(...), current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    json_str = json.dumps(value) if not isinstance(value, str) else value

    db.execute("""
        INSERT INTO college_settings (key, value, category, updated_at)
        VALUES (?, ?, 'general', CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    """, (category, json_str))

    return {
        "success": True,
        "message": f"Settings for '{category}' updated successfully."
    }

@router.get("/audit-logs")
def get_audit_logs(current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT a.*, u.username
        FROM audit_logs a
        LEFT JOIN users u ON u.id = a.user_id
        ORDER BY a.id DESC
        LIMIT 200
    """).fetchall()

    return {
        "success": True,
        "logs": dicts_from_rows(rows)
    }
