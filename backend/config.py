import os
from pathlib import Path
from dotenv import load_dotenv

# Resolve project root (parent directory of backend)
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

# Load .env from project root if it exists
load_dotenv(PROJECT_ROOT / ".env")

PORT = int(os.getenv("FASTAPI_PORT", "8000"))
JWT_SECRET = os.getenv("JWT_SECRET", "ritw_engineering_college_secure_jwt_token_key_2026_super_secret")
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_IN_HOURS = 2

DB_PATH = os.getenv("DB_PATH", str(PROJECT_ROOT / "server" / "db" / "ritw_cms.sqlite"))
if not os.path.isabs(DB_PATH):
    DB_PATH = str(PROJECT_ROOT / DB_PATH)

UPLOAD_DIR = str(PROJECT_ROOT / "uploads" / "media")
SPOTLIGHT_DIR = str(PROJECT_ROOT / "uploads" / "spotlight")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "application/pdf",
}

RATE_LIMIT_LOGIN_MAX = 5
RATE_LIMIT_LOGIN_WINDOW_SECONDS = 15 * 60
