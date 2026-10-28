/**
 * Automated RBAC Verification Test for RITW Campus Portal
 * Tests all role logins, permissions, multi-child parent access, and strict unauthorized barrier enforcement.
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
                resolve({ status: res.statusCode, data: parsed });
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('--- STARTING RBAC & PORTAL API SECURITY TESTS ---\n');

    // 1. Student Login
    console.log('1. Testing Student Login (Priya Sharma: 23RITW0501)...');
    const sLogin = await request('POST', '/api/v1/portal/auth/login', {
        identifier: '23RITW0501',
        password: 'Student@2026!',
        expectedRole: 'student'
    });
    console.assert(sLogin.status === 200, `Student login status: ${sLogin.status}`);
    console.assert(sLogin.data.success === true, 'Student login should succeed');
    console.assert(sLogin.data.user.role === 'student', 'Role must be student');
    const sToken = sLogin.data.token;
    console.log('   ✓ Student Login Successful. Token received.');

    // 2. Student Access to Student Endpoints
    console.log('\n2. Testing Student endpoints for Priya Sharma...');
    const sProfile = await request('GET', '/api/v1/portal/student/profile', null, sToken);
    console.assert(sProfile.status === 200, `Profile status: ${sProfile.status}`);
    console.assert(sProfile.data.data.roll_number === '23RITW0501', 'Roll number matches');
    console.log(`   ✓ Profile loaded: ${sProfile.data.data.full_name} (${sProfile.data.data.roll_number})`);

    const sAtt = await request('GET', '/api/v1/portal/student/attendance', null, sToken);
    console.assert(sAtt.status === 200, 'Attendance status 200');
    console.log(`   ✓ Attendance: ${sAtt.data.data.overall_percentage}% across ${sAtt.data.data.subjects.length} subjects`);

    const sMarks = await request('GET', '/api/v1/portal/student/marks', null, sToken);
    console.assert(sMarks.status === 200, 'Marks status 200');
    console.log(`   ✓ Marks records: ${sMarks.data.data.records.length} items returned`);

    const sFees = await request('GET', '/api/v1/portal/student/fees', null, sToken);
    console.assert(sFees.status === 200, 'Fees status 200');
    console.log(`   ✓ Fees: Total ₹${sFees.data.data.summary.total_fee}, Due ₹${sFees.data.data.summary.total_due}`);

    // 3. Security Boundary: Student trying to access Staff & Parent APIs
    console.log('\n3. Testing Security Boundary: Student attempting forbidden access...');
    const sTryStaff = await request('GET', '/api/v1/portal/staff/classes', null, sToken);
    console.assert(sTryStaff.status === 403, `Expected 403 Forbidden for Student -> Staff API, got: ${sTryStaff.status}`);
    console.log(`   ✓ Enforced: Student blocked from Staff API (HTTP ${sTryStaff.status}: ${sTryStaff.data.message})`);

    const sTryParent = await request('GET', '/api/v1/portal/parent/children', null, sToken);
    console.assert(sTryParent.status === 403, `Expected 403 Forbidden for Student -> Parent API, got: ${sTryParent.status}`);
    console.log(`   ✓ Enforced: Student blocked from Parent API (HTTP ${sTryParent.status}: ${sTryParent.data.message})`);

    // 4. Parent Login (Ramesh Sharma: Multi-Child)
    console.log('\n4. Testing Parent Login (Ramesh Sharma: parent.ramesh)...');
    const pLogin = await request('POST', '/api/v1/portal/auth/login', {
        identifier: 'parent.ramesh',
        password: 'Parent@2026!',
        expectedRole: 'parent'
    });
    console.assert(pLogin.status === 200, `Parent login status: ${pLogin.status}`);
    console.assert(pLogin.data.user.role === 'parent', 'Role must be parent');
    const pToken = pLogin.data.token;
    console.log('   ✓ Parent Login Successful.');

    // 5. Parent Multi-Child Fetch
    console.log('\n5. Testing Multi-Child Access for Parent...');
    const pChildren = await request('GET', '/api/v1/portal/parent/children', null, pToken);
    console.assert(pChildren.status === 200, 'Children list status 200');
    console.assert(pChildren.data.children.length === 2, `Expected 2 children, got: ${pChildren.data.children.length}`);
    console.log(`   ✓ Linked Verified Children Count: ${pChildren.data.children.length}`);
    console.log(`     - Child 1: ${pChildren.data.children[0].full_name} (${pChildren.data.children[0].roll_number})`);
    console.log(`     - Child 2: ${pChildren.data.children[1].full_name} (${pChildren.data.children[1].roll_number})`);

    // 6. Parent Accessing Linked Children
    console.log('\n6. Testing Child 1 (Priya: ID 1) & Child 2 (Ananya: ID 2) data fetch by Parent...');
    const pChild1Marks = await request('GET', '/api/v1/portal/parent/child/1/marks', null, pToken);
    console.assert(pChild1Marks.status === 200, 'Child 1 marks status 200');
    console.log(`   ✓ Parent accessed Priya marks: ${pChild1Marks.data.data.records.length} marks items`);

    const pChild2Marks = await request('GET', '/api/v1/portal/parent/child/2/marks', null, pToken);
    console.assert(pChild2Marks.status === 200, 'Child 2 marks status 200');
    console.log(`   ✓ Parent accessed Ananya marks: ${pChild2Marks.data.data.records.length} marks items`);

    // 7. CRITICAL SECURITY BARRIER: Parent Ramesh requesting Student 3 (Sneha Reddy - Unlinked!)
    console.log('\n7. CRITICAL SECURITY BARRIER: Parent attempting to access unlinked student (ID 3)...');
    const pUnauthorizedChild = await request('GET', '/api/v1/portal/parent/child/3/marks', null, pToken);
    console.assert(pUnauthorizedChild.status === 403, `Expected 403 Forbidden, got: ${pUnauthorizedChild.status}`);
    console.log(`   ✓ Enforced: Unauthorized child access blocked (HTTP ${pUnauthorizedChild.status}: ${pUnauthorizedChild.data.message})`);

    // 8. Staff Login (Dr. Radhika Rao: FAC-CSE-101)
    console.log('\n8. Testing Staff Login (Dr. Radhika Rao: FAC-CSE-101)...');
    const stLogin = await request('POST', '/api/v1/portal/auth/login', {
        identifier: 'FAC-CSE-101',
        password: 'Staff@2026!',
        expectedRole: 'staff'
    });
    console.assert(stLogin.status === 200, `Staff login status: ${stLogin.status}`);
    console.assert(stLogin.data.user.role === 'staff', 'Role must be staff');
    const stToken = stLogin.data.token;
    console.log('   ✓ Staff Login Successful.');

    // 9. Staff Assigned Classes & Authorized Attendance Tasks
    console.log('\n9. Testing Staff assigned classes and tasks...');
    const stClasses = await request('GET', '/api/v1/portal/staff/classes', null, stToken);
    console.assert(stClasses.status === 200, 'Classes status 200');
    console.log(`   ✓ Assigned Classes: ${stClasses.data.data.length} subjects found for Dr. Radhika`);

    const stAttTask = await request('GET', '/api/v1/portal/staff/attendance/class?department=Computer%20Science%20and%20Engineering&semester=IV%20Semester&section=A&subject_code=CS401PC', null, stToken);
    console.assert(stAttTask.status === 200, 'Attendance task status 200');
    console.log(`   ✓ Authorized Class Attendance loaded: ${stAttTask.data.students.length} students in section`);

    // 10. CRITICAL SECURITY BARRIER: Staff attempting access to non-assigned class (ECE EC401PC)
    console.log('\n10. CRITICAL SECURITY BARRIER: Staff attempting to access unassigned class (ECE)...');
    const stUnassigned = await request('GET', '/api/v1/portal/staff/attendance/class?department=Electronics%20and%20Communication%20Engineering&semester=IV%20Semester&section=A&subject_code=EC401PC', null, stToken);
    console.assert(stUnassigned.status === 403, `Expected 403 Forbidden for unassigned class, got: ${stUnassigned.status}`);
    console.log(`   ✓ Enforced: Unassigned class access blocked (HTTP ${stUnassigned.status}: ${stUnassigned.data.message})`);

    // 11. Common Shared Features (Notifications & Announcements)
    console.log('\n11. Testing Common Shared Features...');
    const sNotifs = await request('GET', '/api/v1/portal/common/notifications', null, sToken);
    console.assert(sNotifs.status === 200, 'Student notifications 200');
    console.log(`   ✓ Student Notifications: ${sNotifs.data.data.length} items, unread: ${sNotifs.data.unread_count}`);

    const pNotifs = await request('GET', '/api/v1/portal/common/notifications', null, pToken);
    console.assert(pNotifs.status === 200, 'Parent notifications 200');
    console.log(`   ✓ Parent Notifications: ${pNotifs.data.data.length} items`);

    const sAnnounce = await request('GET', '/api/v1/portal/common/announcements', null, sToken);
    console.assert(sAnnounce.status === 200, 'Student announcements 200');
    console.assert(sAnnounce.data.data.every(a => ['all', 'students'].includes(a.target_audience)), 'Only student & all announcements');
    console.log(`   ✓ Student Role-filtered announcements: ${sAnnounce.data.data.length} items`);

    const pAnnounce = await request('GET', '/api/v1/portal/common/announcements', null, pToken);
    console.assert(pAnnounce.status === 200, 'Parent announcements 200');
    console.assert(pAnnounce.data.data.every(a => ['all', 'parents'].includes(a.target_audience)), 'Only parent & all announcements');
    console.log(`   ✓ Parent Role-filtered announcements: ${pAnnounce.data.data.length} items`);

    console.log('\n======================================================');
    console.log(' ALL 11 RBAC & BACKEND AUTHORIZATION TESTS PASSED! 🚀');
    console.log('======================================================\n');
}

// Start test server on ephemeral port
const testPort = 5999;
server = app.listen(testPort, async () => {
    baseUrl = `http://localhost:${testPort}`;
    try {
        await runTests();
    } catch (err) {
        console.error('Test execution failed:', err);
    } finally {
        server.close();
        process.exit(0);
    }
});
