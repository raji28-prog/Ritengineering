import time
from datetime import datetime, timedelta, timezone
from typing import Optional, Callable
import sqlite3
import bcrypt
import jwt
from fastapi import Depends, HTTPException, Header, Request, status
from backend import config
from backend.database import get_db, dict_from_row

# In-memory IP rate limiter
_failed_attempts: dict[str, dict] = {}

def check_login_rate_limit(ip: str):
    now = time.time()
    record = _failed_attempts.get(ip)
    if record:
        blocked_until = record.get("blocked_until")
        if blocked_until and now < blocked_until:
            remaining_minutes = max(1, int((blocked_until - now) / 60) + 1)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many failed login attempts. IP temporarily locked. Please try again in {remaining_minutes} minute(s)."
            )
        if now - record.get("first_attempt_time", 0) > config.RATE_LIMIT_LOGIN_WINDOW_SECONDS:
            _failed_attempts.pop(ip, None)

def record_failed_login(ip: str):
    now = time.time()
    record = _failed_attempts.get(ip, {"count": 0, "first_attempt_time": now, "blocked_until": None})
    record["count"] += 1
    if record["count"] >= config.RATE_LIMIT_LOGIN_MAX:
        record["blocked_until"] = now + config.RATE_LIMIT_LOGIN_WINDOW_SECONDS
    _failed_attempts[ip] = record

def clear_failed_login(ip: str):
    _failed_attempts.pop(ip, None)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt(10)
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(hours=config.JWT_EXPIRES_IN_HOURS)
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again."
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization token."
        )

def get_token_from_header(authorization: Optional[str] = Header(None), x_access_token: Optional[str] = Header(None)) -> str:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
    elif x_access_token:
        token = x_access_token.strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. No token provided."
        )
    return token

def get_current_user(token: str = Depends(get_token_from_header), db: sqlite3.Connection = Depends(get_db)) -> dict:
    payload = decode_access_token(token)
    user_id = payload.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization token."
        )

    cursor = db.execute("SELECT id, username, email, role, is_active FROM users WHERE id = ?", (user_id,))
    user = dict_from_row(cursor.fetchone())
    if not user or user.get("is_active") != 1:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not found or inactive."
        )
    return user

def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden. Administrator privileges required."
        )
    return current_user

def require_role(*roles: str) -> Callable:
    def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role")
        if user_role not in roles and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Authorized roles for this endpoint: [{', '.join(roles)}]. Your current role is: '{user_role}'."
            )
        return current_user
    return role_checker

def attach_role_profile(current_user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)) -> dict:
    user_role = current_user.get("role")
    user_id = current_user.get("id")
    profile = None

    if user_role == "student":
        cursor = db.execute("SELECT * FROM students WHERE user_id = ?", (user_id,))
        profile = dict_from_row(cursor.fetchone())
        if not profile and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student record not found for this user account."
            )
        current_user["student"] = profile
    elif user_role == "parent":
        cursor = db.execute("SELECT * FROM parents WHERE user_id = ?", (user_id,))
        profile = dict_from_row(cursor.fetchone())
        if not profile and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent record not found for this user account."
            )
        current_user["parent"] = profile
    elif user_role == "staff":
        cursor = db.execute("SELECT * FROM staff WHERE user_id = ?", (user_id,))
        profile = dict_from_row(cursor.fetchone())
        if not profile and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff record not found for this user account."
            )
        current_user["staff"] = profile

    return current_user
