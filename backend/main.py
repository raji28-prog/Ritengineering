import os
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend import config
from backend.routers import (
    public,
    admin_auth,
    admin_pages,
    admin_sections,
    admin_navigation,
    admin_custom_fields,
    admin_media,
    admin_announcements,
    admin_settings,
    admin_enquiries,
    portal_auth,
    portal_student,
    portal_parent,
    portal_staff,
    portal_common
)

app = FastAPI(
    title="RITW Dynamic Engineering College Portal & CMS Backend",
    description="High-fidelity REST APIs for RITW Portal & Admin CMS (FastAPI)",
    version="2.0.0-fastapi"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handlers to match Express response shape
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = errors[0].get("msg") if errors else "Validation error"
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": f"Invalid request payload: {msg}",
            "errors": errors
        }
    )

# Static file serving
uploads_path = str(config.PROJECT_ROOT / "uploads")
if os.path.exists(uploads_path):
    app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

# Mount API Routers under /api/v1
app.include_router(public.router, prefix="/api/v1")
app.include_router(admin_auth.router, prefix="/api/v1")
app.include_router(admin_pages.router, prefix="/api/v1")
app.include_router(admin_sections.router, prefix="/api/v1")
app.include_router(admin_navigation.router, prefix="/api/v1")
app.include_router(admin_custom_fields.router, prefix="/api/v1")
app.include_router(admin_media.router, prefix="/api/v1")
app.include_router(admin_announcements.router, prefix="/api/v1")
app.include_router(admin_settings.router, prefix="/api/v1")
app.include_router(admin_enquiries.router, prefix="/api/v1")

app.include_router(portal_auth.router, prefix="/api/v1")
app.include_router(portal_student.router, prefix="/api/v1")
app.include_router(portal_parent.router, prefix="/api/v1")
app.include_router(portal_staff.router, prefix="/api/v1")
app.include_router(portal_common.router, prefix="/api/v1")

# Health Check Endpoint
@app.get("/api/v1/health")
def health_check():
    return {
        "status": "UP",
        "institution": "RITW Engineering College",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "2.0.0-fastapi"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=config.PORT, reload=True)
