/**
 * RITW Campus Portal - Staff / Faculty Routes
 * Enforces staff class assignment authorization; staff can only view and manage
 * attendance, marks, and student records for classes they are explicitly assigned to.
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireRole, attachRoleProfile } = require('../middleware/auth');

const router = express.Router();

// Apply authentication, staff role requirement, and profile attachment
router.use(authenticate, requireRole('staff'), attachRoleProfile);

/**
 * Helper: Verify that the staff member is assigned to teach this class/subject
 */
function checkStaffAssignment(staffId, department, semester, section, subjectCode = null) {
    let sql = `
        SELECT * FROM staff_assignments 
        WHERE staff_id = ? AND department = ? AND semester = ? AND section = ?
    `;
    const params = [staffId, department, semester, section];
    if (subjectCode) {
        sql += ` AND subject_code = ?`;
        params.push(subjectCode);
    }
    return db.prepare(sql).get(...params);
}

/**
 * Helper: Compute letter grade from marks
 */
function calculateGrade(obtained, max) {
    if (max <= 0) return { grade: 'N/A', status: 'Pass' };
    const pct = (obtained / max) * 100;
    if (pct >= 90) return { grade: 'O', status: 'Pass' };
    if (pct >= 80) return { grade: 'A+', status: 'Pass' };
    if (pct >= 70) return { grade: 'A', status: 'Pass' };
    if (pct >= 60) return { grade: 'B+', status: 'Pass' };
    if (pct >= 50) return { grade: 'B', status: 'Pass' };
    if (pct >= 40) return { grade: 'C', status: 'Pass' };
    return { grade: 'F', status: 'Fail' };
}

/**
 * GET /api/v1/portal/staff/profile
 */
router.get('/profile', (req, res) => {
    const staff = req.staff;
    const assignmentsCount = db.prepare('SELECT COUNT(*) as c FROM staff_assignments WHERE staff_id = ?').get(staff.id).c;

    res.json({
        success: true,
        data: {
            ...staff,
            active_assignments_count: assignmentsCount
        }
    });
});

/**
 * GET /api/v1/portal/staff/classes
 * Returns assigned classes, subjects, and roles for this faculty member
 */
router.get('/classes', (req, res) => {
    const staffId = req.staff.id;

    const assignments = db.prepare(`
        SELECT 
            id, department, semester, section, subject_code, subject_name,
            academic_year, role_in_class, created_at
        FROM staff_assignments
        WHERE staff_id = ?
        ORDER BY department ASC, semester ASC, section ASC
    `).all(staffId);

    // Attach student headcount for each class
    const enhanced = assignments.map(a => {
        const count = db.prepare(`
            SELECT COUNT(*) as student_count 
            FROM students 
            WHERE department = ? AND semester = ? AND section = ?
        `).get(a.department, a.semester, a.section).student_count;

        return {
            ...a,
            student_count: count
        };
    });

    res.json({
        success: true,
        data: enhanced
    });
});

/**
 * GET /api/v1/portal/staff/timetable
 * Returns weekly teaching schedule for this staff member
 */
router.get('/timetable', (req, res) => {
    const staffId = req.staff.id;

    const schedule = db.prepare(`
        SELECT 
            id, department, semester, section, day_of_week, start_time,
            end_time, subject_code, subject_name, room_number
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
    `).all(staffId);

    const byDay = {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: []
    };
    for (const item of schedule) {
        if (byDay[item.day_of_week]) {
            byDay[item.day_of_week].push(item);
        }
    }

    res.json({
        success: true,
        data: {
            byDay,
            all: schedule
        }
    });
});

/**
 * GET /api/v1/portal/staff/attendance/tasks
 * Returns assigned classes and recent attendance tracking overview
 */
router.get('/attendance/tasks', (req, res) => {
    const staffId = req.staff.id;

    const classes = db.prepare(`
        SELECT 
            a.id, a.department, a.semester, a.section, a.subject_code, a.subject_name
        FROM staff_assignments a
        WHERE a.staff_id = ?
    `).all(staffId);

    const result = classes.map(cls => {
        const studentCount = db.prepare(`
            SELECT COUNT(*) as c FROM students 
            WHERE department = ? AND semester = ? AND section = ?
        `).get(cls.department, cls.semester, cls.section).c;

        const latestRecord = db.prepare(`
            SELECT date, COUNT(*) as count 
            FROM student_attendance 
            WHERE subject_code = ? AND staff_id = ?
            GROUP BY date 
            ORDER BY date DESC LIMIT 1
        `).get(cls.subject_code, staffId);

        return {
            ...cls,
            student_count: studentCount,
            last_recorded_date: latestRecord ? latestRecord.date : null
        };
    });

    res.json({
        success: true,
        data: result
    });
});

/**
 * GET /api/v1/portal/staff/attendance/class
 * Query params: department, semester, section, subject_code, date
 * Checks authorization: Must be assigned to this class!
 */
