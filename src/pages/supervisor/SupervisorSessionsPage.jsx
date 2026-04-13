import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getSessionsByTerm, getTermById, getStudentById, getTeacherById
} from '../../services/api';
import { toJalali } from '../../utils/dateUtils';
import PageHeader from '../../components/common/PageHeader';
import Badge from '../../components/common/Badge';
import ViewToggle from '../../components/common/ViewToggle';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './SupervisorSessionsPage.module.scss';

export default function SupervisorSessionsPage() {
    const { studentId, termId } = useParams();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [term, setTerm] = useState(null);
    const [student, setStudent] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [reportModal, setReportModal] = useState(null); // session with report

    useEffect(() => {
        (async () => {
            const [t, s, ses] = await Promise.all([
                getTermById(termId),
                getStudentById(studentId),
                getSessionsByTerm(termId),
            ]);
            const tch = await getTeacherById(t.teacherId);
            setTerm(t); setStudent(s); setSessions(ses); setTeacher(tch);
            setLoading(false);
        })();
    }, [termId, studentId]);

    if (loading) return <LoadingSpinner centered />;

    const reported = sessions.filter(s => s.status === 'reported').length;

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title={`Term ${term.termNumber} — Sessions`}
                subtitle={`${student.firstName} ${student.lastName}`}
                backTo={`/supervisor/students/${studentId}`}
                backLabel="Student Profile"
            />

            {/* Term Info Bar */}
            <div className={styles.termBar}>
                <div className={styles.termBarItem}>
                    <span className={styles.tbLabel}>Teacher</span>
                    <span className={styles.tbValue}>{teacher.firstName} {teacher.lastName}</span>
                </div>
                <div className={styles.termBarItem}>
                    <span className={styles.tbLabel}>Days</span>
                    <span className={styles.tbValue}>{term.classDays.join(', ')}</span>
                </div>
                <div className={styles.termBarItem}>
                    <span className={styles.tbLabel}>Time</span>
                    <span className={styles.tbValue}>{term.classTime}</span>
                </div>
                <div className={styles.termBarItem}>
                    <span className={styles.tbLabel}>Progress</span>
                    <span className={styles.tbValue}>{reported}/{sessions.length} reported</span>
                </div>
            </div>

            <div className={styles.toolbar}>
                <ViewToggle view={view} onToggle={setView} />
            </div>

            {view === 'grid' ? (
                <div className={styles.grid}>
                    {sessions.map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onViewReport={() => setReportModal(session)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {sessions.map(session => (
                        <SessionListItem
                            key={session.id}
                            session={session}
                            onViewReport={() => setReportModal(session)}
                        />
                    ))}
                </div>
            )}

            {/* Report Read-Only Modal */}
            {reportModal && (
                <ReportViewModal
                    session={reportModal}
                    onClose={() => setReportModal(null)}
                />
            )}
        </div>
    );
}

function SessionCard({ session, onViewReport }) {
    const isPending  = session.status === 'pending';
    const isReported = session.status === 'reported';

    return (
        <div
            className={[styles.sCard, isReported ? styles.sCardReported : styles.sCardPending].join(' ')}
            onClick={isReported ? onViewReport : undefined}
            role={isReported ? 'button' : undefined}
            tabIndex={isReported ? 0 : undefined}
            onKeyDown={isReported ? (e => e.key === 'Enter' && onViewReport()) : undefined}
        >
            <div className={styles.sCardNum}>#{session.sessionNumber}</div>
            <div className={styles.sCardDate}>{toJalali(session.date)}</div>
            <div className={styles.sCardStatus}>
                {isReported ? (
                    <Badge variant="success">Reported</Badge>
                ) : (
                    <Badge variant="warning">Pending</Badge>
                )}
            </div>
            {isReported && (
                <div className={styles.sCardAction}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8s2.636-4.5 6-4.5S14 8 14 8s-2.636 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    View Report
                </div>
            )}
        </div>
    );
}

function SessionListItem({ session, onViewReport }) {
    const isReported = session.status === 'reported';
    return (
        <div
            className={[styles.sListItem, isReported ? styles.sListReported : ''].join(' ')}
            onClick={isReported ? onViewReport : undefined}
            role={isReported ? 'button' : undefined}
            tabIndex={isReported ? 0 : undefined}
            onKeyDown={isReported ? (e => e.key === 'Enter' && onViewReport()) : undefined}
        >
            <span className={styles.sListNum}>Session {session.sessionNumber}</span>
            <span className={styles.sListDate}>{toJalali(session.date)}</span>
            <Badge variant={isReported ? 'success' : 'warning'}>
                {isReported ? 'Reported' : 'Pending'}
            </Badge>
            {isReported && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.sListArrow}>
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
    );
}

function ReportViewModal({ session, onClose }) {
    const r = session.report;
    return (
        <Modal isOpen={true} onClose={onClose} title={`Session ${session.sessionNumber} — Report`} size="lg">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <ReportField label="Date" value={toJalali(r.date)} />
                <ReportField label="Lesson Covered" value={r.lessonCovered} />
                <ReportField label="Post-Class Activity" value={r.postClassActivity} />
                <ReportField label="Summary of Activities" value={r.summaryOfActivities} />
                {r.extraPoints && <ReportField label="Extra Points" value={r.extraPoints} />}
                <ReportField label="Homework Assigned" value={r.homeworkAssigned} />
                <div>
                    <div style={{ fontSize: '0.75rem', color: '#9aa5b4', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                        Positive Points
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {r.positivePoints.map((p, i) => (
                            <li key={i} style={{ fontSize: '0.875rem', color: '#4a5568' }}>{p}</li>
                        ))}
                    </ul>
                </div>
                <ReportField label="Areas for Improvement" value={r.areasForImprovement} />
            </div>
        </Modal>
    );
}

function ReportField({ label, value }) {
    return (
        <div>
            <div style={{ fontSize: '0.75rem', color: '#9aa5b4', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem', letterSpacing: '0.06em' }}>
                {label}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: 1.6 }}>{value || '—'}</div>
        </div>
    );
}
