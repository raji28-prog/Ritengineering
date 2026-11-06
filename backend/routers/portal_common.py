import sqlite3
from fastapi import APIRouter, Depends, Body
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import get_current_user, attach_role_profile
from backend.models.schemas import NotificationMarkReadRequest

router = APIRouter(prefix="/portal/common", tags=["Portal Common"])

@router.get("/notifications")
def get_user_notifications(current_user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    user_id = current_user["id"]
    rows = db.execute("""
        SELECT id, title, message, type, is_read, created_at
        FROM user_notifications
        WHERE user_id = ?
        ORDER BY is_read ASC, created_at DESC
        LIMIT 30
    """, (user_id,)).fetchall()

    cnt_row = db.execute("SELECT COUNT(*) as c FROM user_notifications WHERE user_id = ? AND is_read = 0", (user_id,)).fetchone()
    unread_count = cnt_row["c"] if cnt_row else 0

    return {
        "success": True,
        "unread_count": unread_count,
        "data": dicts_from_rows(rows)
    }

@router.post("/notifications/mark-read")
def mark_notifications_read(req: NotificationMarkReadRequest, current_user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    user_id = current_user["id"]
    if req.notification_id:
        db.execute("UPDATE user_notifications SET is_read = 1 WHERE id = ? AND user_id = ?", (req.notification_id, user_id))
    else:
        db.execute("UPDATE user_notifications SET is_read = 1 WHERE user_id = ?", (user_id,))

    return {
        "success": True,
        "message": "Notifications marked as read."
    }

@router.get("/announcements")
def get_common_announcements(current_user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    role = current_user.get("role", "student")

    if role == "student":
        target_clause = "target_audience IN ('all', 'students')"
    elif role == "parent":
        target_clause = "target_audience IN ('all', 'parents')"
    elif role == "staff":
        target_clause = "target_audience IN ('all', 'staff')"
    else:
        target_clause = "1=1"

    rows = db.execute(f"""
        SELECT id, title, content, category, target_audience, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE {target_clause}
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
            posted_date DESC
    """).fetchall()

    return {
        "success": True,
        "role": role,
        "data": dicts_from_rows(rows)
    }

@router.get("/profile")
def get_unified_profile(current_user: dict = Depends(attach_role_profile), db: sqlite3.Connection = Depends(get_db)):
    role = current_user.get("role")
    profile = current_user.get("student") or current_user.get("parent") or current_user.get("staff")

    role_title_map = {
        "student": "Student",
        "parent": "Parent / Guardian",
        "staff": "Faculty / Staff",
        "admin": "System Administrator"
    }

    return {
        "success": True,
        "user": {
            "id": current_user["id"],
            "username": current_user["username"],
            "email": current_user["email"],
            "role": role,
            "roleTitle": role_title_map.get(role, "Portal User")
        },
        "profile": profile
    }

@router.put("/profile")
def update_profile_contact(payload: dict = Body(...), current_user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    phone = payload.get("phone")
    address = payload.get("address")
    occupation = payload.get("occupation")
    office_room = payload.get("office_room")

    role = current_user.get("role")
    uid = current_user["id"]

    if role == "student":
        if phone or address:
            db.execute("""
                UPDATE students 
                SET phone = COALESCE(?, phone), address = COALESCE(?, address) 
                WHERE user_id = ?
            """, (phone, address, uid))
    elif role == "parent":
        if phone or address or occupation:
            db.execute("""
                UPDATE parents 
                SET phone = COALESCE(?, phone), address = COALESCE(?, address), occupation = COALESCE(?, occupation)
                WHERE user_id = ?
            """, (phone, address, occupation, uid))
    elif role == "staff":
        if phone or office_room:
            db.execute("""
                UPDATE staff 
                SET phone = COALESCE(?, phone), office_room = COALESCE(?, office_room)
                WHERE user_id = ?
            """, (phone, office_room, uid))

    return {
        "success": True,
        "message": "Contact details updated successfully."
    }
