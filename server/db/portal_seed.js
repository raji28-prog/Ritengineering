/**
 * RITW Campus Portal - Seeder Script
 * Seeds realistic accounts, profiles, relationships, marks, attendance,
 * fees, timetables, and assignments for Parents, Students, and Staff.
 */
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const db = require('./database');

function seedPortalDatabase() {
    console.log('[PORTAL DB] Initializing campus portal schema...');

    // 1. Run schema migration
    const portalSchemaPath = path.join(__dirname, 'portal_schema.sql');
    if (fs.existsSync(portalSchemaPath)) {
        const schemaSql = fs.readFileSync(portalSchemaPath, 'utf8');
        db.exec(schemaSql);
    }

    // Check if portal has already been seeded
    const studentCount = db.prepare('SELECT COUNT(*) as c FROM students').get().c;
    if (studentCount > 0) {
        console.log('[PORTAL DB] Campus portal already initialized with data.');
        return;
    }

    console.log('[PORTAL DB] Seeding initial students, parents, staff, and records...');

    const salt = bcrypt.genSaltSync(10);
    const studentPassHash = bcrypt.hashSync('Student@2026!', salt);
    const parentPassHash = bcrypt.hashSync('Parent@2026!', salt);
    const staffPassHash = bcrypt.hashSync('Staff@2026!', salt);

    const insertUser = db.prepare(`
        INSERT INTO users (username, email, password_hash, role, is_active)
        VALUES (?, ?, ?, ?, 1)
    `);

    // Helper to get or create user
    function getOrCreateUser(username, email, role, hash) {
        let u = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
        if (!u) {
            const res = insertUser.run(username, email, hash, role);
            return res.lastInsertRowid;
        }
        return u.id;
    }

    // =========================================================================
    // 1. SEED STUDENTS
    // =========================================================================
    // Student 1: Priya Sharma (CSE, 4th Sem, Sec A) - Daughter of Ramesh Sharma
    const uStudent1 = getOrCreateUser('23RITW0501', 'priya.sharma@students.rishimsengg.ac.in', 'student', studentPassHash);
    const s1Res = db.prepare(`
        INSERT INTO students (
            user_id, roll_number, full_name, department, degree, batch_year, semester, section,
            dob, gender, phone, email, address, guardian_name, guardian_phone, blood_group,
            admission_date, cgpa, attendance_percentage, avatar_url
        ) VALUES (
            ?, '23RITW0501', 'Priya Sharma', 'Computer Science and Engineering', 'B.Tech', '2023-2027', 'IV Semester', 'A',
            '2005-06-14', 'Female', '+91-98765-43210', 'priya.sharma@students.rishimsengg.ac.in',
            'Flat 402, Sai Balaji Residency, Nizampet Road, Kukatpally, Hyderabad - 500085',
            'Ramesh Sharma', '+91-98480-22334', 'O+ve', '2023-08-10', 8.74, 88.5,
            '/images/avatar-student1.png'
        )
    `).run(uStudent1);
    const student1Id = s1Res.lastInsertRowid;

    // Student 2: Ananya Sharma (IT, 2nd Sem, Sec B) - Second Daughter of Ramesh Sharma (Multi-child test!)
    const uStudent2 = getOrCreateUser('24RITW0412', 'ananya.sharma@students.rishimsengg.ac.in', 'student', studentPassHash);
    const s2Res = db.prepare(`
        INSERT INTO students (
            user_id, roll_number, full_name, department, degree, batch_year, semester, section,
            dob, gender, phone, email, address, guardian_name, guardian_phone, blood_group,
            admission_date, cgpa, attendance_percentage, avatar_url
        ) VALUES (
            ?, '24RITW0412', 'Ananya Sharma', 'Information Technology', 'B.Tech', '2024-2028', 'II Semester', 'B',
            '2006-09-22', 'Female', '+91-98765-43211', 'ananya.sharma@students.rishimsengg.ac.in',
            'Flat 402, Sai Balaji Residency, Nizampet Road, Kukatpally, Hyderabad - 500085',
            'Ramesh Sharma', '+91-98480-22334', 'B+ve', '2024-08-12', 9.12, 92.0,
            '/images/avatar-student2.png'
        )
    `).run(uStudent2);
    const student2Id = s2Res.lastInsertRowid;

    // Student 3: Sneha Reddy (ECE, 4th Sem, Sec A) - Unlinked from Ramesh to test security boundary!
    const uStudent3 = getOrCreateUser('23RITW0525', 'sneha.reddy@students.rishimsengg.ac.in', 'student', studentPassHash);
    const s3Res = db.prepare(`
        INSERT INTO students (
            user_id, roll_number, full_name, department, degree, batch_year, semester, section,
            dob, gender, phone, email, address, guardian_name, guardian_phone, blood_group,
            admission_date, cgpa, attendance_percentage, avatar_url
        ) VALUES (
            ?, '23RITW0525', 'Sneha Reddy', 'Electronics and Communication Engineering', 'B.Tech', '2023-2027', 'IV Semester', 'A',
            '2005-04-18', 'Female', '+91-98765-43212', 'sneha.reddy@students.rishimsengg.ac.in',
            'H.No 12-4-89, KPHB Colony 4th Phase, Hyderabad - 500072',
            'Kavitha Reddy', '+91-98480-33445', 'A+ve', '2023-08-10', 8.42, 84.0,
            '/images/avatar-student3.png'
        )
    `).run(uStudent3);
    const student3Id = s3Res.lastInsertRowid;

    // =========================================================================
    // 2. SEED PARENTS & VERIFIED RELATIONSHIP MAPPINGS
    // =========================================================================
    // Parent 1: Ramesh Sharma (Father of Priya & Ananya)
    const uParent1 = getOrCreateUser('parent.ramesh', 'ramesh.sharma@gmail.com', 'parent', parentPassHash);
    const p1Res = db.prepare(`
        INSERT INTO parents (user_id, parent_code, full_name, relation, phone, email, occupation, address)
        VALUES (?, 'PAR-9041', 'Ramesh Sharma', 'Father', '+91-98480-22334', 'ramesh.sharma@gmail.com', 'Senior Software Architect', 'Kukatpally, Hyderabad')
    `).run(uParent1);
    const parent1Id = p1Res.lastInsertRowid;

    // Link Ramesh to Priya (Verified)
    db.prepare(`
        INSERT INTO parent_student_mappings (parent_id, student_id, relation, is_verified, notes)
        VALUES (?, ?, 'Father', 1, 'Relationship verified via Aadhaar & Admission Record')
    `).run(parent1Id, student1Id);

    // Link Ramesh to Ananya (Verified - 2nd Child!)
    db.prepare(`
        INSERT INTO parent_student_mappings (parent_id, student_id, relation, is_verified, notes)
        VALUES (?, ?, 'Father', 1, 'Relationship verified via Birth Certificate & Admission Record')
    `).run(parent1Id, student2Id);

    // Parent 2: Kavitha Reddy (Mother of Sneha)
    const uParent2 = getOrCreateUser('parent.kavitha', 'kavitha.reddy@gmail.com', 'parent', parentPassHash);
    const p2Res = db.prepare(`
        INSERT INTO parents (user_id, parent_code, full_name, relation, phone, email, occupation, address)
        VALUES (?, 'PAR-9082', 'Kavitha Reddy', 'Mother', '+91-98480-33445', 'kavitha.reddy@gmail.com', 'Bank Manager', 'KPHB, Hyderabad')
    `).run(uParent2);
    const parent2Id = p2Res.lastInsertRowid;

    // Link Kavitha to Sneha only
    db.prepare(`
        INSERT INTO parent_student_mappings (parent_id, student_id, relation, is_verified, notes)
        VALUES (?, ?, 'Mother', 1, 'Verified admission contact')
    `).run(parent2Id, student3Id);

    // =========================================================================
    // 3. SEED STAFF / FACULTY & TEACHING ASSIGNMENTS
    // =========================================================================
    // Staff 1: Dr. Radhika Rao (CSE)
    const uStaff1 = getOrCreateUser('FAC-CSE-101', 'radhika.cse@rishimsengg.ac.in', 'staff', staffPassHash);
    const st1Res = db.prepare(`
        INSERT INTO staff (
            user_id, staff_code, full_name, designation, department, qualification,
            specialization, phone, email, joining_date, office_room, avatar_url
        ) VALUES (
            ?, 'FAC-CSE-101', 'Dr. Radhika Rao', 'Associate Professor & Academic Coordinator',
            'Computer Science and Engineering', 'Ph.D (IIT Madras), M.Tech',
            'Distributed Systems & Database Engineering', '+91-98490-11223', 'radhika.cse@rishimsengg.ac.in',
            '2018-06-15', 'Block-A, Room 304', '/images/avatar-staff1.png'
        )
    `).run(uStaff1);
    const staff1Id = st1Res.lastInsertRowid;

    // Staff Assignments for Dr. Radhika Rao
    const insertAssign = db.prepare(`
        INSERT INTO staff_assignments (staff_id, department, semester, section, subject_code, subject_name, academic_year, role_in_class)
        VALUES (?, ?, ?, ?, ?, ?, '2025-2026', ?)
    `);
    insertAssign.run(staff1Id, 'Computer Science and Engineering', 'IV Semester', 'A', 'CS401PC', 'Database Management Systems', 'Subject Teacher');
    insertAssign.run(staff1Id, 'Computer Science and Engineering', 'IV Semester', 'A', 'CS402PC', 'Operating Systems', 'Class Incharge');

    // Staff 2: Prof. Suresh Kumar (ECE)
    const uStaff2 = getOrCreateUser('FAC-ECE-201', 'suresh.ece@rishimsengg.ac.in', 'staff', staffPassHash);
    const st2Res = db.prepare(`
        INSERT INTO staff (
            user_id, staff_code, full_name, designation, department, qualification,
            specialization, phone, email, joining_date, office_room, avatar_url
        ) VALUES (
            ?, 'FAC-ECE-201', 'Prof. Suresh Kumar', 'Assistant Professor',
            'Electronics and Communication Engineering', 'M.Tech (JNTUH)',
            'VLSI & Embedded Systems', '+91-98490-44556', 'suresh.ece@rishimsengg.ac.in',
            '2020-07-01', 'Block-B, Room 208', '/images/avatar-staff2.png'
        )
    `).run(uStaff2);
    const staff2Id = st2Res.lastInsertRowid;

    insertAssign.run(staff2Id, 'Electronics and Communication Engineering', 'IV Semester', 'A', 'EC401PC', 'Analog Circuits', 'Subject Teacher');

    // =========================================================================
    // 4. SEED TIMETABLES
    // =========================================================================
    const insertTimetable = db.prepare(`
        INSERT INTO student_timetable (department, semester, section, day_of_week, start_time, end_time, subject_code, subject_name, room_number, staff_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // CSE IV-A Timetable
    const cseSched = [
        { day: 'Monday', start: '09:30 AM', end: '10:30 AM', code: 'CS401PC', name: 'Database Management Systems', room: 'A-301', staff: staff1Id },
        { day: 'Monday', start: '10:30 AM', end: '11:30 AM', code: 'CS402PC', name: 'Operating Systems', room: 'A-301', staff: staff1Id },
        { day: 'Monday', start: '11:45 AM', end: '12:45 PM', code: 'CS403PC', name: 'Software Engineering', room: 'A-301', staff: null },
        { day: 'Monday', start: '01:30 PM', end: '03:30 PM', code: 'CS404PC', name: 'DBMS Lab (Batch A1)', room: 'Lab-3', staff: staff1Id },
        { day: 'Tuesday', start: '09:30 AM', end: '10:30 AM', code: 'CS402PC', name: 'Operating Systems', room: 'A-301', staff: staff1Id },
        { day: 'Tuesday', start: '10:30 AM', end: '11:30 AM', code: 'CS401PC', name: 'Database Management Systems', room: 'A-301', staff: staff1Id },
        { day: 'Tuesday', start: '11:45 AM', end: '12:45 PM', code: 'MA401BS', name: 'Discrete Mathematics', room: 'A-301', staff: null },
        { day: 'Wednesday', start: '09:30 AM', end: '10:30 AM', code: 'CS401PC', name: 'Database Management Systems', room: 'A-301', staff: staff1Id },
        { day: 'Wednesday', start: '10:30 AM', end: '11:30 AM', code: 'CS403PC', name: 'Software Engineering', room: 'A-301', staff: null },
        { day: 'Thursday', start: '09:30 AM', end: '10:30 AM', code: 'CS402PC', name: 'Operating Systems', room: 'A-301', staff: staff1Id },
        { day: 'Thursday', start: '10:30 AM', end: '11:30 AM', code: 'CS401PC', name: 'Database Management Systems', room: 'A-301', staff: staff1Id },
        { day: 'Friday', start: '09:30 AM', end: '10:30 AM', code: 'CS402PC', name: 'Operating Systems', room: 'A-301', staff: staff1Id },
        { day: 'Friday', start: '10:30 AM', end: '11:30 AM', code: 'MA401BS', name: 'Discrete Mathematics', room: 'A-301', staff: null },
        { day: 'Saturday', start: '09:30 AM', end: '11:30 AM', code: 'CS405PC', name: 'Technical Seminar & Industry Projects', room: 'Auditorium', staff: staff1Id }
    ];

    for (const item of cseSched) {
        insertTimetable.run('Computer Science and Engineering', 'IV Semester', 'A', item.day, item.start, item.end, item.code, item.name, item.room, item.staff);
    }

    // IT II-B Timetable for Ananya
    const itSched = [
        { day: 'Monday', start: '09:30 AM', end: '10:30 AM', code: 'IT201PC', name: 'Data Structures & Algorithms', room: 'B-204', staff: null },
        { day: 'Monday', start: '10:30 AM', end: '11:30 AM', code: 'MA201BS', name: 'Engineering Mathematics-II', room: 'B-204', staff: null },
        { day: 'Tuesday', start: '09:30 AM', end: '10:30 AM', code: 'CS202PC', name: 'Object Oriented Programming (Java)', room: 'B-204', staff: null },
        { day: 'Wednesday', start: '09:30 AM', end: '10:30 AM', code: 'IT201PC', name: 'Data Structures & Algorithms', room: 'B-204', staff: null },
        { day: 'Thursday', start: '10:30 AM', end: '11:30 AM', code: 'CS202PC', name: 'Object Oriented Programming (Java)', room: 'B-204', staff: null },
        { day: 'Friday', start: '09:30 AM', end: '11:30 AM', code: 'IT205PC', name: 'Data Structures Lab', room: 'Lab-1', staff: null }
    ];
    for (const item of itSched) {
        insertTimetable.run('Information Technology', 'II Semester', 'B', item.day, item.start, item.end, item.code, item.name, item.room, item.staff);
    }

    // =========================================================================
    // 5. SEED ATTENDANCE RECORDS
    // =========================================================================
    const insertAtt = db.prepare(`
        INSERT INTO student_attendance (student_id, subject_code, subject_name, staff_id, date, time_slot, status, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Student 1 (Priya Sharma) attendance logs (last 10 days)
    const dates = ['2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-27'];
    for (const d of dates) {
        insertAtt.run(student1Id, 'CS401PC', 'Database Management Systems', staff1Id, d, '09:30 AM', 'Present', 'Attentive in class');
        insertAtt.run(student1Id, 'CS402PC', 'Operating Systems', staff1Id, d, '10:30 AM', d === '2026-10-21' ? 'Absent' : 'Present', d === '2026-10-21' ? 'Medical leave' : 'Active participation');
        insertAtt.run(student1Id, 'CS403PC', 'Software Engineering', null, d, '11:45 AM', 'Present', null);
    }

    // Student 2 (Ananya Sharma) attendance logs
    for (const d of dates) {
        insertAtt.run(student2Id, 'IT201PC', 'Data Structures & Algorithms', null, d, '09:30 AM', 'Present', 'Consistent');
        insertAtt.run(student2Id, 'CS202PC', 'Object Oriented Programming (Java)', null, d, '10:30 AM', 'Present', 'Excellent in practicals');
    }

    // Student 3 (Sneha Reddy) attendance logs
    for (const d of dates) {
        insertAtt.run(student3Id, 'EC401PC', 'Analog Circuits', staff2Id, d, '09:30 AM', d === '2026-10-22' ? 'Absent' : 'Present', null);
    }

    // =========================================================================
    // 6. SEED ACADEMIC MARKS
    // =========================================================================
    const insertMarks = db.prepare(`
        INSERT INTO student_marks (student_id, subject_code, subject_name, semester, exam_type, max_marks, marks_obtained, grade, status, academic_year, evaluated_by_staff_id, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '2025-2026', ?, ?)
    `);

    // Marks for Priya Sharma (CSE)
    insertMarks.run(student1Id, 'CS401PC', 'Database Management Systems', 'IV Semester', 'Mid-1', 30, 28.5, 'A+', 'Pass', staff1Id, 'Outstanding SQL query design');
    insertMarks.run(student1Id, 'CS401PC', 'Database Management Systems', 'IV Semester', 'Mid-2', 30, 27.0, 'A+', 'Pass', staff1Id, 'Good understanding of Transactions & Indexing');
    insertMarks.run(student1Id, 'CS402PC', 'Operating Systems', 'IV Semester', 'Mid-1', 30, 26.5, 'A', 'Pass', staff1Id, 'Good problem solving in Process Scheduling');
    insertMarks.run(student1Id, 'CS402PC', 'Operating Systems', 'IV Semester', 'Mid-2', 30, 28.0, 'A+', 'Pass', staff1Id, 'Strong grasp on Memory Virtualization');
    insertMarks.run(student1Id, 'CS403PC', 'Software Engineering', 'IV Semester', 'Mid-1', 30, 25.0, 'A', 'Pass', null, 'Good agile process diagrams');
    insertMarks.run(student1Id, 'MA401BS', 'Discrete Mathematics', 'IV Semester', 'Mid-1', 30, 29.0, 'O', 'Pass', null, 'Exemplary proof derivations');
    insertMarks.run(student1Id, 'CS404PC', 'DBMS Lab', 'IV Semester', 'Internal Lab', 25, 24.5, 'O', 'Pass', staff1Id, 'Full marks in viva and PL/SQL procedures');

    // Previous Semester (III Semester) finals for Priya Sharma (GPA calculation demonstration)
    insertMarks.run(student1Id, 'CS301PC', 'Data Structures using C++', 'III Semester', 'Semester End', 100, 89.0, 'A+', 'Pass', null, 'Final university grade');
    insertMarks.run(student1Id, 'CS302PC', 'Computer Organization & Architecture', 'III Semester', 'Semester End', 100, 86.0, 'A', 'Pass', null, 'Final university grade');
    insertMarks.run(student1Id, 'CS303PC', 'Object Oriented Programming with Java', 'III Semester', 'Semester End', 100, 92.0, 'O', 'Pass', null, 'Final university grade');

    // Marks for Ananya Sharma (IT - 2nd child)
    insertMarks.run(student2Id, 'IT201PC', 'Data Structures & Algorithms', 'II Semester', 'Mid-1', 30, 29.5, 'O', 'Pass', null, 'Top scorer in batch');
    insertMarks.run(student2Id, 'CS202PC', 'Object Oriented Programming (Java)', 'II Semester', 'Mid-1', 30, 28.0, 'A+', 'Pass', null, 'Excellent OOP concepts');
    insertMarks.run(student2Id, 'MA201BS', 'Engineering Mathematics-II', 'II Semester', 'Mid-1', 30, 27.5, 'A+', 'Pass', null, 'Accurate multivariable calculus');

    // Marks for Sneha Reddy (ECE)
    insertMarks.run(student3Id, 'EC401PC', 'Analog Circuits', 'IV Semester', 'Mid-1', 30, 25.0, 'A', 'Pass', staff2Id, 'Good circuit analysis');

    // =========================================================================
    // 7. SEED ASSIGNMENTS & SUBMISSIONS
    // =========================================================================
    const insertAssignTask = db.prepare(`
        INSERT INTO student_assignments (staff_id, department, semester, section, subject_code, subject_name, title, description, due_date, max_marks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const a1Res = insertAssignTask.run(
        staff1Id, 'Computer Science and Engineering', 'IV Semester', 'A', 'CS401PC', 'Database Management Systems',
        'Assignment 3: B+ Tree Indexing & Query Optimization',
        'Implement relational algebra query tree optimizations and demonstrate cost calculation with indexes.',
        '2026-11-05', 10
    );
    const assign1Id = a1Res.lastInsertRowid;

    const a2Res = insertAssignTask.run(
        staff1Id, 'Computer Science and Engineering', 'IV Semester', 'A', 'CS402PC', 'Operating Systems',
        'Assignment 2: Bankers Algorithm Deadlock Avoidance Simulator',
        'Write a complete simulation report with state transition matrices and allocation graphs.',
        '2026-11-10', 10
    );
    const assign2Id = a2Res.lastInsertRowid;

    // Priya submitted Assignment 1
    db.prepare(`
        INSERT INTO student_assignment_submissions (assignment_id, student_id, submission_content, marks_awarded, feedback, status)
        VALUES (?, ?, ?, ?, ?, 'Graded')
    `).run(assign1Id, student1Id, 'Submitted GitHub Repository with B+ Tree python implementation and test benches.', 9.5, 'Excellent code structure and comprehensive test cases.');

    // Assignment 2 is pending for Priya (Submitted but pending grade)
    db.prepare(`
        INSERT INTO student_assignment_submissions (assignment_id, student_id, submission_content, marks_awarded, feedback, status)
        VALUES (?, ?, ?, NULL, NULL, 'Submitted')
    `).run(assign2Id, student1Id, 'Deadlock simulator report attached with resource matrices.');

    // =========================================================================
    // 8. SEED FEES LEDGER
    // =========================================================================
    const insertFee = db.prepare(`
        INSERT INTO student_fees (
            student_id, academic_year, fee_type, total_amount, paid_amount, due_amount,
            due_date, payment_status, last_payment_date, receipt_number, payment_mode
        ) VALUES (?, '2025-2026', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Fees for Priya Sharma (CSE)
    insertFee.run(student1Id, 'Tuition Fee (2025-2026)', 85000, 85000, 0, '2025-09-30', 'Paid', '2025-09-12', 'RITW/FEE/2025/1042', 'Online NetBanking');
    insertFee.run(student1Id, 'JNTUH University & Exam Fee (IV Sem)', 6500, 6500, 0, '2026-03-15', 'Paid', '2026-03-02', 'RITW/EXAM/2026/0491', 'UPI / Card');
    insertFee.run(student1Id, 'College Bus / Transport Fee', 28000, 20000, 8000, '2026-11-15', 'Partial', '2025-09-12', 'RITW/TRN/2025/0312', 'Bank Challan');
    insertFee.run(student1Id, 'Library & Special Training Caution Deposit', 5000, 5000, 0, '2023-08-10', 'Paid', '2023-08-10', 'RITW/DEP/2023/0019', 'Cash / DD');

    // Fees for Ananya Sharma (IT - 2nd child)
    insertFee.run(student2Id, 'Tuition Fee (2025-2026)', 85000, 85000, 0, '2025-09-30', 'Paid', '2025-09-14', 'RITW/FEE/2025/1198', 'Online NetBanking');
    insertFee.run(student2Id, 'JNTUH University & Exam Fee (II Sem)', 6500, 0, 6500, '2026-11-20', 'Unpaid', null, null, null);
    insertFee.run(student2Id, 'College Bus / Transport Fee', 28000, 28000, 0, '2025-09-30', 'Paid', '2025-09-14', 'RITW/TRN/2025/0422', 'Online NetBanking');

    // Fees for Sneha Reddy (ECE)
    insertFee.run(student3Id, 'Tuition Fee (2025-2026)', 85000, 85000, 0, '2025-09-30', 'Paid', '2025-09-10', 'RITW/FEE/2025/0988', 'Online NetBanking');
    insertFee.run(student3Id, 'JNTUH University & Exam Fee (IV Sem)', 6500, 6500, 0, '2026-03-15', 'Paid', '2026-03-05', 'RITW/EXAM/2026/0411', 'UPI');

    // =========================================================================
    // 9. SEED PORTAL ANNOUNCEMENTS (Role-Filtered)
    // =========================================================================
    const insertAnnounce = db.prepare(`
        INSERT INTO portal_announcements (title, content, category, target_audience, department, priority, posted_date, posted_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Common Announcement (All roles)
    insertAnnounce.run(
        'Campus Holiday Notice - National Festival Celebration',
        'The college will remain closed on Friday for the upcoming public celebration. Academic and laboratory sessions will resume normally on Monday.',
        'Administrative', 'all', 'all', 'normal', '2026-10-25', 'Principal Office'
    );

    // Student Only Announcement
    insertAnnounce.run(
        'IV Semester Internal Lab Examination Dates Announced',
        'All B.Tech IV Semester students (CSE/ECE/IT) are advised that internal lab examinations commence from November 18, 2026. Hall tickets and lab slot allocations will be available in the student portal.',
        'Examinations', 'students', 'all', 'high', '2026-10-26', 'Controller of Examinations'
    );

    // Student Only Announcement 2
    insertAnnounce.run(
        'Hackathon 2026 - Registrations Open for RITW Techfest',
        'RITW Innovation Cell announces 36-hour National Level Hackathon. Team size: 2 to 4 students. Win cash prizes worth INR 1,50,000.',
        'Events', 'students', 'Computer Science and Engineering', 'normal', '2026-10-27', 'R&D Cell'
    );

    // Parent Only Announcement
    insertAnnounce.run(
        'Annual Parent-Teacher Conference (PTM) & Progress Card Review',
        'Dear Parents, The parent-teacher meeting is scheduled for Saturday, November 8, 2026, from 10:00 AM to 01:00 PM. Parents can review mid-term evaluations, attendance logs, and interact directly with class counselors.',
        'Academic', 'parents', 'all', 'high', '2026-10-26', 'Dean of Academics'
    );

    // Parent Only Announcement 2
    insertAnnounce.run(
        'Important: Transport Fee Installment Due Reminder',
        'Parents whose children utilize college transportation services are kindly requested to clear the 2nd term transport installment by November 15, 2026 via portal or college fee counter.',
        'Fee Reminder', 'parents', 'all', 'normal', '2026-10-27', 'Finance Accounts Officer'
    );

    // Staff Only Announcement
    insertAnnounce.run(
        'Submission of Mid-Term Evaluated Answer Scripts & JNTUH Marks Entry',
        'All faculty members are requested to complete evaluation and upload Mid-1 marks to the institutional portal and JNTUH examination portal on or before Friday 5:00 PM.',
        'Academic', 'staff', 'all', 'urgent', '2026-10-26', 'Examination Committee'
    );

    // Staff Only Announcement 2
    insertAnnounce.run(
        'Faculty Development Program (FDP) on Generative AI & Cloud Systems',
        'AICTE-ATAL sponsored 5-day offline FDP on Advanced Distributed Architectures will be conducted in Seminar Hall 2 from Nov 24 to Nov 28. Interested faculty must confirm registration.',
        'Notice', 'staff', 'Computer Science and Engineering', 'normal', '2026-10-27', 'HOD CSE'
    );

    // =========================================================================
    // 10. SEED USER NOTIFICATIONS
    // =========================================================================
    const insertNotif = db.prepare(`
        INSERT INTO user_notifications (user_id, title, message, type, is_read)
        VALUES (?, ?, ?, ?, ?)
    `);

    // Student 1 (Priya) notifications
    insertNotif.run(uStudent1, 'Assignment Graded', 'Your DBMS Assignment 3 has been graded by Dr. Radhika Rao (Score: 9.5/10).', 'success', 0);
    insertNotif.run(uStudent1, 'Attendance Alert', 'Your overall attendance for October is 88.5%. Keep it up!', 'info', 1);

    // Student 2 (Ananya) notifications
    insertNotif.run(uStudent2, 'Fee Pending', 'JNTUH University II Semester Exam Fee of ₹6,500 is due on Nov 20, 2026.', 'warning', 0);

    // Parent 1 (Ramesh Sharma) notifications
    insertNotif.run(uParent1, 'PTM Invitation', 'You are invited to the PTM on Nov 8 for Priya (CSE IV) and Ananya (IT II).', 'info', 0);
    insertNotif.run(uParent1, 'Child Marks Published', 'Mid-Term 1 results have been published for Priya Sharma.', 'success', 0);

    // Staff 1 (Dr. Radhika Rao) notifications
    insertNotif.run(uStaff1, 'Marks Submission Due', 'Please verify and submit CSE IV-A Mid-2 grades before Friday.', 'warning', 0);
    insertNotif.run(uStaff1, 'New Assignment Submitted', 'Priya Sharma submitted DBMS Assignment 3.', 'info', 1);

    console.log('[PORTAL DB] Campus portal seed completed successfully!');
}

module.exports = seedPortalDatabase;
