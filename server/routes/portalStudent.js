/**
 * RITW Campus Portal - Student Routes
 * Enforces strict student authorization; students can only view their own data.
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireRole, attachRoleProfile } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and student role protection to all routes
router.use(authenticate, requireRole('student'), attachRoleProfile);

/**
 * GET /api/v1/portal/student/profile
 * Returns the authenticated student's profile
 */
router.get('/profile', (req, res) => {
    const student = req.student;
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Get attendance stats summary
    const attStats = db.prepare(`
        SELECT 
            COUNT(*) as total_classes,
            SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1 ELSE 0 END) as attended_classes
        FROM student_attendance
        WHERE student_id = ?
    `).get(student.id);

    const calculatedAttendance = attStats.total_classes > 0 
        ? Math.round((attStats.attended_classes / attStats.total_classes) * 1000) / 10 
        : student.attendance_percentage;

    res.json({
        success: true,
        data: {
            ...student,
            calculated_attendance: calculatedAttendance,
            total_classes: attStats.total_classes,
            attended_classes: attStats.attended_classes
        }
    });
});

/**
 * GET /api/v1/portal/student/attendance
 * Returns full attendance records & subject-wise summaries for this student
 */
router.get('/attendance', (req, res) => {
    const studentId = req.student.id;

    // Subject-wise summary
    const subjectSummary = db.prepare(`
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
    `).all(studentId);

    // Recent individual attendance logs
    const logs = db.prepare(`
        SELECT 
            id, subject_code, subject_name, date, time_slot, status, remarks
        FROM student_attendance
        WHERE student_id = ?
        ORDER BY date DESC, id DESC
        LIMIT 50
    `).all(studentId);

    // Overall stats
    const totalHeld = subjectSummary.reduce((acc, s) => acc + s.total_classes, 0);
    const totalAttended = subjectSummary.reduce((acc, s) => acc + s.attended, 0);
    const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : req.student.attendance_percentage;

    res.json({
        success: true,
        data: {
            overall_percentage: overallPct,
            total_classes: totalHeld,
            total_attended: totalAttended,
            subjects: subjectSummary,
            logs
        }
    });
});

/**
 * GET /api/v1/portal/student/marks
 * Returns all academic marks and grade sheets for this student
 */
router.get('/marks', (req, res) => {
    const studentId = req.student.id;

    const marks = db.prepare(`
        SELECT 
            m.id, m.subject_code, m.subject_name, m.semester, m.exam_type,
            m.max_marks, m.marks_obtained, m.grade, m.status, m.academic_year,
            m.remarks, s.full_name as evaluated_by
        FROM student_marks m
        LEFT JOIN staff s ON m.evaluated_by_staff_id = s.id
        WHERE m.student_id = ?
        ORDER BY m.semester DESC, m.exam_type ASC, m.subject_code ASC
    `).all(studentId);

    // Group by semester and exam_type
    const grouped = {};
    for (const row of marks) {
        if (!grouped[row.semester]) grouped[row.semester] = {};
        if (!grouped[row.semester][row.exam_type]) grouped[row.semester][row.exam_type] = [];
        grouped[row.semester][row.exam_type].push(row);
    }

    res.json({
        success: true,
        data: {
            cgpa: req.student.cgpa,
            records: marks,
            grouped
        }
    });
});

/**
 * GET /api/v1/portal/student/timetable
 * Returns class timetable for student's department, semester, and section
 */
router.get('/timetable', (req, res) => {
    const { department, semester, section } = req.student;

    const schedule = db.prepare(`
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
    `).all(department, semester, section);

    // Group by day of week
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
            department,
            semester,
            section,
            byDay,
            all: schedule
        }
    });
});

/**
 * GET /api/v1/portal/student/assignments
 * Returns assignments for student's class with submission status
 */
router.get('/assignments', (req, res) => {
    const { id: studentId, department, semester, section } = req.student;

    const assignments = db.prepare(`
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
    `).all(studentId, department, semester, section);

    res.json({
        success: true,
        data: assignments
    });
});

/**
 * POST /api/v1/portal/student/assignments/:id/submit
 * Submit an assignment solution
 */
router.post('/assignments/:id/submit', (req, res) => {
    const assignmentId = parseInt(req.params.id, 10);
    const studentId = req.student.id;
    const { submission_content } = req.body;

    if (!submission_content || !submission_content.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Submission content or link is required.'
        });
    }

    // Verify assignment exists and is for this student's class
    const assignment = db.prepare(`
        SELECT id FROM student_assignments 
        WHERE id = ? AND department = ? AND semester = ? AND section = ?
    `).get(assignmentId, req.student.department, req.student.semester, req.student.section);

    if (!assignment) {
        return res.status(404).json({
            success: false,
            message: 'Assignment not found or not assigned to your section.'
        });
    }

    // Insert or update submission
    db.prepare(`
        INSERT INTO student_assignment_submissions (
            assignment_id, student_id, submitted_at, submission_content, status
        ) VALUES (?, ?, CURRENT_TIMESTAMP, ?, 'Submitted')
        ON CONFLICT(assignment_id, student_id) DO UPDATE SET
            submitted_at = CURRENT_TIMESTAMP,
            submission_content = excluded.submission_content,
            status = 'Submitted'
    `).run(assignmentId, studentId, submission_content.trim());

    res.json({
        success: true,
        message: 'Assignment submitted successfully!'
    });
});

/**
 * GET /api/v1/portal/student/fees
 * Returns fees ledger and payment status for student
 */
router.get('/fees', (req, res) => {
    const studentId = req.student.id;

    const fees = db.prepare(`
        SELECT 
            id, academic_year, fee_type, total_amount, paid_amount,
            due_amount, due_date, payment_status, last_payment_date,
            receipt_number, payment_mode
        FROM student_fees
        WHERE student_id = ?
        ORDER BY id ASC
    `).all(studentId);

    const totalFee = fees.reduce((sum, f) => sum + f.total_amount, 0);
    const totalPaid = fees.reduce((sum, f) => sum + f.paid_amount, 0);
    const totalDue = fees.reduce((sum, f) => sum + f.due_amount, 0);

    res.json({
        success: true,
        data: {
            summary: {
                total_fee: totalFee,
                total_paid: totalPaid,
                total_due: totalDue,
                is_all_clear: totalDue === 0
            },
            items: fees
        }
    });
});

/**
 * GET /api/v1/portal/student/announcements
 * Returns announcements authorized for students
 */
router.get('/announcements', (req, res) => {
    const announcements = db.prepare(`
        SELECT id, title, content, category, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE target_audience IN ('all', 'students')
          AND (department = 'all' OR department = ?)
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
            posted_date DESC
    `).all(req.student.department);

    res.json({
        success: true,
        data: announcements
    });
});

module.exports = router;
