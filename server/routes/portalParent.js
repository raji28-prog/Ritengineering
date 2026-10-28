/**
 * RITW Campus Portal - Parent Routes
 * Multi-child support with strict verified-relationship authorization checks.
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireRole, attachRoleProfile } = require('../middleware/auth');

const router = express.Router();

// Apply authentication, parent role requirement, and profile attachment
router.use(authenticate, requireRole('parent'), attachRoleProfile);

/**
 * Middleware: Verify that studentId is legitimately linked and verified to this parent
 */
function verifyChildAccess(req, res, next) {
    const parentId = req.parent.id;
    const studentId = parseInt(req.params.studentId, 10);

    if (isNaN(studentId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Student ID parameter.'
        });
    }

    const mapping = db.prepare(`
        SELECT m.id, m.relation, m.is_verified, s.full_name, s.roll_number
        FROM parent_student_mappings m
        JOIN students s ON m.student_id = s.id
        WHERE m.parent_id = ? AND m.student_id = ? AND m.is_verified = 1
    `).get(parentId, studentId);

    if (!mapping) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: You do not have verified authorization to access this student’s academic records.'
        });
    }

    req.verifiedChild = mapping;
    req.studentId = studentId;
    next();
}

/**
 * GET /api/v1/portal/parent/children
 * Returns all verified linked children for this parent (Supports Multiple Children)
 */
router.get('/children', (req, res) => {
    const parentId = req.parent.id;

    const children = db.prepare(`
        SELECT 
            s.id, s.roll_number, s.full_name, s.department, s.degree,
            s.batch_year, s.semester, s.section, s.avatar_url, s.cgpa,
            s.attendance_percentage, s.dob, s.blood_group,
            m.relation, m.is_verified, m.verified_at
        FROM parent_student_mappings m
        JOIN students s ON m.student_id = s.id
        WHERE m.parent_id = ? AND m.is_verified = 1
        ORDER BY s.full_name ASC
    `).all(parentId);

    // Compute live stats for each child
    const enhanced = children.map(child => {
        const attStats = db.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Present' OR status = 'OnDuty' THEN 1 ELSE 0 END) as attended
            FROM student_attendance WHERE student_id = ?
        `).get(child.id);

        const feeStats = db.prepare(`
            SELECT 
                SUM(total_amount) as total_fee,
                SUM(paid_amount) as total_paid,
                SUM(due_amount) as total_due
            FROM student_fees WHERE student_id = ?
        `).get(child.id);

        const liveAttendance = attStats.total > 0 
            ? Math.round((attStats.attended / attStats.total) * 1000) / 10 
            : child.attendance_percentage;

        return {
            ...child,
            live_attendance: liveAttendance,
            total_classes: attStats.total,
            attended_classes: attStats.attended,
            fee_summary: {
                total_fee: feeStats.total_fee || 0,
                total_paid: feeStats.total_paid || 0,
                total_due: feeStats.total_due || 0,
                is_clear: (feeStats.total_due || 0) === 0
            }
        };
    });

    res.json({
        success: true,
        count: enhanced.length,
        parent: {
            id: req.parent.id,
            full_name: req.parent.full_name,
            parent_code: req.parent.parent_code,
            relation: req.parent.relation
        },
        children: enhanced
    });
});

/**
 * GET /api/v1/portal/parent/child/:studentId/profile
 * Returns profile for the authorized child
 */
router.get('/child/:studentId/profile', verifyChildAccess, (req, res) => {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.studentId);

    res.json({
        success: true,
        data: {
            ...student,
            verified_relation: req.verifiedChild.relation
        }
    });
});

/**
 * GET /api/v1/portal/parent/child/:studentId/attendance
 * Returns detailed attendance for the authorized child
 */
router.get('/child/:studentId/attendance', verifyChildAccess, (req, res) => {
    const studentId = req.studentId;

    const subjects = db.prepare(`
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

    const logs = db.prepare(`
        SELECT id, subject_code, subject_name, date, time_slot, status, remarks
        FROM student_attendance
        WHERE student_id = ?
        ORDER BY date DESC, id DESC
        LIMIT 50
    `).all(studentId);

    const totalHeld = subjects.reduce((sum, s) => sum + s.total_classes, 0);
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 0;

    res.json({
        success: true,
        student_name: req.verifiedChild.full_name,
        roll_number: req.verifiedChild.roll_number,
        data: {
            overall_percentage: overallPct,
            total_classes: totalHeld,
            total_attended: totalAttended,
            subjects,
            logs
        }
    });
});

/**
 * GET /api/v1/portal/parent/child/:studentId/marks
 * Returns academic marks and grades for the authorized child
 */
router.get('/child/:studentId/marks', verifyChildAccess, (req, res) => {
    const studentId = req.studentId;

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

    const student = db.prepare('SELECT cgpa FROM students WHERE id = ?').get(studentId);

    const grouped = {};
    for (const row of marks) {
        if (!grouped[row.semester]) grouped[row.semester] = {};
        if (!grouped[row.semester][row.exam_type]) grouped[row.semester][row.exam_type] = [];
        grouped[row.semester][row.exam_type].push(row);
    }

    res.json({
        success: true,
        student_name: req.verifiedChild.full_name,
        roll_number: req.verifiedChild.roll_number,
        data: {
            cgpa: student ? student.cgpa : null,
            records: marks,
            grouped
        }
    });
});

/**
 * GET /api/v1/portal/parent/child/:studentId/academics
 * Returns academic details including timetable and assignment overview
 */
router.get('/child/:studentId/academics', verifyChildAccess, (req, res) => {
    const student = db.prepare('SELECT department, semester, section FROM students WHERE id = ?').get(req.studentId);

    const timetable = db.prepare(`
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
    `).all(student.department, student.semester, student.section);

    const assignments = db.prepare(`
        SELECT 
            a.id, a.subject_name, a.title, a.due_date, a.max_marks,
            sub.status as submission_status, sub.marks_awarded, sub.feedback
        FROM student_assignments a
        LEFT JOIN student_assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ?
        WHERE a.department = ? AND a.semester = ? AND a.section = ?
        ORDER BY a.due_date DESC
    `).all(req.studentId, student.department, student.semester, student.section);

    res.json({
        success: true,
        student_name: req.verifiedChild.full_name,
        data: {
            class: `${student.department} (${student.semester} - Section ${student.section})`,
            timetable,
            assignments
        }
    });
});

/**
 * GET /api/v1/portal/parent/child/:studentId/fees
 * Returns fees and pending payment status for authorized child
 */
router.get('/child/:studentId/fees', verifyChildAccess, (req, res) => {
    const fees = db.prepare(`
        SELECT 
            id, academic_year, fee_type, total_amount, paid_amount,
            due_amount, due_date, payment_status, last_payment_date,
            receipt_number, payment_mode
        FROM student_fees
        WHERE student_id = ?
        ORDER BY id ASC
    `).all(req.studentId);

    const totalFee = fees.reduce((sum, f) => sum + f.total_amount, 0);
    const totalPaid = fees.reduce((sum, f) => sum + f.paid_amount, 0);
    const totalDue = fees.reduce((sum, f) => sum + f.due_amount, 0);

    res.json({
        success: true,
        student_name: req.verifiedChild.full_name,
        roll_number: req.verifiedChild.roll_number,
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
 * GET /api/v1/portal/parent/announcements
 * Returns announcements authorized for parents
 */
router.get('/announcements', (req, res) => {
    const announcements = db.prepare(`
        SELECT id, title, content, category, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE target_audience IN ('all', 'parents')
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
