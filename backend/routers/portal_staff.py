import sqlite3
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_role, attach_role_profile
from backend.models.schemas import AttendanceMarkRequest, MarksRecord, AssignmentCreateRequest

router = APIRouter(prefix="/portal/staff", tags=["Portal Staff"])

def get_current_staff(current_user: dict = Depends(require_role("staff")), enriched: dict = Depends(attach_role_profile)) -> dict:
    staff = enriched.get("staff")
    if not staff:
        raise HTTPException(status_code=404, detail="Staff record not found.")
    return staff

def check_staff_assignment(db: sqlite3.Connection, staff_id: int, department: str, semester: str, section: str, subject_code: Optional[str] = None) -> dict | None:
    query = """
        SELECT * FROM staff_assignments 
        WHERE staff_id = ? AND department = ? AND semester = ? AND section = ?
    """
    params = [staff_id, department, semester, section]
    if subject_code:
        query += " AND subject_code = ?"
        params.append(subject_code)

    return dict_from_row(db.execute(query, params).fetchone())

def calculate_grade(obtained: float, max_marks: float) -> tuple[str, str]:
    if max_marks <= 0:
        return "N/A", "Pass"
    pct = (obtained / max_marks) * 100
    if pct >= 90:
        return "O", "Pass"
    if pct >= 80:
        return "A+", "Pass"
    if pct >= 70:
        return "A", "Pass"
    if pct >= 60:
        return "B+", "Pass"
    if pct >= 50:
        return "B", "Pass"
    if pct >= 40:
        return "C", "Pass"
    return "F", "Fail"

