import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    getSessionsByTerm,
    getTermById,
    getTeacherById,
} from '../../services/api';
import { toJalali } from '../../utils/dateUtils';
import PageHeader from '../../components/common/PageHeader';
import Badge from '../../components/common/Badge';
import ViewToggle from '../../components/common/ViewToggle';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './StudentSessionsPage.module.scss';

export default function StudentSessionsPage() {
    const { termId } = useParams();
    const [sessions, setSessions] = useState([]);
    const [term, setTerm] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [reportModal, setReportModal] = useState(null);

    useEffect(() => {
        (async () => {
            const [t, ses] = await Promise.all([
                getTermById(termId),
                getSessionsByTerm(termId),
            ]);
            const tch = await getTeacherById(t.teacherId);
            setTerm(t);
            setSessions(ses);
            setTeacher(tch);
            setLoading(false);
        })();
    }, [termId]);

    if (loading) return <LoadingSpinner centered />;

    const reported = sessions.filter(s => s.status === 'reported').length;
    const pct =
        sessions.length > 0
            ? Math.round((reported / sessions.length) * 100)
            : 0;

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title={`Term ${term.termNumber} — Sessions`}
                subtitle={`${term.classDays.join(', ')} · ${term.classTime}`}
                backTo="/student"
                backLabel="Dashboard"
            />

            {/* Info Bar */}
            <div className={styles.infoBar}>
                <InfoItem
                    label="Teacher"
                    value={`${teacher.firstName} ${teacher.lastName}`}
                />
                <InfoItem label="Start Date" value={toJalali(term.startDate)} />
                <InfoItem
                    label="Progress"
                    value={`${reported} / ${sessions.length} sessions`}
                />
                <InfoItem label="Completion" value={`${pct}%`} />
            </div>

            {/* Progress Bar */}
            <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Overall Progress</span>
                    <span className={styles.progressPct}>{pct}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
        <span className={styles.toolbarCount}>
          {sessions.length} sessions total
        </span>
                <ViewToggle view={view} onToggle={setView} />
            </div>

            {/* Sessions */}
            {view === 'grid' ? (
                <div className={styles.grid}>
                    {sessions.map(session => (
                        <StudentSessionCard
                            key={session.id}
                            session={session}
                            onViewReport={
                                session.status === 'reported'
                                    ? () => setReportModal(session)
                                    : null
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {sessions.map(session => (
                        <StudentSessionListItem
                            key={session.id}
                            session={session}
                            onViewReport={
                                session.status === 'reported'
                                    ? () => setReportModal(session)
                                    : null
                            }
                        />
                    ))}
                </div>
            )}

            {/* Report Modal (read-only) */}
            {reportModal && (
                <StudentReportModal
                    session={reportModal}
                    onClose={() => setReportModal(null)}
                />
            )}
        </div>
    );
}

/* ── Sub-components ── */

function InfoItem({ label, value }) {
    return (
        <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{label}</span>
            <span className={styles.infoValue}>{value}</span>
        </div>
    );
}

function StudentSessionCard({ session, onViewReport }) {
    const isReported = session.status === 'reported';

    return (
        <div
            className={[
                styles.sCard,
                isReported ? styles.sCardReported : styles.sCardPending,
            ].join(' ')}
            onClick={onViewReport ?? undefined}
            role={onViewReport ? 'button' : undefined}
            tabIndex={onViewReport ? 0 : undefined}
            onKeyDown={
                onViewReport
                    ? e => e.key === 'Enter' && onViewReport()
                    : undefined
            }
        >
            <div className={styles.sCardTop}>
                <span className={styles.sCardNum}>#{session.sessionNumber}</span>
                <Badge variant={isReported ? 'success' : 'warning'}>
                    {isReported ? 'Reported' : 'Pending'}
                </Badge>
            </div>
            <div className={styles.sCardDate}>{toJalali(session.date)}</div>

            {isReported ? (
                <div className={styles.sCardAction}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                            d="M2 7s2.5-4 5-4 5 4 5 4-2.5 4-5 4-5-4-5-4z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        />
                        <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    View Report
                </div>
            ) : (
                <div className={styles.sCardPendingMsg}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                        <path
                            d="M7 4v4M7 10v.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                        />
                    </svg>
                    Not yet reported
                </div>
            )}
        </div>
    );
}

function StudentSessionListItem({ session, onViewReport }) {
    const isReported = session.status === 'reported';

    return (
        <div
            className={[
                styles.sListItem,
                isReported ? styles.sListReported : '',
            ].join(' ')}
            onClick={onViewReport ?? undefined}
            role={onViewReport ? 'button' : undefined}
            tabIndex={onViewReport ? 0 : undefined}
            onKeyDown={
                onViewReport
                    ? e => e.key === 'Enter' && onViewReport()
                    : undefined
            }
        >
      <span className={styles.sListNum}>
        Session {session.sessionNumber}
      </span>
            <span className={styles.sListDate}>{toJalali(session.date)}</span>
            <Badge variant={isReported ? 'success' : 'warning'}>
                {isReported ? 'Reported' : 'Pending'}
            </Badge>
            {isReported && (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={styles.sListArrow}
                >
                    <path
                        d="M6 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </div>
    );
}

function StudentReportModal({ session, onClose }) {
    const r = session.report;

    return (
        <Modal
            isOpen
            onClose={onClose}
            title={`Session ${session.sessionNumber} — Report`}
            size="lg"
        >
            <div className={styles.reportBody}>
                <ReportSection label="Session Date" value={toJalali(r.date)} />
                <ReportSection label="Lesson Covered" value={r.lessonCovered} />
                {r.postClassActivity && (
                    <ReportSection
                        label="Post-Class Activity"
                        value={r.postClassActivity}
                    />
                )}
                <ReportSection
                    label="Summary of Activities"
                    value={r.summaryOfActivities}
                />
                {r.extraPoints && (
                    <ReportSection label="Extra Points" value={r.extraPoints} />
                )}
                <ReportSection
                    label="Homework Assigned"
                    value={r.homeworkAssigned}
                />

                {r.positivePoints?.length > 0 && (
                    <div className={styles.reportField}>
                        <div className={styles.reportFieldLabel}>Positive Points</div>
                        <ul className={styles.reportList}>
                            {r.positivePoints
                                .filter(p => p.trim())
                                .map((p, i) => (
                                    <li key={i}>{p}</li>
                                ))}
                        </ul>
                    </div>
                )}

                {r.areasForImprovement && (
                    <ReportSection
                        label="Areas for Improvement"
                        value={r.areasForImprovement}
                    />
                )}
            </div>
        </Modal>
    );
}

function ReportSection({ label, value }) {
    return (
        <div className={styles.reportField}>
            <div className={styles.reportFieldLabel}>{label}</div>
            <div className={styles.reportFieldValue}>{value || '—'}</div>
        </div>
    );
}
