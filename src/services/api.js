import {
    supervisor  as _supervisor,
    teachers    as _teachers,
    students    as _students,
    terms       as _terms,
    sessions    as _sessions,
} from '../mock/data';
import { generateSessionDates } from '../utils/dateUtils';

/* ──────────────────────────────────────────
   In-memory mutable state
   (survives React re-renders, resets on page refresh)
────────────────────────────────────────── */
let supervisorData = { ..._supervisor };
let teachersData   = _teachers.map(t => ({ ...t }));
let studentsData   = _students.map(s => ({ ...s }));
let termsData      = _terms.map(t => ({ ...t }));
let sessionsData   = _sessions.map(s => ({
    ...s,
    report: s.report ? { ...s.report } : null,
}));

/* ──────────────────────────────────────────
   Utilities
────────────────────────────────────────── */
const delay = (ms = 120) => new Promise(r => setTimeout(r, ms));

let _idCounter = 1000;
const genId = (prefix) => `${prefix}-${++_idCounter}`;

/* ──────────────────────────────────────────
   AUTH
────────────────────────────────────────── */
export async function login(username, password) {
    await delay();

    if (
        username === supervisorData.username &&
        password === supervisorData.password
    ) {
        return { ...supervisorData };
    }

    const teacher = teachersData.find(
        t => t.username === username && t.password === password
    );
    if (teacher) return { ...teacher };

    const student = studentsData.find(
        s => s.username === username && s.password === password
    );
    if (student) return { ...student };

    throw new Error('Invalid username or password.');
}

/* ──────────────────────────────────────────
   TEACHERS
────────────────────────────────────────── */
export async function getTeachers() {
    await delay();
    return teachersData.map(t => ({ ...t }));
}

export async function getTeacherById(id) {
    await delay();
    const t = teachersData.find(t => t.id === id);
    if (!t) throw new Error(`Teacher ${id} not found`);
    return { ...t };
}

export async function createTeacher(data) {
    await delay();
    const teacher = {
        id:        genId('tch'),
        role:      'teacher',
        firstName: data.firstName.trim(),
        lastName:  data.lastName.trim(),
        username:  data.username.trim(),
        password:  data.password,
        classLink: data.classLink.trim(),
    };
    teachersData.push(teacher);
    return { ...teacher };
}

export async function getTeacherWithStudents(teacherId) {
    await delay();
    const teacher = await getTeacherById(teacherId);

    // All terms taught by this teacher
    const myTerms = termsData.filter(t => t.teacherId === teacherId);

    // Find current term per student (highest termNumber)
    const studentMap = {};
    for (const term of myTerms) {
        if (
            !studentMap[term.studentId] ||
            term.termNumber > studentMap[term.studentId].termNumber
        ) {
            studentMap[term.studentId] = term;
        }
    }

    const students = await Promise.all(
        Object.entries(studentMap).map(async ([studentId, currentTerm]) => {
            const s = await getStudentById(studentId);
            return { ...s, currentTerm };
        })
    );

    return { teacher, students };
}

/* ──────────────────────────────────────────
   STUDENTS
────────────────────────────────────────── */
export async function getStudents() {
    await delay();
    return studentsData.map(s => ({ ...s }));
}

export async function getStudentById(id) {
    await delay();
    const s = studentsData.find(s => s.id === id);
    if (!s) throw new Error(`Student ${id} not found`);
    return { ...s };
}

export async function createStudent(data) {
    await delay();
    const student = {
        id:        genId('std'),
        role:      'student',
        firstName: data.firstName.trim(),
        lastName:  data.lastName.trim(),
        username:  data.username.trim(),
        password:  data.password,
    };
    studentsData.push(student);
    return { ...student };
}

export async function getStudentDashboard(studentId) {
    await delay();
    const student = await getStudentById(studentId);
    const allTerms = termsData.filter(t => t.studentId === studentId);
    allTerms.sort((a, b) => a.termNumber - b.termNumber);
    const currentTerm =
        allTerms.length > 0 ? { ...allTerms[allTerms.length - 1] } : null;
    return { student, terms: allTerms.map(t => ({ ...t })), currentTerm };
}

/* ──────────────────────────────────────────
   TERMS
────────────────────────────────────────── */
export async function getTermsByStudent(studentId) {
    await delay();
    return termsData
        .filter(t => t.studentId === studentId)
        .map(t => ({ ...t }))
        .sort((a, b) => a.termNumber - b.termNumber);
}

export async function getTermsByTeacher(teacherId) {
    await delay();
    return termsData
        .filter(t => t.teacherId === teacherId)
        .map(t => ({ ...t }));
}

export async function getTermById(id) {
    await delay();
    const t = termsData.find(t => t.id === id);
    if (!t) throw new Error(`Term ${id} not found`);
    return { ...t };
}

export async function createTerm(data) {
    await delay();

    // Calculate next term number for this student
    const existing = termsData.filter(t => t.studentId === data.studentId);
    const termNumber = existing.length + 1;

    const term = {
        id:          genId('trm'),
        studentId:   data.studentId,
        teacherId:   data.teacherId,
        termNumber,
        startDate:   data.startDate,   // Gregorian ISO
        classDays:   data.classDays,
        classTime:   data.classTime,
    };
    termsData.push(term);

    // Auto-generate 12 sessions
    const dates = generateSessionDates(data.startDate, data.classDays, 12);
    dates.forEach((date, i) => {
        sessionsData.push({
            id:            genId('ses'),
            termId:        term.id,
            sessionNumber: i + 1,
            date,
            status:        'pending',
            report:        null,
        });
    });

    return { ...term };
}

/* ──────────────────────────────────────────
   SESSIONS
────────────────────────────────────────── */
export async function getSessionsByTerm(termId) {
    await delay();
    return sessionsData
        .filter(s => s.termId === termId)
        .map(s => ({ ...s, report: s.report ? { ...s.report } : null }))
        .sort((a, b) => a.sessionNumber - b.sessionNumber);
}

export async function getSessionById(id) {
    await delay();
    const s = sessionsData.find(s => s.id === id);
    if (!s) throw new Error(`Session ${id} not found`);
    return { ...s, report: s.report ? { ...s.report } : null };
}

/**
 * Save a draft report (status stays 'pending').
 */
export async function saveReport(sessionId, reportData, submit = false) {
    await delay();
    const idx = sessionsData.findIndex(s => s.id === sessionId);
    if (idx === -1) throw new Error(`Session ${sessionId} not found`);

    sessionsData[idx] = {
        ...sessionsData[idx],
        report: { ...reportData },
        status: submit ? 'reported' : sessionsData[idx].status,
        // also update the session date if the teacher edited it
        date: reportData.date ?? sessionsData[idx].date,
    };

    return {
        ...sessionsData[idx],
        report: { ...sessionsData[idx].report },
    };
}

/**
 * Submit a report (status becomes 'reported').
 */
export async function submitReport(sessionId, reportData) {
    return saveReport(sessionId, reportData, true);
}

/* ──────────────────────────────────────────
   SUPERVISOR DASHBOARD
────────────────────────────────────────── */
export async function getSupervisorDashboard() {
    await delay();
    return {
        teacherCount: teachersData.length,
        studentCount: studentsData.length,
        termCount:    termsData.length,
        sessionCount: sessionsData.length,
        reportedCount: sessionsData.filter(s => s.status === 'reported').length,
    };
}