@router.get("/profile")
def get_staff_profile(staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    c_row = db.execute("SELECT COUNT(*) as c FROM staff_assignments WHERE staff_id = ?", (staff["id"],)).fetchone()
    count = c_row["c"] if c_row else 0
    return {
        "success": True,
        "data": {
            **staff,
            "active_assignments_count": count
        }
    }

@router.get("/classes")
def get_staff_classes(staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT 
            id, department, semester, section, subject_code, subject_name,
            academic_year, role_in_class, created_at
        FROM staff_assignments
        WHERE staff_id = ?
        ORDER BY department ASC, semester ASC, section ASC
    """, (staff["id"],)).fetchall()
    assignments = dicts_from_rows(rows)

    enhanced = []
    for a in assignments:
        cnt_row = db.execute("""
            SELECT COUNT(*) as student_count 
            FROM students 
            WHERE department = ? AND semester = ? AND section = ?
        """, (a["department"], a["semester"], a["section"])).fetchone()
        scount = cnt_row["student_count"] if cnt_row else 0
        enhanced.append({
            **a,
            "student_count": scount
        })

    return {
        "success": True,
        "data": enhanced
    }

@router.get("/timetable")
def get_staff_timetable(staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT 
            id, department, semester, section, day_of_week, start_time, end_time,
            subject_code, subject_name, room_number
        FROM student_timetable
        WHERE staff_id = ?
        ORDER BY 
            CASE day_of_week 
                WHEN 'Monday' THEN 1 
                WHEN 'Tuesday' THEN 2 
                WHEN 'Wednesday' THEN 3 
                WHEN 'Thursday' THEN 4 
                WHEN 'Friday' THEN 5 
                WHEN 'Saturday' THEN 6 
                ELSE 7 
            END,
            start_time ASC
    """, (staff["id"],)).fetchall()
    timetable = dicts_from_rows(rows)

    by_day = {"Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": []}
    for item in timetable:
        day = item.get("day_of_week")
        if day in by_day:
            by_day[day].append(item)

    return {
        "success": True,
        "data": {
            "byDay": by_day,
            "all": timetable
        }
    }

@router.get("/attendance/tasks")
def get_attendance_tasks(staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    today_name = datetime.now(timezone.utc).strftime("%A")
    today_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    periods = db.execute("""
        SELECT 
            t.department, t.semester, t.section, t.subject_code, t.subject_name,
            t.start_time, t.end_time, t.room_number
        FROM student_timetable t
        WHERE t.staff_id = ? AND t.day_of_week = ?
        ORDER BY t.start_time ASC
    """, (staff["id"], today_name)).fetchall()

    tasks = []
    for p in periods:
        marked_row = db.execute("""
            SELECT COUNT(*) as count 
            FROM student_attendance 
            WHERE staff_id = ? AND subject_code = ? AND date = ?
        """, (staff["id"], p["subject_code"], today_date)).fetchone()
        is_marked = marked_row["count"] > 0 if marked_row else False

        tasks.append({
            **dict(p),
            "is_marked": is_marked,
            "date": today_date
        })

    return {
        "success": True,
        "today": today_name,
        "date": today_date,
        "tasks": tasks
    }

@router.get("/attendance/class")
def get_class_attendance_sheet(
    department: str = Query(...),
    semester: str = Query(...),
    section: str = Query(...),
    subject_code: str = Query(...),
    date: Optional[str] = Query(None),
    staff: dict = Depends(get_current_staff),
    db: sqlite3.Connection = Depends(get_db)
):
    assignment = check_staff_assignment(db, staff["id"], department, semester, section, subject_code)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: You are not authorized to manage attendance for {subject_code} in {department} ({semester} - {section})."
        )

    target_date = date or datetime.now(timezone.utc).strftime("%Y-%m-%d")

    students = db.execute("""
        SELECT 
            s.id as student_id, s.roll_number, s.full_name, s.avatar_url,
            att.status as attendance_status, att.remarks as attendance_remarks
        FROM students s
        LEFT JOIN student_attendance att ON att.student_id = s.id 
            AND att.subject_code = ? 
            AND att.date = ?
        WHERE s.department = ? AND s.semester = ? AND s.section = ?
        ORDER BY s.roll_number ASC
    """, (subject_code, target_date, department, semester, section)).fetchall()

    return {
        "success": True,
        "class_info": {
            "department": department,
            "semester": semester,
            "section": section,
            "subject_code": subject_code,
            "subject_name": assignment["subject_name"],
            "date": target_date
        },
        "students": dicts_from_rows(students)
    }

@router.post("/attendance/mark")
def mark_class_attendance(req: AttendanceMarkRequest, staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    assignment = check_staff_assignment(db, staff["id"], req.department, req.semester, req.section, req.subject_code)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: You are not authorized to submit attendance for {req.subject_code} in {req.department} ({req.semester} - {req.section})."
        )

    marked_count = 0
    for item in req.records:
        valid = db.execute("""
            SELECT id FROM students WHERE id = ? AND department = ? AND semester = ? AND section = ?
        """, (item.student_id, req.department, req.semester, req.section)).fetchone()
        if not valid:
            continue

        status_val = item.status or "Present"
        remarks_val = item.remarks

        db.execute("DELETE FROM student_attendance WHERE student_id = ? AND subject_code = ? AND date = ?", (item.student_id, req.subject_code, req.date))
        db.execute("""
            INSERT INTO student_attendance (
                student_id, subject_code, subject_name, staff_id, date, time_slot, status, remarks
            ) VALUES (?, ?, ?, ?, ?, '09:30 AM', ?, ?)
        """, (item.student_id, req.subject_code, assignment["subject_name"], staff["id"], req.date, status_val, remarks_val))
        marked_count += 1

        stats_row = dict_from_row(db.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1 ELSE 0 END) as attended
            FROM student_attendance WHERE student_id = ?
        """, (item.student_id,)).fetchone())

        if stats_row and stats_row["total"] > 0:
            pct = round((stats_row["attended"] / stats_row["total"]) * 100, 1)
            db.execute("UPDATE students SET attendance_percentage = ? WHERE id = ?", (pct, item.student_id))

    return {
        "success": True,
        "message": f"Attendance marked successfully for {marked_count} students.",
        "date": req.date,
        "subject_code": req.subject_code
    }

@router.get("/academics/students")
def get_students_for_marks(
    department: str = Query(...),
    semester: str = Query(...),
    section: str = Query(...),
    subject_code: str = Query(...),
    exam_type: Optional[str] = Query("Mid-1"),
    staff: dict = Depends(get_current_staff),
    db: sqlite3.Connection = Depends(get_db)
):
    assignment = check_staff_assignment(db, staff["id"], department, semester, section, subject_code)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: You are not authorized to view academic marks for {subject_code} in {department} ({semester} - {section})."
        )

    target_exam = exam_type or "Mid-1"

    students = db.execute("""
        SELECT 
            s.id as student_id, s.roll_number, s.full_name, s.cgpa,
            m.id as mark_id, m.exam_type, m.max_marks, m.marks_obtained,
            m.grade, m.status as mark_status, m.remarks
        FROM students s
        LEFT JOIN student_marks m ON m.student_id = s.id 
            AND m.subject_code = ? 
            AND m.exam_type = ?
        WHERE s.department = ? AND s.semester = ? AND s.section = ?
        ORDER BY s.roll_number ASC
    """, (subject_code, target_exam, department, semester, section)).fetchall()

    return {
        "success": True,
        "class_info": {
            "department": department,
            "semester": semester,
            "section": section,
            "subject_code": subject_code,
            "subject_name": assignment["subject_name"],
            "exam_type": target_exam
        },
        "students": dicts_from_rows(students)
    }

@router.post("/academics/marks")
def record_students_marks(
    payload: dict,
    staff: dict = Depends(get_current_staff),
    db: sqlite3.Connection = Depends(get_db)
):
    department = payload.get("department")
    semester = payload.get("semester")
    section = payload.get("section")
    subject_code = payload.get("subject_code")
    exam_type = payload.get("exam_type")
    max_marks = float(payload.get("max_marks", 30))
    records = payload.get("records", [])

    if not department or not semester or not section or not subject_code or not exam_type or not isinstance(records, list):
        raise HTTPException(status_code=400, detail="Department, semester, section, subject_code, exam_type, and records array are required.")

    assignment = check_staff_assignment(db, staff["id"], department, semester, section, subject_code)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: You are not authorized to record marks for {subject_code} in {department} ({semester} - {section})."
        )

    saved_count = 0
    for r in records:
        student_id = int(r.get("student_id", 0))
        valid = db.execute("SELECT id FROM students WHERE id = ? AND department = ? AND semester = ? AND section = ?", (student_id, department, semester, section)).fetchone()
        if not valid:
            continue

        try:
            obtained = float(r.get("marks_obtained"))
        except (ValueError, TypeError):
            continue

        grade, status_val = calculate_grade(obtained, max_marks)

        db.execute("DELETE FROM student_marks WHERE student_id = ? AND subject_code = ? AND exam_type = ?", (student_id, subject_code, exam_type))
        db.execute("""
            INSERT INTO student_marks (
                student_id, subject_code, subject_name, semester, exam_type,
                max_marks, marks_obtained, grade, status, academic_year,
                evaluated_by_staff_id, remarks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            student_id, subject_code, assignment["subject_name"], semester, exam_type,
            max_marks, obtained, grade, status_val, assignment.get("academic_year", "2025-2026"),
            staff["id"], r.get("remarks")
        ))
        saved_count += 1

    return {
        "success": True,
        "message": f"Successfully evaluated and saved marks for {saved_count} students.",
        "subject_code": subject_code,
        "exam_type": exam_type
    }

