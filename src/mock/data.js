import { generateSessionDates } from '../utils/dateUtils';

/* ─────────────────────────────────────────────
   SUPERVISOR
───────────────────────────────────────────── */
export const supervisor = {
    id: 'sup-1',
    username: 'admin',
    password: 'admin123',
    firstName: 'Admin',
    lastName:  'Supervisor',
    role:      'supervisor',
};

/* ─────────────────────────────────────────────
   TEACHERS
───────────────────────────────────────────── */
export const teachers = [
    {
        id:         'tch-1',
        username:   'sara.ahmadi',
        password:   'pass1234',
        firstName:  'Sara',
        lastName:   'Ahmadi',
        role:       'teacher',
        classLink:  'https://meet.google.com/abc-defg-hij',
    },
    {
        id:         'tch-2',
        username:   'ali.karimi',
        password:   'pass1234',
        firstName:  'Ali',
        lastName:   'Karimi',
        role:       'teacher',
        classLink:  'https://meet.google.com/xyz-uvwx-yza',
    },
    {
        id:         'tch-3',
        username:   'mina.hosseini',
        password:   'pass1234',
        firstName:  'Mina',
        lastName:   'Hosseini',
        role:       'teacher',
        classLink:  'https://meet.google.com/mnh-iopq-rst',
    },
    {
        id:         'tch-4',
        username:   'reza.moradi',
        password:   'pass1234',
        firstName:  'Reza',
        lastName:   'Moradi',
        role:       'teacher',
        classLink:  'https://meet.google.com/rmo-lmno-pqr',
    },
];

/* ─────────────────────────────────────────────
   STUDENTS
───────────────────────────────────────────── */
export const students = [
    { id: 'std-1',  username: 'parisa.tehrani',  password: 'pass1234', firstName: 'Parisa',  lastName: 'Tehrani',  role: 'student' },
    { id: 'std-2',  username: 'dariush.nazari',  password: 'pass1234', firstName: 'Dariush', lastName: 'Nazari',   role: 'student' },
    { id: 'std-3',  username: 'leila.safari',    password: 'pass1234', firstName: 'Leila',   lastName: 'Safari',   role: 'student' },
    { id: 'std-4',  username: 'hamed.rostami',   password: 'pass1234', firstName: 'Hamed',   lastName: 'Rostami',  role: 'student' },
    { id: 'std-5',  username: 'neda.rahmani',    password: 'pass1234', firstName: 'Neda',    lastName: 'Rahmani',  role: 'student' },
    { id: 'std-6',  username: 'omid.zare',       password: 'pass1234', firstName: 'Omid',    lastName: 'Zare',     role: 'student' },
    { id: 'std-7',  username: 'fatemeh.jafari',  password: 'pass1234', firstName: 'Fatemeh', lastName: 'Jafari',   role: 'student' },
    { id: 'std-8',  username: 'mehdi.bagheri',   password: 'pass1234', firstName: 'Mehdi',   lastName: 'Bagheri',  role: 'student' },
    { id: 'std-9',  username: 'shirin.moosavi',  password: 'pass1234', firstName: 'Shirin',  lastName: 'Moosavi',  role: 'student' },
    { id: 'std-10', username: 'kaveh.ebrahimi',  password: 'pass1234', firstName: 'Kaveh',   lastName: 'Ebrahimi', role: 'student' },
];

