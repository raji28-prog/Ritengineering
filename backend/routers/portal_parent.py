import sqlite3
from fastapi import APIRouter, Depends, HTTPException, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_role, attach_role_profile

router = APIRouter(prefix="/portal/parent", tags=["Portal Parent"])

def get_current_parent(current_user: dict = Depends(require_role("parent")), enriched: dict = Depends(attach_role_profile)) -> dict:
    parent = enriched.get("parent")
    if not parent:
        raise HTTPException(status_code=404, detail="Parent record not found.")
    return parent

def verify_child_access(student_id: int, parent: dict = Depends(get_current_parent), db: sqlite3.Connection = Depends(get_db)) -> dict:
    mapping = dict_from_row(db.execute("""
        SELECT m.id, m.relation, m.is_verified, s.full_name, s.roll_number
        FROM parent_student_mappings m
        JOIN students s ON m.student_id = s.id
        WHERE m.parent_id = ? AND m.student_id = ? AND m.is_verified = 1
    """, (parent["id"], student_id)).fetchone())

    if not mapping:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have verified authorization to access this student’s academic records."
        )
    return mapping

@router.get("/children")
def list_children(parent: dict = Depends(get_current_parent), db: sqlite3.Connection = Depends(get_db)):
    parent_id = parent["id"]
    rows = db.execute("""
        SELECT 
            s.id, s.roll_number, s.full_name, s.department, s.degree,
            s.batch_year, s.semester, s.section, s.avatar_url, s.cgpa,
            s.attendance_percentage, s.dob, s.blood_group,
            m.relation, m.is_verified, m.verified_at
        FROM parent_student_mappings m
        JOIN students s ON m.student_id = s.id
        WHERE m.parent_id = ? AND m.is_verified = 1
        ORDER BY s.full_name ASC
    """, (parent_id,)).fetchall()
    children = dicts_from_rows(rows)

    enhanced = []
    for child in children:
        cid = child["id"]
        att_row = dict_from_row(db.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1 ELSE 0 END) as attended
            FROM student_attendance WHERE student_id = ?
        """, (cid,)).fetchone())

        fee_row = dict_from_row(db.execute("""
            SELECT 
                SUM(total_amount) as total_fee,
                SUM(paid_amount) as total_paid,
                SUM(due_amount) as total_due
            FROM student_fees WHERE student_id = ?
        """, (cid,)).fetchone())

        total = att_row["total"] if att_row else 0
        attended = att_row["attended"] if att_row and att_row["attended"] else 0
        live_att = round((attended / total) * 100, 1) if total > 0 else child.get("attendance_percentage", 0.0)

        total_fee = fee_row["total_fee"] if fee_row and fee_row["total_fee"] else 0
        total_paid = fee_row["total_paid"] if fee_row and fee_row["total_paid"] else 0
        total_due = fee_row["total_due"] if fee_row and fee_row["total_due"] else 0

        enhanced.append({
            **child,
            "live_attendance": live_att,
            "total_classes": total,
            "attended_classes": attended,
            "fee_summary": {
                "total_fee": total_fee,
                "total_paid": total_paid,
                "total_due": total_due,
                "is_clear": total_due == 0
            }
        })

    return {
        "success": True,
        "count": len(enhanced),
        "parent": {
            "id": parent["id"],
            "full_name": parent["full_name"],
            "parent_code": parent["parent_code"],
            "relation": parent.get("relation", "Parent")
        },
        "children": enhanced
    }

@router.get("/child/{student_id}/profile")
def get_child_profile(student_id: int, verified: dict = Depends(verify_child_access), db: sqlite3.Connection = Depends(get_db)):
    student = dict_from_row(db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone())
    return {
        "success": True,
        "data": {
            **student,
            "verified_relation": verified["relation"]
        }
    }

@router.get("/child/{student_id}/attendance")
def get_child_attendance(student_id: int, verified: dict = Depends(verify_child_access), db: sqlite3.Connection = Depends(get_db)):
    sub_rows = db.execute("""
        SELECT 
            subject_code,
            subject_name,
            COUNT(*) as total_classes,
            SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1 ELSE 0 END) as attended,
            SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent,
            ROUND((SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1.0 ELSE 0.0 END) / COUNT(*)) * 100, 1) as percentage
        FROM student_attendance
        WHERE student_id = ?
        GROUP BY subject_code, subject_name
        ORDER BY subject_code ASC
    """, (student_id,)).fetchall()
    subjects = dicts_from_rows(sub_rows)

    logs_rows = db.execute("""
        SELECT id, subject_code, subject_name, date, time_slot, status, remarks
        FROM student_attendance
        WHERE student_id = ?
        ORDER BY date DESC, id DESC
        LIMIT 50
    """, (student_id,)).fetchall()
    logs = dicts_from_rows(logs_rows)

    total_held = sum(s["total_classes"] for s in subjects)
    total_attended = sum(s["attended"] for s in subjects)
    overall_pct = round((total_attended / total_held) * 100, 1) if total_held > 0 else 0.0

    return {
        "success": True,
        "student_name": verified["full_name"],
        "roll_number": verified["roll_number"],
        "data": {
            "overall_percentage": overall_pct,
            "total_classes": total_held,
            "total_attended": total_attended,
            "subjects": subjects,
            "logs": logs
        }
    }

@router.get("/child/{student_id}/marks")
def get_child_marks(student_id: int, verified: dict = Depends(verify_child_access), db: sqlite3.Connection = Depends(get_db)):
    marks_rows = db.execute("""
        SELECT 
            m.id, m.subject_code, m.subject_name, m.semester, m.exam_type,
            m.max_marks, m.marks_obtained, m.grade, m.status, m.academic_year,
            m.remarks, s.full_name as evaluated_by
        FROM student_marks m
        LEFT JOIN staff s ON m.evaluated_by_staff_id = s.id
        WHERE m.student_id = ?
        ORDER BY m.semester DESC, m.exam_type ASC, m.subject_code ASC
    """, (student_id,)).fetchall()
    records = dicts_from_rows(marks_rows)

    student = dict_from_row(db.execute("SELECT cgpa FROM students WHERE id = ?", (student_id,)).fetchone())

    grouped = {}
    for r in records:
        sem = r["semester"]
        etype = r["exam_type"]
        if sem not in grouped:
            grouped[sem] = {}
        if etype not in grouped[sem]:
            grouped[sem][etype] = []
        grouped[sem][etype].append(r)

    return {
        "success": True,
        "student_name": verified["full_name"],
        "roll_number": verified["roll_number"],
        "data": {
            "cgpa": student["cgpa"] if student else None,
            "records": records,
            "grouped": grouped
        }
    }

@router.get("/child/{student_id}/academics")
def get_child_academics(student_id: int, verified: dict = Depends(verify_child_access), db: sqlite3.Connection = Depends(get_db)):
    student = dict_from_row(db.execute("SELECT department, semester, section FROM students WHERE id = ?", (student_id,)).fetchone())

    tt_rows = db.execute("""
        SELECT 
            t.day_of_week, t.start_time, t.end_time, t.subject_code, t.subject_name,
            t.room_number, s.full_name as faculty_name
        FROM student_timetable t
        LEFT JOIN staff s ON t.staff_id = s.id
        WHERE t.department = ? AND t.semester = ? AND t.section = ?
        ORDER BY 
            CASE t.day_of_week 
                WHEN 'Monday' THEN 1 
                WHEN 'Tuesday' THEN 2 
                WHEN 'Wednesday' THEN 3 
                WHEN 'Thursday' THEN 4 
                WHEN 'Friday' THEN 5 
                WHEN 'Saturday' THEN 6 
                ELSE 7 
            END,
            t.start_time ASC
    """, (student["department"], student["semester"], student["section"])).fetchall()

    assign_rows = db.execute("""
        SELECT 
            a.id, a.subject_name, a.title, a.due_date, a.max_marks,
            sub.status as submission_status, sub.marks_awarded, sub.feedback
        FROM student_assignments a
        LEFT JOIN student_assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ?
        WHERE a.department = ? AND a.semester = ? AND a.section = ?
        ORDER BY a.due_date DESC
    """, (student_id, student["department"], student["semester"], student["section"])).fetchall()

    return {
        "success": True,
        "student_name": verified["full_name"],
        "data": {
            "class": f"{student['department']} ({student['semester']} - Section {student['section']})",
            "timetable": dicts_from_rows(tt_rows),
            "assignments": dicts_from_rows(assign_rows)
        }
    }

@router.get("/child/{student_id}/fees")
def get_child_fees(student_id: int, verified: dict = Depends(verify_child_access), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT 
            id, academic_year, fee_type, total_amount, paid_amount,
            due_amount, due_date, payment_status, last_payment_date,
            receipt_number, payment_mode
        FROM student_fees
        WHERE student_id = ?
        ORDER BY id ASC
    """, (student_id,)).fetchall()
    fees = dicts_from_rows(rows)

    total_fee = sum(f["total_amount"] for f in fees)
    total_paid = sum(f["paid_amount"] for f in fees)
    total_due = sum(f["due_amount"] for f in fees)

    return {
        "success": True,
        "student_name": verified["full_name"],
        "roll_number": verified["roll_number"],
        "data": {
            "summary": {
                "total_fee": total_fee,
                "total_paid": total_paid,
                "total_due": total_due,
                "is_all_clear": total_due == 0
            },
            "items": fees
        }
    }

@router.get("/announcements")
def get_parent_announcements(parent: dict = Depends(get_current_parent), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT id, title, content, category, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE target_audience IN ('all', 'parents')
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
            posted_date DESC
    """).fetchall()

    return {
        "success": True,
        "data": dicts_from_rows(rows)
    }