@router.get("/assignments")
def get_staff_assignments(staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT 
            a.id, a.department, a.semester, a.section, a.subject_code, a.subject_name,
            a.title, a.description, a.due_date, a.max_marks, a.created_at,
            (SELECT COUNT(*) FROM student_assignment_submissions WHERE assignment_id = a.id) as submissions_count
        FROM student_assignments a
        WHERE a.staff_id = ?
        ORDER BY a.created_at DESC
    """, (staff["id"],)).fetchall()

    return {
        "success": True,
        "data": dicts_from_rows(rows)
    }

@router.post("/assignments", status_code=status.HTTP_201_CREATED)
def create_staff_assignment(req: AssignmentCreateRequest, staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    assignment = check_staff_assignment(db, staff["id"], req.department, req.semester, req.section, req.subject_code)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You cannot create assignments for classes you are not assigned to."
        )

    cursor = db.execute("""
        INSERT INTO student_assignments (
            staff_id, department, semester, section, subject_code, subject_name,
            title, description, due_date, max_marks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        staff["id"], req.department, req.semester, req.section, req.subject_code, assignment["subject_name"],
        req.title.strip(), req.description, req.due_date, req.max_marks or 10
    ))

    return {
        "success": True,
        "message": "Assignment published to student portal successfully!",
        "id": cursor.lastrowid
    }

@router.get("/announcements")
def get_staff_announcements(staff: dict = Depends(get_current_staff), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT id, title, content, category, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE target_audience IN ('all', 'staff')
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
            posted_date DESC
    """).fetchall()

    return {
        "success": True,
        "data": dicts_from_rows(rows)
    }