router.get('/attendance/class', (req, res) => {
    const staffId = req.staff.id;
    const { department, semester, section, subject_code, date } = req.query;

    if (!department || !semester || !section || !subject_code) {
        return res.status(400).json({
            success: false,
            message: 'Department, semester, section, and subject_code are required query parameters.'
        });
    }

    // STRICT AUTHORIZATION CHECK
    const isAssigned = checkStaffAssignment(staffId, department, semester, section, subject_code);
    if (!isAssigned) {
        return res.status(403).json({
            success: false,
            message: `Access denied: You are not authorized to manage attendance for ${subject_code} in ${department} (${semester} - ${section}).`
        });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    // Get all students enrolled in this class
    const students = db.prepare(`
        SELECT 
            s.id as student_id, s.roll_number, s.full_name, s.avatar_url,
            att.status as attendance_status, att.remarks as attendance_remarks
        FROM students s
        LEFT JOIN student_attendance att ON att.student_id = s.id 
            AND att.subject_code = ? 
            AND att.date = ?
        WHERE s.department = ? AND s.semester = ? AND s.section = ?
        ORDER BY s.roll_number ASC
    `).all(subject_code, targetDate, department, semester, section);

    res.json({
        success: true,
        class_info: {
            department,
            semester,
            section,
            subject_code,
            subject_name: isAssigned.subject_name,
            date: targetDate
        },
        students
    });
});

/**
 * POST /api/v1/portal/staff/attendance/mark
 * Body: { department, semester, section, subject_code, date, records: [{ student_id, status, remarks }] }
 * Checks authorization: Must be assigned to this class!
 */
router.post('/attendance/mark', (req, res) => {
    const staffId = req.staff.id;
    const { department, semester, section, subject_code, date, time_slot, records } = req.body;

    if (!department || !semester || !section || !subject_code || !date || !Array.isArray(records)) {
        return res.status(400).json({
            success: false,
            message: 'Incomplete payload: department, semester, section, subject_code, date, and records array are required.'
        });
    }

    // STRICT AUTHORIZATION CHECK
    const assignment = checkStaffAssignment(staffId, department, semester, section, subject_code);
    if (!assignment) {
        return res.status(403).json({
            success: false,
            message: `Access denied: You are not authorized to submit attendance for ${subject_code} in ${department} (${semester} - ${section}).`
        });
    }

    const checkStudentInClass = db.prepare(`
        SELECT id FROM students WHERE id = ? AND department = ? AND semester = ? AND section = ?
    `);

    const upsertAttendance = db.prepare(`
        INSERT INTO student_attendance (
            student_id, subject_code, subject_name, staff_id, date, time_slot, status, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const deleteOld = db.prepare(`
        DELETE FROM student_attendance WHERE student_id = ? AND subject_code = ? AND date = ?
    `);

    let markedCount = 0;

    for (const item of records) {
        const studentId = parseInt(item.student_id, 10);
        const validStudent = checkStudentInClass.get(studentId, department, semester, section);
        if (!validStudent) continue; // Skip if student not in this class

        const status = item.status || 'Present';
        const remarks = item.remarks || null;

        // Replace existing attendance record for this day and subject
        deleteOld.run(studentId, subject_code, date);
        upsertAttendance.run(studentId, subject_code, assignment.subject_name, staffId, date, time_slot || '09:30 AM', status, remarks);
        markedCount++;

        // Update overall attendance percentage for student
        const stats = db.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1 ELSE 0 END) as attended
            FROM student_attendance WHERE student_id = ?
        `).get(studentId);

        if (stats.total > 0) {
            const pct = Math.round((stats.attended / stats.total) * 1000) / 10;
            db.prepare('UPDATE students SET attendance_percentage = ? WHERE id = ?').run(pct, studentId);
        }
    }

    res.json({
        success: true,
        message: `Attendance marked successfully for ${markedCount} students.`,
        date,
        subject_code
    });
});

/**
 * GET /api/v1/portal/staff/academics/students
 * Query params: department, semester, section, subject_code, exam_type
 * Returns student marks for assigned class
 */
router.get('/academics/students', (req, res) => {
    const staffId = req.staff.id;
    const { department, semester, section, subject_code, exam_type } = req.query;

    if (!department || !semester || !section || !subject_code) {
        return res.status(400).json({
            success: false,
            message: 'Department, semester, section, and subject_code are required.'
        });
    }

    // STRICT AUTHORIZATION CHECK
    const assignment = checkStaffAssignment(staffId, department, semester, section, subject_code);
    if (!assignment) {
        return res.status(403).json({
            success: false,
            message: `Access denied: You are not authorized to view academic marks for ${subject_code} in ${department} (${semester} - ${section}).`
        });
    }

    const targetExam = exam_type || 'Mid-1';

    const students = db.prepare(`
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
    `).all(subject_code, targetExam, department, semester, section);

    res.json({
        success: true,
        class_info: {
            department,
            semester,
            section,
            subject_code,
            subject_name: assignment.subject_name,
            exam_type: targetExam
        },
        students
    });
});

