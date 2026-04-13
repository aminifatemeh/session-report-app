import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getSessionsByTerm, getTermById, getStudentById
} from '../../services/api';
import { toJalali } from '../../utils/dateUtils';
import PageHeader from '../../components/common/PageHeader';
import Badge from '../../components/common/Badge';
import ViewToggle from '../../components/common/ViewToggle';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './TeacherSessionsPage.module.scss';

export default function TeacherSessionsPage() {
    const { studentId, termId } = useParams();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [term, setTerm] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');

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

    const handleSessionClick = (session) => {
        navigate(`/teacher/sessions/${session.id}/report`);
    };

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title={`${student.firstName} ${student.lastName} — Sessions`}
                subtitle={`Term ${term.termNumber} · ${term.classDays.join(', ')} · ${term.classTime}`}
                backTo={`/teacher/students/${studentId}/terms/${termId}`}
                backLabel="Term Overview"
            />

            <div className={styles.progress}>
                <div className={styles.progressText}>
                    <span>{reported} of {sessions.length} sessions reported</span>
                    <span>{Math.round((reported / sessions.length) * 100)}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${(reported / sessions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className={styles.toolbar}>
                <ViewToggle view={view} onToggle={setView} />
            </div>

            {view === 'grid' ? (
                <div className={styles.grid}>
                    {sessions.map(session => (
                        <TeacherSessionCard
                            key={session.id}
                            session={session}
                            onClick={() => handleSessionClick(session)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {sessions.map(session => (
                        <TeacherSessionListItem
                            key={session.id}
                            session={session}
                            onClick={() => handleSessionClick(session)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TeacherSessionCard({ session, onClick }) {
    const isReported = session.status === 'reported';
    return (
        <div
            className={[styles.sCard, isReported ? styles.reported : styles.pending].join(' ')}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
        >
            <div className={styles.sNum}>#{session.sessionNumber}</div>
            <div className={styles.sDate}>{toJalali(session.date)}</div>
            <Badge variant={isReported ? 'success' : 'warning'}>
                {isReported ? 'Reported' : 'Pending'}
            </Badge>
            <div className={styles.sAction}>
                {isReported ? (
                    <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7s2.5-4 5-4 5 4 5 4-2.5 4-5 4-5-4-5-4z" stroke="currentColor" strokeWidth="1.3"/>
                            <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                        Edit Report
                    </>
                ) : (
                    <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 10.5V12h1.5l5.5-5.5-1.5-1.5L2 10.5zM11.5 3.5a1 1 0 000-1.5l-1-1a1 1 0 00-1.5 0L8 2.5l2.5 2.5 1-1.5z" fill="currentColor"/>
                        </svg>
                        Write Report
                    </>
                )}
            </div>
        </div>
    );
}

function TeacherSessionListItem({ session, onClick }) {
    const isReported = session.status === 'reported';
    return (
        <div
            className={styles.sListItem}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
        >
            <span className={styles.sListNum}>Session {session.sessionNumber}</span>
            <span className={styles.sListDate}>{toJalali(session.date)}</span>
            <Badge variant={isReported ? 'success' : 'warning'}>
                {isReported ? 'Reported' : 'Pending'}
            </Badge>
            <span className={styles.sListAction}>
        {isReported ? 'Edit' : 'Write'}
      </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}
