import jalaali from 'jalaali-js';

/**
 * Convert a Gregorian ISO date string (YYYY-MM-DD) to a
 * human-readable Jalali string (e.g. "۱۴۰۳/۰۷/۰۱").
 */
export function toJalali(gregorianStr) {
    if (!gregorianStr) return '—';
    try {
        const [y, m, d] = gregorianStr.split('-').map(Number);
        const { jy, jm, jd } = jalaali.toJalaali(y, m, d);
        return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    } catch {
        return gregorianStr;
    }
}

/**
 * Convert Gregorian ISO string to Jalali input-ready string
 * (YYYY/MM/DD — same digits, used for pre-filling forms).
 */
export function toJalaliInput(gregorianStr) {
    return toJalali(gregorianStr);
}

/**
 * Convert a Jalali input string (YYYY/MM/DD) to a
 * Gregorian ISO date string (YYYY-MM-DD).
 */
export function toGregorian(jalaliStr) {
    if (!jalaliStr) return '';
    try {
        const [jy, jm, jd] = jalaliStr.split('/').map(Number);
        const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
        return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
    } catch {
        return '';
    }
}

/**
 * Validate a Jalali input string (YYYY/MM/DD).
 */
export function isValidJalaliInput(str) {
    if (!str) return false;
    const parts = str.split('/');
    if (parts.length !== 3) return false;
    const [jy, jm, jd] = parts.map(Number);
    if (!jy || !jm || !jd) return false;
    return jalaali.isValidJalaaliDate(jy, jm, jd);
}

/* ── Day-of-week helpers ── */

const DAY_MAP = {
    Monday:    1,
    Tuesday:   2,
    Wednesday: 3,
    Thursday:  4,
    Friday:    5,
    Saturday:  6,
    Sunday:    0,
};

/**
 * Given a Gregorian ISO start date and an array of day names,
 * generate `count` session dates (Gregorian ISO strings) in order.
 */
export function generateSessionDates(startDateStr, classDays, count = 12) {
    if (!startDateStr || !classDays?.length) return [];

    const dayNums = classDays
        .map(d => DAY_MAP[d])
        .filter(n => n !== undefined);

    const dates = [];
    const cursor = new Date(startDateStr + 'T00:00:00');

    while (dates.length < count) {
        const dow = cursor.getDay();
        if (dayNums.includes(dow)) {
            dates.push(cursor.toISOString().split('T')[0]);
        }
        cursor.setDate(cursor.getDate() + 1);
        // safety: stop after 365 iterations to avoid infinite loop
        if (dates.length === 0 && cursor - new Date(startDateStr) > 365 * 86400000) break;
    }

    return dates;
}
