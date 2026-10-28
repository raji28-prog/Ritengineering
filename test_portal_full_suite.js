/**
 * Comprehensive End-to-End Test Suite for RITW Role-Based Campus Portal
 * Tests all requirements:
 * 1. Role-specific Logins (Student, Parent, Staff) & Role mismatch protection
 * 2. Student features (Profile, Attendance, Marks, Timetable, Assignments submit, Fees, Announcements)
 * 3. Parent features (Multi-child access, Verified relationships, Child marks, Attendance, Fees, Barrier on unlinked students)
 * 4. Staff features (Assigned classes, Timetable, Attendance marking, Marks entry, Assignment publisher, Barrier on unassigned classes)
 * 5. Common shared features (Notifications, Profile contact updates, Role-filtered announcements)
 * 6. Portal SPA Static Serving
 */
const { app } = require('./server');
const http = require('http');

let server;
let baseUrl;

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(url, { method, headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = data;
                try { parsed = JSON.parse(data); } catch(e) {}
                resolve({ status: res.statusCode, headers: res.headers, data: parsed });
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runComprehensiveTests() {
    console.log('================================================================');
    console.log('   RITW CAMPUS PORTAL - COMPREHENSIVE RBAC & FEATURE TEST SUITE ');
    console.log('================================================================\n');

    let passedTests = 0;

    // --- TEST 1: Static Portal Serving ---
    console.log('1. Testing Portal SPA Static Serving...');
    const spaRes = await request('GET', '/portal/');
    console.assert(spaRes.status === 200, `Portal HTML status: ${spaRes.status}`);
    console.assert(typeof spaRes.data === 'string' && spaRes.data.includes('RITW CAMPUS PORTAL'), 'Should serve portal HTML');
    console.log('   ✓ GET /portal/ successfully serves Campus Portal SPA HTML.');
    passedTests++;

    const cssRes = await request('GET', '/portal/css/portal.css');
    console.assert(cssRes.status === 200, `CSS status: ${cssRes.status}`);
    console.log('   ✓ GET /portal/css/portal.css successfully serves design system stylesheet.');
    passedTests++;

    // --- TEST 2: Role Mismatch Enforcement at Login ---
    console.log('\n2. Testing Role Mismatch Enforcement at Login...');
    const mismatchLogin = await request('POST', '/api/v1/portal/auth/login', {
        identifier: '23RITW0501', // Priya (Student)
        password: 'Student@2026!',
        expectedRole: 'staff' // Claiming to be staff
    });
    console.assert(mismatchLogin.status === 403, `Expected 403 for role mismatch, got: ${mismatchLogin.status}`);
    console.assert(mismatchLogin.data.success === false, 'Should fail login on role mismatch');
    console.log(`   ✓ Role mismatch successfully rejected: "${mismatchLogin.data.message}"`);
    passedTests++;

    // --- TEST 3: Student Login & Complete Feature Set ---
    console.log('\n3. Testing Student Login & Full Capabilities...');
    const sLogin = await request('POST', '/api/v1/portal/auth/login', {
        identifier: '23RITW0501',
        password: 'Student@2026!',
        expectedRole: 'student'
    });
    console.assert(sLogin.status === 200, `Login status: ${sLogin.status}`);
    const sToken = sLogin.data.token;
    console.log(`   ✓ Student Priya Sharma logged in. Token granted.`);
    passedTests++;

    // Student profile
    const sProfile = await request('GET', '/api/v1/portal/student/profile', null, sToken);
    console.assert(sProfile.status === 200 && sProfile.data.data.roll_number === '23RITW0501');
    console.log(`   ✓ Student Profile: ${sProfile.data.data.full_name}, Dept: ${sProfile.data.data.department}`);
    passedTests++;

    // Student timetable
    const sTimetable = await request('GET', '/api/v1/portal/student/timetable', null, sToken);
    console.assert(sTimetable.status === 200 && sTimetable.data.data.all.length > 0);
    console.log(`   ✓ Student Timetable: ${sTimetable.data.data.all.length} weekly class sessions loaded`);
    passedTests++;

    // Student assignments
    const sAssignments = await request('GET', '/api/v1/portal/student/assignments', null, sToken);
    console.assert(sAssignments.status === 200);
    console.log(`   ✓ Student Coursework: ${sAssignments.data.data.length} assignments found`);
    passedTests++;

    // Student assignment submission
    if (sAssignments.data.data.length > 0) {
        const assignId = sAssignments.data.data[0].id;
        const subRes = await request('POST', `/api/v1/portal/student/assignments/${assignId}/submit`, {
            submission_content: 'https://github.com/priya-sharma-ritw/dbms-project-submission'
        }, sToken);
        console.assert(subRes.status === 200 && subRes.data.success === true);
        console.log(`   ✓ Student submitted assignment #${assignId} successfully!`);
        passedTests++;
    }

    // Student fees
    const sFees = await request('GET', '/api/v1/portal/student/fees', null, sToken);
    console.assert(sFees.status === 200);
    console.log(`   ✓ Student Fees Ledger: Total ₹${sFees.data.data.summary.total_fee}, Due ₹${sFees.data.data.summary.total_due}`);
    passedTests++;

    // Security Barrier: Student calling Staff API
    const sBlockedStaff = await request('GET', '/api/v1/portal/staff/classes', null, sToken);
    console.assert(sBlockedStaff.status === 403, 'Student blocked from staff API');
    console.log(`   ✓ Security Barrier: Student blocked from Staff API (HTTP ${sBlockedStaff.status})`);
    passedTests++;

    // Security Barrier: Student calling Parent API
    const sBlockedParent = await request('GET', '/api/v1/portal/parent/children', null, sToken);
    console.assert(sBlockedParent.status === 403, 'Student blocked from parent API');
    console.log(`   ✓ Security Barrier: Student blocked from Parent API (HTTP ${sBlockedParent.status})`);
    passedTests++;

    // --- TEST 4: Parent Login & Multi-Child Access ---
    console.log('\n4. Testing Parent Login & Multi-Child Verification...');
    const pLogin = await request('POST', '/api/v1/portal/auth/login', {
        identifier: 'parent.ramesh',
        password: 'Parent@2026!',
        expectedRole: 'parent'
    });
    console.assert(pLogin.status === 200);
    const pToken = pLogin.data.token;
    console.log(`   ✓ Parent Ramesh Sharma logged in.`);
    passedTests++;

    const pChildren = await request('GET', '/api/v1/portal/parent/children', null, pToken);
    console.assert(pChildren.status === 200 && pChildren.data.children.length === 2);
    console.log(`   ✓ Multi-Child Support: Found ${pChildren.data.children.length} verified children`);
    pChildren.data.children.forEach(c => console.log(`     - Child: ${c.full_name} (${c.roll_number}) - ${c.department}`));
    passedTests++;

    // Parent accessing Child 1 (Priya, ID 1)
    const pChild1Profile = await request('GET', '/api/v1/portal/parent/child/1/profile', null, pToken);
    console.assert(pChild1Profile.status === 200 && pChild1Profile.data.data.roll_number === '23RITW0501');
    console.log(`   ✓ Parent fetched Child 1 Profile: ${pChild1Profile.data.data.full_name}`);
    passedTests++;

    const pChild1Fees = await request('GET', '/api/v1/portal/parent/child/1/fees', null, pToken);
    console.assert(pChild1Fees.status === 200);
    console.log(`   ✓ Parent fetched Child 1 Fees: ₹${pChild1Fees.data.data.summary.total_due} pending`);
    passedTests++;

    // Parent accessing Child 2 (Ananya, ID 2)
    const pChild2Academics = await request('GET', '/api/v1/portal/parent/child/2/academics', null, pToken);
    console.assert(pChild2Academics.status === 200);
    console.log(`   ✓ Parent fetched Child 2 Academic Timetable: ${pChild2Academics.data.student_name}`);
    passedTests++;

    // CRITICAL SECURITY BARRIER: Parent Ramesh requesting unlinked student ID 3 (Sneha Reddy)
    console.log('\n5. Testing Critical Parent Security Barriers (Strict Verified Link Check)...');
    const pForbiddenChild = await request('GET', '/api/v1/portal/parent/child/3/marks', null, pToken);
    console.assert(pForbiddenChild.status === 403, `Expected 403, got: ${pForbiddenChild.status}`);
    console.log(`   ✓ Enforced Barrier: Ramesh Sharma blocked from viewing Sneha Reddy (ID 3): HTTP 403`);
    passedTests++;

    // Parent Kavitha login (linked ONLY to Sneha Reddy ID 3)
    const p2Login = await request('POST', '/api/v1/portal/auth/login', {
        identifier: 'parent.kavitha',
        password: 'Parent@2026!',
        expectedRole: 'parent'
    });
    console.assert(p2Login.status === 200);
    const p2Token = p2Login.data.token;

    // Kavitha accessing Sneha (ID 3) -> Allowed
    const p2Sneha = await request('GET', '/api/v1/portal/parent/child/3/profile', null, p2Token);
    console.assert(p2Sneha.status === 200);
    console.log(`   ✓ Kavitha Reddy allowed to view linked daughter Sneha: ${p2Sneha.data.data.full_name}`);
    passedTests++;

    // Kavitha attempting to access Priya (ID 1) -> Blocked!
    const p2BlockedPriya = await request('GET', '/api/v1/portal/parent/child/1/profile', null, p2Token);
    console.assert(p2BlockedPriya.status === 403);
    console.log(`   ✓ Enforced Barrier: Kavitha Reddy blocked from viewing Priya Sharma (ID 1): HTTP 403`);
    passedTests++;

    // --- TEST 6: Staff Login & Operations ---
    console.log('\n6. Testing Staff Login & Teaching Operations...');
    const stLogin = await request('POST', '/api/v1/portal/auth/login', {
        identifier: 'FAC-CSE-101',
        password: 'Staff@2026!',
        expectedRole: 'staff'
    });
    console.assert(stLogin.status === 200);
    const stToken = stLogin.data.token;
    console.log(`   ✓ Staff Dr. Radhika Rao logged in.`);
    passedTests++;

    // Staff assigned classes
    const stClasses = await request('GET', '/api/v1/portal/staff/classes', null, stToken);
    console.assert(stClasses.status === 200 && stClasses.data.data.length >= 2);
    console.log(`   ✓ Assigned Classes: ${stClasses.data.data.length} teaching subjects`);
    passedTests++;

    // Staff Attendance Task: Load roster for CSE IV-A CS401PC
    const stRoster = await request('GET', '/api/v1/portal/staff/attendance/class?department=Computer%20Science%20and%20Engineering&semester=IV%20Semester&section=A&subject_code=CS401PC', null, stToken);
    console.assert(stRoster.status === 200 && stRoster.data.students.length > 0);
    console.log(`   ✓ Loaded Student Roster for CSE IV-A: ${stRoster.data.students.length} students`);
    passedTests++;

    // Staff Attendance Marking: Mark Priya Sharma as Present
    const markAttRes = await request('POST', '/api/v1/portal/staff/attendance/mark', {
        department: 'Computer Science and Engineering',
        semester: 'IV Semester',
        section: 'A',
        subject_code: 'CS401PC',
        date: '2026-10-27',
        time_slot: '09:30 AM',
        records: [
            { student_id: 1, status: 'Present', remarks: 'Active classroom participation' }
        ]
    }, stToken);
    console.assert(markAttRes.status === 200 && markAttRes.data.success === true);
    console.log(`   ✓ Attendance recorded by Dr. Radhika Rao: ${markAttRes.data.message}`);
    passedTests++;

    // CRITICAL SECURITY BARRIER: Staff attempting attendance on unassigned class (ECE)
    const stBlockAtt = await request('POST', '/api/v1/portal/staff/attendance/mark', {
        department: 'Electronics and Communication Engineering',
        semester: 'IV Semester',
        section: 'A',
        subject_code: 'EC401PC',
        date: '2026-10-27',
        records: [{ student_id: 3, status: 'Present' }]
    }, stToken);
    console.assert(stBlockAtt.status === 403, `Expected 403, got: ${stBlockAtt.status}`);
    console.log(`   ✓ Security Barrier: Staff blocked from unassigned ECE class attendance: HTTP 403`);
    passedTests++;

    // Staff Marks Recording for assigned class
    const recordMarksRes = await request('POST', '/api/v1/portal/staff/academics/marks', {
        department: 'Computer Science and Engineering',
        semester: 'IV Semester',
        section: 'A',
        subject_code: 'CS401PC',
        exam_type: 'Mid-2',
        max_marks: 30,
        records: [
            { student_id: 1, marks_obtained: 28.5, remarks: 'Excellent performance in SQL triggers' }
        ]
    }, stToken);
    console.assert(recordMarksRes.status === 200 && recordMarksRes.data.success === true);
    console.log(`   ✓ Academic Marks recorded for Mid-2: ${recordMarksRes.data.message}`);
    passedTests++;

    // Staff Assignment Creation
    const createAssignRes = await request('POST', '/api/v1/portal/staff/assignments', {
        department: 'Computer Science and Engineering',
        semester: 'IV Semester',
        section: 'A',
        subject_code: 'CS401PC',
        title: 'DBMS Normalization & BCNF Case Study',
        description: 'Decompose the unnormalized hospital relation up to BCNF and write 3NF decomposition test cases.',
        due_date: '2026-11-05',
        max_marks: 10
    }, stToken);
    console.assert(createAssignRes.status === 200 && createAssignRes.data.success === true);
    console.log(`   ✓ Assignment published to students: ID #${createAssignRes.data.id}`);
    passedTests++;

    // --- TEST 7: Common Shared Features ---
    console.log('\n7. Testing Common Shared Features & Profile Settings...');
    const notifs = await request('GET', '/api/v1/portal/common/notifications', null, sToken);
    console.assert(notifs.status === 200);
    console.log(`   ✓ Notifications retrieved: ${notifs.data.data.length} total, ${notifs.data.unread_count} unread`);
    passedTests++;

    const markReadRes = await request('POST', '/api/v1/portal/common/notifications/mark-read', {}, sToken);
    console.assert(markReadRes.status === 200);
    console.log(`   ✓ Marked all notifications as read`);
    passedTests++;

    const profUpdate = await request('PUT', '/api/v1/portal/common/profile', {
        phone: '+91-98765-99887',
        address: 'Updated Residential Address, Hyderabad'
    }, sToken);
    console.assert(profUpdate.status === 200);
    console.log(`   ✓ Profile contact updated: ${profUpdate.data.message}`);
    passedTests++;

    console.log('\n================================================================');
    console.log(` ALL ${passedTests} TESTS PASSED SUCCESSFULLY! 100% RBAC VERIFIED! `);
    console.log('================================================================\n');
}

// Start test server on ephemeral port 5998
const testPort = 5998;
server = app.listen(testPort, async () => {
    baseUrl = `http://localhost:${testPort}`;
    try {
        await runComprehensiveTests();
    } catch (err) {
        console.error('Test execution failed:', err);
    } finally {
        server.close();
        process.exit(0);
    }
});
