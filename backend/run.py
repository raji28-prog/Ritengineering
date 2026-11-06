import uvicorn
from backend import config

if __name__ == "__main__":
    print(f"\n======================================================")
    print(f"  RITW College Portal & CMS - Python FastAPI Backend")
    print(f"  Port:          {config.PORT} (http://localhost:{config.PORT})")
    print(f"  API Docs:      http://localhost:{config.PORT}/docs")
    print(f"  Health Check:  http://localhost:{config.PORT}/api/v1/health")
    print(f"  Database:      {config.DB_PATH}")
    print(f"======================================================\n")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=config.PORT, reload=True)
