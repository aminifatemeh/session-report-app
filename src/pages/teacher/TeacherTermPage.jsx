import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getTermById, getStudentById, getSessionsByTerm
} from '../../services/api';
import { toJalali } from '../../utils/dateUtils';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common//LoadingSpinner';
import styles from './TeacherTermPage.module.scss';

export default function TeacherTermPage() {
    const { studentId, termId } = useParams();
    const navigate = useNavigate();
    const [term, setTerm] = useState(null);
    const [student, setStudent] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [t, s, ses] = await Promise.all([
                getTermById(termId),
                getStudentById(studentId),
                getSessionsByTerm(termId),
            ]);
            setTerm(t); setStudent(s); setSessions(ses);
            setLoading(false);
        })();
    }, [termId, studentId]);

    if (loading) return <LoadingSpinner centered />;

    const reported = sessions.filter(s => s.status === 'reported').length;
    const nextPending = sessions.find(s => s.status === 'pending');

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title={`${student.firstName} ${student.lastName}`}
                subtitle={`Term ${term.termNumber}`}
                backTo="/teacher"
                backLabel="Dashboard"
            />

            <div className={styles.termCard}>
                <div className={styles.termCardHeader}>
                    <h2 className={styles.termTitle}>Term {term.termNumber}</h2>
                    <div className={styles.progressPill}>
                        {reported}/{sessions.length} reported
                    </div>
                </div>
                <div className={styles.termMeta}>
                    <MetaRow icon="📅" label="Class Days" value={term.classDays.join(', ')} />
                    <MetaRow icon="🕐" label="Class Time" value={term.classTime} />
                    <MetaRow icon="📌" label="Start Date" value={toJalali(term.startDate)} />
                    <MetaRow icon="🔗" label="Class Link" isLink value={term.classLink} />
                </div>

                {nextPending && (
                    <div className={styles.nextSession}>
                        <span>Next session to report:</span>
                        <strong>Session {nextPending.sessionNumber} — {toJalali(nextPending.date)}</strong>
                    </div>
                )}

                <div className={styles.cardActions}>
                    <Button
                        fullWidth
                        onClick={() => navigate(`/teacher/students/${studentId}/terms/${termId}/sessions`)}
                        icon={
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        }
                    >
                        View All Sessions
                    </Button>
                </div>
            </div>
        </div>
    );
}

function MetaRow({ icon, label, value, isLink }) {
    return (
        <div className={styles.metaRow}>
            <span className={styles.metaIcon}>{icon}</span>
            <span className={styles.metaLabel}>{label}</span>
            {isLink ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className={styles.metaLink}>
                    Open ↗
                </a>
            ) : (
                <span className={styles.metaValue}>{value}</span>
            )}
        </div>
    );
}