/**
 * POST /api/v1/portal/staff/academics/marks
 * Body: { department, semester, section, subject_code, exam_type, max_marks, records: [{ student_id, marks_obtained, remarks }] }
 * Enforces assignment check before recording marks.
 */
router.post('/academics/marks', (req, res) => {
    const staffId = req.staff.id;
    const { department, semester, section, subject_code, exam_type, max_marks, records } = req.body;

    if (!department || !semester || !section || !subject_code || !exam_type || !Array.isArray(records)) {
        return res.status(400).json({
            success: false,
            message: 'Department, semester, section, subject_code, exam_type, and records array are required.'
        });
    }

    // STRICT AUTHORIZATION CHECK
    const assignment = checkStaffAssignment(staffId, department, semester, section, subject_code);
    if (!assignment) {
        return res.status(403).json({
            success: false,
            message: `Access denied: You are not authorized to record marks for ${subject_code} in ${department} (${semester} - ${section}).`
        });
    }

    const maxVal = parseFloat(max_marks) || 30;

    const checkStudent = db.prepare(`
        SELECT id FROM students WHERE id = ? AND department = ? AND semester = ? AND section = ?
    `);

    const deleteOldMark = db.prepare(`
        DELETE FROM student_marks WHERE student_id = ? AND subject_code = ? AND exam_type = ?
    `);

    const insertMark = db.prepare(`
        INSERT INTO student_marks (
            student_id, subject_code, subject_name, semester, exam_type,
            max_marks, marks_obtained, grade, status, academic_year,
            evaluated_by_staff_id, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let savedCount = 0;

    for (const r of records) {
        const studentId = parseInt(r.student_id, 10);
        if (!checkStudent.get(studentId, department, semester, section)) continue;

        const obtained = parseFloat(r.marks_obtained);
        if (isNaN(obtained)) continue;

        const { grade, status } = calculateGrade(obtained, maxVal);

        deleteOldMark.run(studentId, subject_code, exam_type);
        insertMark.run(
            studentId, subject_code, assignment.subject_name, semester, exam_type,
            maxVal, obtained, grade, status, assignment.academic_year || '2025-2026',
            staffId, r.remarks || null
        );
        savedCount++;
    }

    res.json({
        success: true,
        message: `Successfully evaluated and saved marks for ${savedCount} students.`,
        subject_code,
        exam_type
    });
});

/**
 * GET /api/v1/portal/staff/assignments
 * Returns assignments created by this staff member
 */
router.get('/assignments', (req, res) => {
    const staffId = req.staff.id;

    const assignments = db.prepare(`
        SELECT 
            a.id, a.department, a.semester, a.section, a.subject_code, a.subject_name,
            a.title, a.description, a.due_date, a.max_marks, a.created_at,
            (SELECT COUNT(*) FROM student_assignment_submissions WHERE assignment_id = a.id) as submissions_count
        FROM student_assignments a
        WHERE a.staff_id = ?
        ORDER BY a.created_at DESC
    `).all(staffId);

    res.json({
        success: true,
        data: assignments
    });
});

/**
 * POST /api/v1/portal/staff/assignments
 * Creates an assignment for an authorized class
 */
router.post('/assignments', (req, res) => {
    const staffId = req.staff.id;
    const { department, semester, section, subject_code, title, description, due_date, max_marks } = req.body;

    if (!department || !semester || !section || !subject_code || !title || !due_date) {
        return res.status(400).json({
            success: false,
            message: 'All class details, title, and due date are required.'
        });
    }

    const assignment = checkStaffAssignment(staffId, department, semester, section, subject_code);
    if (!assignment) {
        return res.status(403).json({
            success: false,
            message: `Access denied: You cannot create assignments for classes you are not assigned to.`
        });
    }

    const ins = db.prepare(`
        INSERT INTO student_assignments (
            staff_id, department, semester, section, subject_code, subject_name,
            title, description, due_date, max_marks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        staffId, department, semester, section, subject_code, assignment.subject_name,
        title.trim(), description || null, due_date, parseInt(max_marks, 10) || 10
    );

    res.json({
        success: true,
        message: 'Assignment published to student portal successfully!',
        id: ins.lastInsertRowid
    });
});

/**
 * GET /api/v1/portal/staff/announcements
 * Returns announcements authorized for staff
 */
router.get('/announcements', (req, res) => {
    const announcements = db.prepare(`
        SELECT id, title, content, category, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE target_audience IN ('all', 'staff')
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
            posted_date DESC
    `).all();

    res.json({
        success: true,
        data: announcements
    });
});

module.exports = router;
