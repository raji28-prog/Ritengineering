-- ============================================================================
-- RITW Campus Portal Database Schema
-- Role-Based Access Control for Students, Parents, and Staff
-- ============================================================================

-- Students Profile
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    degree TEXT NOT NULL DEFAULT 'B.Tech',
    batch_year TEXT NOT NULL,
    semester TEXT NOT NULL,
    section TEXT NOT NULL,
    dob DATE,
    gender TEXT DEFAULT 'Female',
    phone TEXT,
    email TEXT,
    address TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    blood_group TEXT,
    admission_date DATE,
    avatar_url TEXT,
    cgpa REAL DEFAULT 0.0,
    attendance_percentage REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Parents Profile
CREATE TABLE IF NOT EXISTS parents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    parent_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    relation TEXT DEFAULT 'Parent',
    phone TEXT,
    email TEXT,
    occupation TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Parent-Student Verified Relationships (Supports Multiple Children)
CREATE TABLE IF NOT EXISTS parent_student_mappings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    relation TEXT NOT NULL DEFAULT 'Parent',
    is_verified INTEGER NOT NULL DEFAULT 1,
    verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(parent_id) REFERENCES parents(id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE(parent_id, student_id)
);

-- Staff / Faculty Profile
CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    staff_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    qualification TEXT,
    specialization TEXT,
    phone TEXT,
    email TEXT,
    joining_date DATE,
    office_room TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Staff Class/Subject Assignments (Authorization boundary for staff)
CREATE TABLE IF NOT EXISTS staff_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    department TEXT NOT NULL,
    semester TEXT NOT NULL,
    section TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    role_in_class TEXT DEFAULT 'Subject Teacher',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE(staff_id, department, semester, section, subject_code)
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS student_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    staff_id INTEGER,
    date DATE NOT NULL,
    time_slot TEXT,
    status TEXT NOT NULL, -- 'Present', 'Absent', 'OnDuty', 'Late'
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- Student Academic Marks
CREATE TABLE IF NOT EXISTS student_marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    semester TEXT NOT NULL,
    exam_type TEXT NOT NULL, -- 'Mid-1', 'Mid-2', 'Semester End', 'Lab Internal'
    max_marks REAL NOT NULL,
    marks_obtained REAL NOT NULL,
    grade TEXT,
    status TEXT DEFAULT 'Pass', -- 'Pass', 'Fail', 'Absent'
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    evaluated_by_staff_id INTEGER,
    remarks TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(evaluated_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- Class Timetables
CREATE TABLE IF NOT EXISTS student_timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department TEXT NOT NULL,
    semester TEXT NOT NULL,
    section TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    room_number TEXT,
    staff_id INTEGER,
    FOREIGN KEY(staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- Assignments
CREATE TABLE IF NOT EXISTS student_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    department TEXT NOT NULL,
    semester TEXT NOT NULL,
    section TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    max_marks INTEGER DEFAULT 10,
    attachment_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- Assignment Submissions
CREATE TABLE IF NOT EXISTS student_assignment_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    submission_content TEXT,
    attachment_url TEXT,
    marks_awarded REAL,
    feedback TEXT,
    status TEXT DEFAULT 'Submitted',
    FOREIGN KEY(assignment_id) REFERENCES student_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE(assignment_id, student_id)
);

-- Student Fees Ledger
CREATE TABLE IF NOT EXISTS student_fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    fee_type TEXT NOT NULL,
    total_amount REAL NOT NULL,
    paid_amount REAL NOT NULL DEFAULT 0,
    due_amount REAL NOT NULL,
    due_date DATE,
    payment_status TEXT NOT NULL DEFAULT 'Unpaid', -- 'Paid', 'Partial', 'Unpaid'
    last_payment_date DATE,
    receipt_number TEXT,
    payment_mode TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Portal Announcements with Audience Filtering
CREATE TABLE IF NOT EXISTS portal_announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Academic', -- 'Academic', 'Examinations', 'Fee Reminder', 'Administrative', 'Events'
    target_audience TEXT NOT NULL DEFAULT 'all', -- 'all', 'students', 'parents', 'staff'
    department TEXT DEFAULT 'all',
    priority TEXT DEFAULT 'normal', -- 'normal', 'high', 'urgent'
    posted_date DATE DEFAULT CURRENT_DATE,
    posted_by TEXT DEFAULT 'Academic Section',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Role/User Specific Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'alert'
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_roll ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_parents_user ON parents(user_id);
CREATE INDEX IF NOT EXISTS idx_parent_map ON parent_student_mappings(parent_id, student_id);
CREATE INDEX IF NOT EXISTS idx_staff_user ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments ON staff_assignments(staff_id, department, semester, section);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON student_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_student ON student_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_timetable_class ON student_timetable(department, semester, section);
CREATE INDEX IF NOT EXISTS idx_fees_student ON student_fees(student_id);
CREATE INDEX IF NOT EXISTS idx_portal_news_audience ON portal_announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON user_notifications(user_id);
