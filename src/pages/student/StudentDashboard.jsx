import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStudentDashboard, getSessionsByTerm } from '../../services/api';
import { toJalali } from '../../utils/dateUtils';
import PageHeader from '../../components/common/PageHeader';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import styles from './StudentDashboard.module.scss';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [termProgress, setTermProgress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const d = await getStudentDashboard(user.id);
            setData(d);
            const progress = {};
            for (const term of d.terms) {
                const sessions = await getSessionsByTerm(term.id);
                progress[term.id] = {
                    reported: sessions.filter(s => s.status === 'reported').length,
                    total: sessions.length,
                };
            }
            setTermProgress(progress);
            setLoading(false);
        })();
    }, [user.id]);

    if (loading) return <LoadingSpinner centered />;

    const { student, terms, currentTerm } = data;

    return (
        <div className="page-content animate-fade-in">

            {/* Profile Card */}
            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    {student.firstName[0]}{student.lastName[0]}
                </div>
                <div className={styles.profileInfo}>
                    <h1 className={styles.name}>
                        {student.firstName} {student.lastName}
                    </h1>
                    <p className={styles.username}>@{student.username}</p>
                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <span className={styles.statNum}>{terms.length}</span>
                            <span className={styles.statLabel}>
                Term{terms.length !== 1 ? 's' : ''}
              </span>
                        </div>
                        {currentTerm && (
                            <div className={styles.stat}>
                <span className={styles.statNum}>
                  {termProgress[currentTerm.id]?.reported ?? 0}
                    <span className={styles.statDen}>
                    /{termProgress[currentTerm.id]?.total ?? 0}
                  </span>
                </span>
                                <span className={styles.statLabel}>Sessions Done</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Current Term Card */}
            {currentTerm ? (
                <div className={styles.currentCard}>
                    <div className={styles.currentHeader}>
                        <div>
                            <div className={styles.currentLabel}>Current Term</div>
                            <h2 className={styles.currentTitle}>Term {currentTerm.termNumber}</h2>
                        </div>
                        <Badge variant="primary">Active</Badge>
                    </div>
                    <div className={styles.currentMeta}>
                        <MetaChip
                            icon={
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path
                                        d="M7 1a6 6 0 100 12A6 6 0 007 1z"
                                        stroke="currentColor" strokeWidth="1.3"
                                    />
                                    <path
                                        d="M7 4v3l2 2"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            }
                            text={currentTerm.classTime}
                        />
                        <MetaChip
                            icon={
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <rect
                                        x="1" y="2" width="12" height="11" rx="2"
                                        stroke="currentColor" strokeWidth="1.3"
                                    />
                                    <path
                                        d="M1 6h12M5 1v2M9 1v2"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            }
                            text={currentTerm.classDays.join(', ')}
                        />
                        <MetaChip
                            icon={
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path
                                        d="M2 11.5V4a1 1 0 011-1h8a1 1 0 011 1v7.5"
                                        stroke="currentColor" strokeWidth="1.3"
                                    />
                                    <path
                                        d="M5 13h4"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            }
                            text={`Started ${toJalali(currentTerm.startDate)}`}
                        />

                    </div>

                    {/* Progress Bar */}
                    {termProgress[currentTerm.id] && (
                        <div className={styles.progressWrap}>
                            <div className={styles.progressRow}>
                                <span className={styles.progressLabel}>Session Progress</span>
                                <span className={styles.progressCount}>
                  {termProgress[currentTerm.id].reported} of{' '}
                                    {termProgress[currentTerm.id].total} reported
                </span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width: `${
                                            termProgress[currentTerm.id].total > 0
                                                ? (termProgress[currentTerm.id].reported /
                                                    termProgress[currentTerm.id].total) *
                                                100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        className={styles.viewBtn}
                        onClick={() =>
                            navigate(`/student/terms/${currentTerm.id}/sessions`)
                        }
                    >
                        View Sessions
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M6 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            ) : (
                <EmptyState
                    icon="📚"
                    title="No active term"
                    description="Your supervisor hasn't created a term for you yet."
                />
            )}

            {/* All Terms */}
            {terms.length > 0 && (
                <div className={styles.termsSection}>
                    <h3 className={styles.termsTitle}>All Terms</h3>
                    <div className={styles.termsList}>
                        {[...terms].reverse().map(term => (
                            <TermRow
                                key={term.id}
                                term={term}
                                progress={termProgress[term.id]}
                                isCurrent={currentTerm?.id === term.id}
                                onClick={() =>
                                    navigate(`/student/terms/${term.id}/sessions`)
                                }
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── helpers ── */

function MetaChip({ icon, text }) {
    return (
        <div className={styles.metaChip}>
            <span className={styles.metaIcon}>{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function TermRow({ term, progress, isCurrent, onClick }) {
    const pct =
        progress && progress.total > 0
            ? Math.round((progress.reported / progress.total) * 100)
            : 0;

    return (
        <div
            className={[
                styles.termRow,
                isCurrent ? styles.termRowCurrent : '',
            ].join(' ')}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
        >
            <div className={styles.termRowLeft}>
                <span className={styles.termRowNum}>Term {term.termNumber}</span>
                {isCurrent && <Badge variant="primary">Current</Badge>}
                <span className={styles.termRowDays}>
          {term.classDays.join(', ')}
        </span>
            </div>
            <div className={styles.termRowRight}>
                <span className={styles.termRowPct}>{pct}%</span>
                <div className={styles.termRowBar}>
                    <div
                        className={styles.termRowFill}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M6 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}
