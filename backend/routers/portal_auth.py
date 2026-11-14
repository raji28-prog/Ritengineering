import sqlite3
from fastapi import APIRouter, Depends, HTTPException, Request, status
from backend.database import get_db, dict_from_row
from backend.auth import (
    verify_password,
    hash_password,
    create_access_token,
    check_login_rate_limit,
    record_failed_login,
    clear_failed_login,
    get_current_user,
    attach_role_profile
)
from backend.models.schemas import PortalLoginRequest, ChangePasswordRequest

router = APIRouter(prefix="/portal/auth", tags=["Portal Auth"])

@router.post("/login")
def portal_login(req: PortalLoginRequest, request: Request, db: sqlite3.Connection = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    check_login_rate_limit(ip)

    identifier = req.identifier.strip()
    password = req.password

    if not identifier or not password:
        raise HTTPException(status_code=400, detail="User ID / Roll No / Email and password are required.")

    # Find user by username, email, roll_number, parent_code, or staff_code
    user = dict_from_row(db.execute("SELECT * FROM users WHERE username = ? OR email = ?", (identifier, identifier)).fetchone())

    if not user:
        st = dict_from_row(db.execute("SELECT user_id FROM students WHERE roll_number = ?", (identifier,)).fetchone())
        if st:
            user = dict_from_row(db.execute("SELECT * FROM users WHERE id = ?", (st["user_id"],)).fetchone())

    if not user:
        par = dict_from_row(db.execute("SELECT user_id FROM parents WHERE parent_code = ? OR phone = ?", (identifier, identifier)).fetchone())
        if par:
            user = dict_from_row(db.execute("SELECT * FROM users WHERE id = ?", (par["user_id"],)).fetchone())

    if not user:
        stf = dict_from_row(db.execute("SELECT user_id FROM staff WHERE staff_code = ?", (identifier,)).fetchone())
        if stf:
            user = dict_from_row(db.execute("SELECT * FROM users WHERE id = ?", (stf["user_id"],)).fetchone())

    if not user:
        record_failed_login(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. User ID not found in institutional directory."
        )

    if user.get("is_active") != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is deactivated. Please contact the Academic Administration."
        )

    if not verify_password(password, user["password_hash"]):
        record_failed_login(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your password."
        )

    if req.expectedRole and req.expectedRole != "any":
        if user["role"] != req.expectedRole and user["role"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account role mismatch. This account is registered as '{user['role'].upper()}', but you selected the '{req.expectedRole.upper()}' login. Please switch to the correct tab."
            )

    clear_failed_login(ip)

    db.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (user["id"],))

    profile = None
    display_name = user["username"]

    if user["role"] == "student":
        profile = dict_from_row(db.execute("SELECT * FROM students WHERE user_id = ?", (user["id"],)).fetchone())
        if profile:
            display_name = profile["full_name"]
    elif user["role"] == "parent":
        profile = dict_from_row(db.execute("SELECT * FROM parents WHERE user_id = ?", (user["id"],)).fetchone())
        if profile:
            display_name = profile["full_name"]
    elif user["role"] == "staff":
        profile = dict_from_row(db.execute("SELECT * FROM staff WHERE user_id = ?", (user["id"],)).fetchone())
        if profile:
            display_name = profile["full_name"]

    try:
        db.execute("""
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
            VALUES (?, 'PORTAL_LOGIN', 'user', ?, ?, ?)
        """, (user["id"], user["id"], f"User authenticated to Campus Portal with role: {user['role']}", ip))
    except Exception:
        pass

    token = create_access_token({"id": user["id"], "username": user["username"], "role": user["role"]})

    return {
        "success": True,
        "message": f"Welcome back, {display_name}!",
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "displayName": display_name,
            "profile": profile
        }
    }

@router.get("/me")
def portal_get_me(current_user: dict = Depends(attach_role_profile), db: sqlite3.Connection = Depends(get_db)):
    profile = current_user.get("student") or current_user.get("parent") or current_user.get("staff")
    display_name = profile["full_name"] if profile and "full_name" in profile else current_user["username"]

    return {
        "success": True,
        "user": {
            "id": current_user["id"],
            "username": current_user["username"],
            "email": current_user["email"],
            "role": current_user["role"],
            "displayName": display_name,
            "profile": profile
        }
    }

@router.post("/change-password")
def portal_change_password(req: ChangePasswordRequest, current_user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    if not req.old_password or not req.new_password:
        raise HTTPException(status_code=400, detail="Current password and new password are both required.")

    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    user = dict_from_row(db.execute("SELECT password_hash FROM users WHERE id = ?", (current_user["id"],)).fetchone())

    if not verify_password(req.old_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password does not match.")

    new_hash = hash_password(req.new_password)
    db.execute("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_hash, current_user["id"]))

    return {
        "success": True,
        "message": "Password updated successfully. Please use your new password next time."
    }