/* ─────────────────────────────────────────────
   HELPER — build sessions for a term
───────────────────────────────────────────── */
function makeSessions(termId, startDate, classDays, reportedCount = 0, overrides = {}) {
    const dates = generateSessionDates(startDate, classDays, 12);
    return dates.map((date, i) => {
        const num      = i + 1;
        const id       = `ses-${termId}-${num}`;
        const override = overrides[num];
        const finalDate = override?.date ?? date;
        const isReported = num <= reportedCount;

        return {
            id,
            termId,
            sessionNumber: num,
            date:   finalDate,
            status: isReported ? 'reported' : 'pending',
            report: isReported
                ? {
                    date:                finalDate,
                    lessonCovered:       `Unit ${num} — ${LESSON_TOPICS[num - 1]}`,
                    postClassActivity:   `Review exercises for Unit ${num}`,
                    summaryOfActivities: `Students practiced ${LESSON_TOPICS[num - 1].toLowerCase()} through guided exercises and pair-work activities. Vocabulary was reinforced with flashcard drills.`,
                    extraPoints:         num % 3 === 0 ? 'Spent 10 minutes on pronunciation correction drills.' : '',
                    homeworkAssigned:    `Complete workbook pages ${num * 4 - 3}–${num * 4}. Practice dialogues with a partner.`,
                    positivePoints:      [
                        `Excellent participation in group activities`,
                        `Strong improvement in ${LESSON_TOPICS[num - 1].toLowerCase()}`,
                    ],
                    areasForImprovement: `Needs more practice with ${LESSON_TOPICS[(num) % 12].toLowerCase()}.`,
                }
                : null,
        };
    });
}

const LESSON_TOPICS = [
    'Greetings & Introductions',
    'Present Simple Tense',
    'Daily Routines',
    'Past Simple Tense',
    'Describing People',
    'Future Tense',
    'Comparatives & Superlatives',
    'Modal Verbs',
    'Conditionals',
    'Passive Voice',
    'Reading Comprehension',
    'Writing & Review',
];

/* ─────────────────────────────────────────────
   TERMS
───────────────────────────────────────────── */
export const terms = [
    // std-1 Parisa — 2 terms (term 1 complete, term 2 in progress)
    {
        id: 'trm-1', studentId: 'std-1', teacherId: 'tch-1',
        termNumber: 1, startDate: '2024-09-02',
        classDays: ['Monday', 'Wednesday'], classTime: '17:00',
    },
    {
        id: 'trm-2', studentId: 'std-1', teacherId: 'tch-1',
        termNumber: 2, startDate: '2025-01-06',
        classDays: ['Monday', 'Wednesday'], classTime: '17:00',
    },

    // std-2 Dariush — 1 term in progress
    {
        id: 'trm-3', studentId: 'std-2', teacherId: 'tch-2',
        termNumber: 1, startDate: '2024-11-04',
        classDays: ['Tuesday', 'Thursday'], classTime: '18:30',
    },

    // std-3 Leila — 3 terms (all complete)
    {
        id: 'trm-4', studentId: 'std-3', teacherId: 'tch-1',
        termNumber: 1, startDate: '2023-09-04',
        classDays: ['Sunday', 'Tuesday'], classTime: '16:00',
    },
    {
        id: 'trm-5', studentId: 'std-3', teacherId: 'tch-2',
        termNumber: 2, startDate: '2024-01-08',
        classDays: ['Sunday', 'Tuesday'], classTime: '16:00',
    },
    {
        id: 'trm-6', studentId: 'std-3', teacherId: 'tch-3',
        termNumber: 3, startDate: '2024-09-01',
        classDays: ['Monday', 'Thursday'], classTime: '15:00',
    },

    // std-4 Hamed — 1 term just started
    {
        id: 'trm-7', studentId: 'std-4', teacherId: 'tch-3',
        termNumber: 1, startDate: '2025-01-13',
        classDays: ['Monday', 'Wednesday', 'Friday'], classTime: '10:00',
    },

    // std-5 Neda — 2 terms
    {
        id: 'trm-8', studentId: 'std-5', teacherId: 'tch-2',
        termNumber: 1, startDate: '2024-03-04',
        classDays: ['Wednesday', 'Saturday'], classTime: '11:00',
    },
    {
        id: 'trm-9', studentId: 'std-5', teacherId: 'tch-4',
        termNumber: 2, startDate: '2024-09-07',
        classDays: ['Wednesday', 'Saturday'], classTime: '11:00',
    },

    // std-6 Omid — 1 term halfway
    {
        id: 'trm-10', studentId: 'std-6', teacherId: 'tch-4',
        termNumber: 1, startDate: '2024-10-07',
        classDays: ['Monday', 'Thursday'], classTime: '19:00',
    },

    // std-7 Fatemeh — 1 term
    {
        id: 'trm-11', studentId: 'std-7', teacherId: 'tch-1',
        termNumber: 1, startDate: '2024-11-04',
        classDays: ['Tuesday', 'Saturday'], classTime: '14:00',
    },

    // std-8 Mehdi — 2 terms
    {
        id: 'trm-12', studentId: 'std-8', teacherId: 'tch-3',
        termNumber: 1, startDate: '2024-03-11',
        classDays: ['Tuesday', 'Thursday'], classTime: '20:00',
    },
    {
        id: 'trm-13', studentId: 'std-8', teacherId: 'tch-3',
        termNumber: 2, startDate: '2024-09-09',
        classDays: ['Tuesday', 'Thursday'], classTime: '20:00',
    },

    // std-9 Shirin — 1 term
    {
        id: 'trm-14', studentId: 'std-9', teacherId: 'tch-4',
        termNumber: 1, startDate: '2024-12-02',
        classDays: ['Monday', 'Wednesday'], classTime: '09:00',
    },

    // std-10 Kaveh — 1 term
    {
        id: 'trm-15', studentId: 'std-10', teacherId: 'tch-2',
        termNumber: 1, startDate: '2025-01-06',
        classDays: ['Sunday', 'Thursday'], classTime: '16:30',
    },
];

