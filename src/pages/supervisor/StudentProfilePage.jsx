import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getStudentById, getTermsByStudent, getTeacherById,
    getSessionsByTerm
} from '../../services/api';
import { toJalali } from '../../utils/dateUtils';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AddTermModal from '../../pages/supervisor/AddTermModal';
import styles from './StudentProfilePage.module.scss';

export default function StudentProfilePage() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddTerm, setShowAddTerm] = useState(false);

    const load = async () => {
        setLoading(true);
        const s = await getStudentById(studentId);
        const rawTerms = await getTermsByStudent(studentId);
        rawTerms.sort((a, b) => a.termNumber - b.termNumber);

        const enriched = await Promise.all(rawTerms.map(async term => {
            const teacher = await getTeacherById(term.teacherId);
            const sessions = await getSessionsByTerm(term.id);
            const reported = sessions.filter(s => s.status === 'reported').length;
            return { ...term, teacher, reportedCount: reported, totalSessions: sessions.length };
        }));

        setStudent(s);
        setTerms(enriched);
        setLoading(false);
    };

    useEffect(() => { load(); }, [studentId]);

    if (loading) return <LoadingSpinner centered />;

    const currentTerm = terms[terms.length - 1];

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title={`${student.firstName} ${student.lastName}`}
                subtitle="Student Profile"
                backTo="/supervisor/students"
                backLabel="All Students"
                actions={
                    <Button onClick={() => setShowAddTerm(true)} icon={
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    }>
                        Add Term
                    </Button>
                }
            />

            {/* Current Info Card */}
            {currentTerm && (
                <div className={styles.infoCard}>
                    <div className={styles.infoGrid}>
                        <InfoItem label="Student" value={`${student.firstName} ${student.lastName}`} />
                        <InfoItem label="Current Term" value={`Term ${currentTerm.termNumber}`} />
                        <InfoItem label="Teacher" value={`${currentTerm.teacher.firstName} ${currentTerm.teacher.lastName}`} />
                        <InfoItem label="Class Days" value={currentTerm.classDays.join(', ')} />
                        <InfoItem label="Class Time" value={currentTerm.classTime} />
                        <InfoItem label="Class Link" isLink value={currentTerm.teacher.classLink} />
                    </div>
                </div>
            )}

            {/* Terms */}
            <div className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                    <h3 className={styles.sectionTitle}>All Terms</h3>
                    <Button size="sm" variant="secondary" onClick={() => setShowAddTerm(true)}>
                        + Add Term
                    </Button>
                </div>

                {terms.length === 0 ? (
                    <div className={styles.noTerms}>
                        <p>No terms yet.</p>
                        <Button onClick={() => setShowAddTerm(true)}>Add First Term</Button>
                    </div>
                ) : (
                    <div className={styles.termsList}>
                        {[...terms].reverse().map(term => (
                            <TermCard
                                key={term.id}
                                term={term}
                                isCurrent={term.id === currentTerm?.id}
                                onClick={() => navigate(`/supervisor/students/${studentId}/terms/${term.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AddTermModal
                isOpen={showAddTerm}
                onClose={() => setShowAddTerm(false)}
                studentId={studentId}
                onAdded={() => { setShowAddTerm(false); load(); }}
            />
        </div>
    );
}

function InfoItem({ label, value, isLink }) {
    return (
        <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{label}</span>
            {isLink ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                    Open Link ↗
                </a>
            ) : (
                <span className={styles.infoValue}>{value}</span>
            )}
        </div>
    );
}

function TermCard({ term, isCurrent, onClick }) {
    const progress = term.totalSessions > 0
        ? Math.round((term.reportedCount / term.totalSessions) * 100)
        : 0;

    return (
        <div className={[styles.termCard, isCurrent ? styles.termCardCurrent : ''].join(' ')}
             onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.termCardTop}>
                <div className={styles.termCardLeft}>
                    <span className={styles.termNum}>Term {term.termNumber}</span>
                    {isCurrent && <Badge variant="primary">Current</Badge>}
                </div>
                <span className={styles.termProgress}>
          {term.reportedCount}/{term.totalSessions} sessions
        </span>
            </div>
            <div className={styles.termCardMeta}>
                <span>{term.teacher.firstName} {term.teacher.lastName}</span>
                <span>•</span>
                <span>{term.classDays.join(', ')}</span>
                <span>•</span>
                <span>{term.classTime}</span>
            </div>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.termDates}>
                <span>Start: {toJalali(term.startDate)}</span>
            </div>
        </div>
    );
}
