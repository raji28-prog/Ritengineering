import sqlite3
from fastapi import APIRouter, Depends, HTTPException, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_role, attach_role_profile
from backend.models.schemas import AssignmentSubmitRequest

router = APIRouter(prefix="/portal/student", tags=["Portal Student"])

def get_current_student(current_user: dict = Depends(require_role("student")), enriched: dict = Depends(attach_role_profile)) -> dict:
    student = enriched.get("student")
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found.")
    return student

@router.get("/profile")
def get_student_profile(student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    att_stats = dict_from_row(db.execute("""
        SELECT 
            COUNT(*) as total_classes,
            SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1 ELSE 0 END) as attended_classes
        FROM student_attendance
        WHERE student_id = ?
    """, (student["id"],)).fetchone())

    total_classes = att_stats["total_classes"] if att_stats else 0
    attended_classes = att_stats["attended_classes"] if att_stats and att_stats["attended_classes"] else 0

    calculated_attendance = (
        round((attended_classes / total_classes) * 100, 1)
        if total_classes > 0
        else student.get("attendance_percentage", 0.0)
    )

    return {
        "success": True,
        "data": {
            **student,
            "calculated_attendance": calculated_attendance,
            "total_classes": total_classes,
            "attended_classes": attended_classes
        }
    }

@router.get("/attendance")
def get_student_attendance(student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    student_id = student["id"]

    subject_rows = db.execute("""
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
    subjects = dicts_from_rows(subject_rows)

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
    overall_pct = (
        round((total_attended / total_held) * 100, 1)
        if total_held > 0
        else student.get("attendance_percentage", 0.0)
    )

    return {
        "success": True,
        "data": {
            "overall_percentage": overall_pct,
            "total_classes": total_held,
            "total_attended": total_attended,
            "subjects": subjects,
            "logs": logs
        }
    }

@router.get("/marks")
def get_student_marks(student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    student_id = student["id"]

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
        "data": {
            "cgpa": student.get("cgpa", 0.0),
            "records": records,
            "grouped": grouped
        }
    }

@router.get("/timetable")
def get_student_timetable(student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    dept = student["department"]
    sem = student["semester"]
    sec = student["section"]

    rows = db.execute("""
        SELECT 
            t.id, t.day_of_week, t.start_time, t.end_time,
            t.subject_code, t.subject_name, t.room_number,
            s.full_name as faculty_name
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
    """, (dept, sem, sec)).fetchall()
    schedule = dicts_from_rows(rows)

    by_day = {
        "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": []
    }
    for item in schedule:
        day = item.get("day_of_week")
        if day in by_day:
            by_day[day].append(item)

    return {
        "success": True,
        "data": {
            "department": dept,
            "semester": sem,
            "section": sec,
            "byDay": by_day,
            "all": schedule
        }
    }

@router.get("/assignments")
def get_student_assignments(student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    student_id = student["id"]
    dept = student["department"]
    sem = student["semester"]
    sec = student["section"]

    rows = db.execute("""
        SELECT 
            a.id, a.subject_code, a.subject_name, a.title, a.description,
            a.due_date, a.max_marks, a.created_at,
            s.full_name as faculty_name,
            sub.id as submission_id,
            sub.submitted_at,
            sub.submission_content,
            sub.marks_awarded,
            sub.feedback,
            sub.status as submission_status
        FROM student_assignments a
        JOIN staff s ON a.staff_id = s.id
        LEFT JOIN student_assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ?
        WHERE a.department = ? AND a.semester = ? AND a.section = ?
        ORDER BY a.due_date ASC
    """, (student_id, dept, sem, sec)).fetchall()

    return {
        "success": True,
        "data": dicts_from_rows(rows)
    }

@router.post("/assignments/{assignment_id}/submit")
def submit_assignment(assignment_id: int, req: AssignmentSubmitRequest, student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    content = req.submission_content.strip() if req.submission_content else ""
    if not content:
        raise HTTPException(status_code=400, detail="Submission content or link is required.")

    assignment = db.execute("""
        SELECT id FROM student_assignments 
        WHERE id = ? AND department = ? AND semester = ? AND section = ?
    """, (assignment_id, student["department"], student["semester"], student["section"])).fetchone()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found or not assigned to your section.")

    db.execute("""
        INSERT INTO student_assignment_submissions (
            assignment_id, student_id, submitted_at, submission_content, status
        ) VALUES (?, ?, CURRENT_TIMESTAMP, ?, 'Submitted')
        ON CONFLICT(assignment_id, student_id) DO UPDATE SET
            submitted_at = CURRENT_TIMESTAMP,
            submission_content = excluded.submission_content,
            status = 'Submitted'
    """, (assignment_id, student["id"], content))

    return {
        "success": True,
        "message": "Assignment submitted successfully!"
    }

@router.get("/fees")
def get_student_fees(student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    student_id = student["id"]
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
def get_student_announcements(student: dict = Depends(get_current_student), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT id, title, content, category, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE target_audience IN ('all', 'students')
          AND (department = 'all' OR department = ?)
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
            posted_date DESC
    """, (student["department"],)).fetchall()

    return {
        "success": True,
        "data": dicts_from_rows(rows)
    }