/* ─────────────────────────────────────────────
   SESSIONS
   — reportedCount represents how many sessions
     have been reported for each term
───────────────────────────────────────────── */
export const sessions = [
    // trm-1 Parisa T1 — fully reported (12)
    ...makeSessions('trm-1', '2024-09-02', ['Monday','Wednesday'], 12),

    // trm-2 Parisa T2 — 5 reported, session 3 date manually edited
    ...makeSessions('trm-2', '2025-01-06', ['Monday','Wednesday'], 5,
        { 3: { date: '2025-01-22' } }),

    // trm-3 Dariush T1 — 7 reported
    ...makeSessions('trm-3', '2024-11-04', ['Tuesday','Thursday'], 7),

    // trm-4 Leila T1 — fully reported
    ...makeSessions('trm-4', '2023-09-04', ['Sunday','Tuesday'], 12),

    // trm-5 Leila T2 — fully reported
    ...makeSessions('trm-5', '2024-01-08', ['Sunday','Tuesday'], 12),

    // trm-6 Leila T3 — 8 reported
    ...makeSessions('trm-6', '2024-09-01', ['Monday','Thursday'], 8),

    // trm-7 Hamed T1 — 2 reported (just started)
    ...makeSessions('trm-7', '2025-01-13', ['Monday','Wednesday','Friday'], 2),

    // trm-8 Neda T1 — fully reported
    ...makeSessions('trm-8', '2024-03-04', ['Wednesday','Saturday'], 12),

    // trm-9 Neda T2 — 6 reported
    ...makeSessions('trm-9', '2024-09-07', ['Wednesday','Saturday'], 6),

    // trm-10 Omid T1 — 6 reported
    ...makeSessions('trm-10', '2024-10-07', ['Monday','Thursday'], 6),

    // trm-11 Fatemeh T1 — 4 reported
    ...makeSessions('trm-11', '2024-11-04', ['Tuesday','Saturday'], 4),

    // trm-12 Mehdi T1 — fully reported
    ...makeSessions('trm-12', '2024-03-11', ['Tuesday','Thursday'], 12),

    // trm-13 Mehdi T2 — 9 reported
    ...makeSessions('trm-13', '2024-09-09', ['Tuesday','Thursday'], 9),

    // trm-14 Shirin T1 — 3 reported
    ...makeSessions('trm-14', '2024-12-02', ['Monday','Wednesday'], 3),

    // trm-15 Kaveh T1 — 1 reported
    ...makeSessions('trm-15', '2025-01-06', ['Sunday','Thursday'], 1),
];
