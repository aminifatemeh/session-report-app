/* ──────────────────────────────────────────
   Base config
────────────────────────────────────────── */
const BASE_URL = 'http://127.0.0.1:8000/api';

/* ──────────────────────────────────────────
   Token helpers
   Tokens are stored in localStorage so they
   survive page refresh.
────────────────────────────────────────── */
export function getAccessToken() {
    return localStorage.getItem('access_token');
}

function saveTokens(tokens) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
}

export function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

/* ──────────────────────────────────────────
   Core fetch wrapper
   - Attaches the Bearer token automatically
   - Throws a plain Error with the server's
     message so components can show it
────────────────────────────────────────── */
async function request(path, options = {}) {
    const token = getAccessToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    // No content (e.g. 204)
    if (res.status === 204) return null;

    const data = await res.json();

    if (!res.ok) {
        // Use the server's error message if available
        const message =
            data?.error ||
            data?.detail ||
            `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return data;
}

/* ──────────────────────────────────────────
   AUTH
────────────────────────────────────────── */
export async function login(username, password) {
    const data = await request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });

    saveTokens(data.tokens);

    // Return the user object in the same shape the app expects
    return {
        id:        data.user.id,
        username:  data.user.username,
        firstName: data.user.first_name,
        lastName:  data.user.last_name,
        role:      data.user.role,
        classLink: data.user.class_link,
    };
}

/* ──────────────────────────────────────────
   TEACHERS
────────────────────────────────────────── */
export async function getTeachers() {
    const data = await request('/teachers/');
    return data.map(normalizeUser);
}

export async function getTeacherById(id) {
    const data = await request(`/teachers/${id}/`);
    return normalizeUser(data);
}

export async function createTeacher(formData) {
    const data = await request('/teachers/', {
        method: 'POST',
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName:  formData.lastName,
            username:  formData.username,
            password:  formData.password,
            classLink: formData.classLink,
        }),
    });
    return normalizeUser(data);
}

export async function getTeacherWithStudents(teacherId) {
    const data = await request(`/teachers/${teacherId}/with-students/`);
    return {
        teacher:  normalizeUser(data.teacher),
        students: data.students.map(s => ({
            ...normalizeUser(s),
            currentTerm: s.currentTerm ? normalizeTerm(s.currentTerm) : null,
        })),
    };
}

/* ──────────────────────────────────────────
   STUDENTS
────────────────────────────────────────── */
export async function getStudents() {
    const data = await request('/students/');
    return data.map(normalizeUser);
}

export async function getStudentById(id) {
    const data = await request(`/students/${id}/`);
    return normalizeUser(data);
}

export async function createStudent(formData) {
    const data = await request('/students/', {
        method: 'POST',
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName:  formData.lastName,
            username:  formData.username,
            password:  formData.password,
        }),
    });
    return normalizeUser(data);
}

export async function getStudentDashboard(studentId) {
    const data = await request(`/students/${studentId}/dashboard/`);
    return {
        student:     normalizeUser(data.student),
        terms:       data.terms.map(normalizeTerm),
        currentTerm: data.currentTerm ? normalizeTerm(data.currentTerm) : null,
    };
}

/* ──────────────────────────────────────────
   TERMS
────────────────────────────────────────── */
export async function getTermsByStudent(studentId) {
    const data = await request(`/terms/?student=${studentId}`);
    return data.map(normalizeTerm);
}

export async function getTermsByTeacher(teacherId) {
    const data = await request(`/terms/?teacher=${teacherId}`);
    return data.map(normalizeTerm);
}

export async function getTermById(id) {
    const data = await request(`/terms/${id}/`);
    return normalizeTerm(data);
}

export async function createTerm(formData) {
    const data = await request('/terms/', {
        method: 'POST',
        body: JSON.stringify({
            studentId: formData.studentId,
            teacherId: formData.teacherId,
            startDate: formData.startDate,   // Gregorian ISO
            classDays: formData.classDays,
            classTime: formData.classTime,
        }),
    });
    return normalizeTerm(data);
}

/* ──────────────────────────────────────────
   SESSIONS
────────────────────────────────────────── */
export async function getSessionsByTerm(termId) {
    const data = await request(`/sessions/?term=${termId}`);
    return data.map(normalizeSession);
}

export async function getSessionById(id) {
    const data = await request(`/sessions/${id}/`);
    return normalizeSession(data);
}

export async function saveReport(sessionId, reportData, submit = false) {
    const data = await request(`/sessions/${sessionId}/report/`, {
        method: 'PATCH',
        body: JSON.stringify({
            date:                 reportData.date,
            lessonCovered:        reportData.lessonCovered,
            postClassActivity:    reportData.postClassActivity,
            summaryOfActivities:  reportData.summaryOfActivities,
            extraPoints:          reportData.extraPoints,
            homeworkAssigned:     reportData.homeworkAssigned,
            positivePoints:       reportData.positivePoints,
            areasForImprovement:  reportData.areasForImprovement,
            submit,
        }),
    });
    return normalizeSession(data);
}

export async function submitReport(sessionId, reportData) {
    return saveReport(sessionId, reportData, true);
}

/* ──────────────────────────────────────────
   SUPERVISOR DASHBOARD
────────────────────────────────────────── */
export async function getSupervisorDashboard() {
    return request('/supervisor/dashboard/');
}

/* ──────────────────────────────────────────
   Normalizers
   The backend uses snake_case; the frontend
   expects camelCase. These functions convert.
────────────────────────────────────────── */
function normalizeUser(u) {
    return {
        id:        u.id,
        username:  u.username,
        firstName: u.first_name,
        lastName:  u.last_name,
        fullName:  u.fullName,
        role:      u.role,
        classLink: u.class_link,
    };
}

function normalizeTerm(t) {
    return {
        id:          t.id,
        studentId:   t.student,
        teacherId:   t.teacher,
        teacherName: t.teacher_name,
        termNumber:  t.term_number,
        startDate:   t.start_date,
        classDays:   t.class_days,
        classTime:   t.class_time,
        classLink:   t.class_link,
    };
}

function normalizeSession(s) {
    return {
        id:            s.id,
        termId:        s.term,
        sessionNumber: s.session_number,
        date:          s.date,
        status:        s.status,
        report:        s.report ? normalizeReport(s.report) : null,
    };
}

function normalizeReport(r) {
    return {
        date:                r.date,
        lessonCovered:       r.lesson_covered,
        postClassActivity:   r.post_class_activity,
        summaryOfActivities: r.summary_of_activities,
        extraPoints:         r.extra_points,
        homeworkAssigned:    r.homework_assigned,
        positivePoints:      r.positivePoints,
        areasForImprovement: r.areas_for_improvement,
        isSubmitted:         r.is_submitted,
    };
}