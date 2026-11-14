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
    require_admin
)
from backend.models.schemas import LoginRequest, ChangePasswordRequest

router = APIRouter(prefix="/admin/auth", tags=["Admin Auth"])

@router.post("/login")
def admin_login(req: LoginRequest, request: Request, db: sqlite3.Connection = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    check_login_rate_limit(ip)

    username = req.username.strip()
    password = req.password

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required.")

    user = dict_from_row(db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone())

    if not user:
        record_failed_login(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your user ID and password."
        )

    if user.get("is_active") != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact the administrator."
        )

    if not verify_password(password, user["password_hash"]):
        record_failed_login(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your user ID and password."
        )

    clear_failed_login(ip)

    # Update last login
    db.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (user["id"],))

    # Record audit log
    db.execute("""
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, 'LOGIN', 'user', ?, 'Successful admin authentication', ?)
    """, (user["id"], user["id"], ip))

    token = create_access_token({"id": user["id"], "username": user["username"], "role": user["role"]})

    return {
        "success": True,
        "message": "Authentication successful.",
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@router.get("/me")
def admin_get_me(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "user": current_user
    }

@router.post("/change-password")
def admin_change_password(req: ChangePasswordRequest, request: Request, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    if not req.old_password or not req.new_password:
        raise HTTPException(status_code=400, detail="Both current password and new password are required.")

    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    user = dict_from_row(db.execute("SELECT password_hash FROM users WHERE id = ?", (current_user["id"],)).fetchone())

    if not verify_password(req.old_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password does not match.")

    new_hash = hash_password(req.new_password)
    db.execute("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_hash, current_user["id"]))

    ip = request.client.host if request.client else "unknown"
    db.execute("""
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, 'CHANGE_PASSWORD', 'user', ?, 'Admin password updated', ?)
    """, (current_user["id"], current_user["id"], ip))

    return {
        "success": True,
        "message": "Password updated successfully. Please use your new password on next login."
    }

@router.post("/logout")
def admin_logout(request: Request, current_user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    db.execute("""
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, 'LOGOUT', 'user', ?, 'Admin logged out', ?)
    """, (current_user["id"], current_user["id"], ip))

    return {
        "success": True,
        "message": "Logged out successfully."
    }
