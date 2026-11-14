import sqlite3
from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_db, dicts_from_rows
from backend.auth import require_admin
from backend.models.schemas import EnquiryStatusUpdate

router = APIRouter(prefix="/admin/enquiries", tags=["Admin Enquiries"])

@router.get("")
def list_enquiries(current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("SELECT * FROM admission_enquiries ORDER BY id DESC LIMIT 100").fetchall()
    return {
        "success": True,
        "enquiries": dicts_from_rows(rows)
    }

@router.put("/{enquiry_id}/status")
def update_enquiry_status(enquiry_id: int, req: EnquiryStatusUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    if req.status not in ["new", "contacted", "closed"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'new', 'contacted', or 'closed'.")

    db.execute("UPDATE admission_enquiries SET status = ? WHERE id = ?", (req.status, enquiry_id))
    return {
        "success": True,
        "message": "Enquiry status updated"
    }
