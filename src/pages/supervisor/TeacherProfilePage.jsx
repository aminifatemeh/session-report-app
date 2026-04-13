import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeacherById, getTermsByTeacher, getStudentById } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import ViewToggle from '../../components/common/ViewToggle';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import styles from './TeacherProfilePage.module.scss';

export default function TeacherProfilePage() {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');

    useEffect(() => {
        (async () => {
            const t = await getTeacherById(teacherId);
            const terms = await getTermsByTeacher(teacherId);
            // unique students, pick latest term per student
            const map = {};
            for (const term of terms) {
                if (!map[term.studentId] || term.termNumber > map[term.studentId].termNumber) {
                    map[term.studentId] = term;
                }
            }
            const stdList = await Promise.all(
                Object.keys(map).map(async id => {
                    const s = await getStudentById(id);
                    return { ...s, currentTerm: map[id] };
                })
            );
            setTeacher(t);
            setStudents(stdList);
            setLoading(false);
        })();
    }, [teacherId]);

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title={`${teacher.firstName} ${teacher.lastName}`}
                subtitle="Teacher Profile"
                backTo="/supervisor/teachers"
                backLabel="All Teachers"
            />

            {/* Info Card */}
            <div className={styles.infoCard}>
                <div className={styles.avatarLg}>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div className={styles.infoDetails}>
                    <h2>{teacher.firstName} {teacher.lastName}</h2>
                    <p className={styles.username}>@{teacher.username}</p>
                    <div className={styles.infoMeta}>
            <span className={styles.metaChip}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
                {students.length} student{students.length !== 1 ? 's' : ''}
            </span>
                        <a href={teacher.classLink} target="_blank" rel="noopener noreferrer" className={styles.linkChip}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M5.5 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                <path d="M8 2h4v4M12 2L7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Class Link
                        </a>
                    </div>
                </div>
            </div>

            {/* Students Section */}
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Assigned Students</h3>
                <ViewToggle view={view} onToggle={setView} />
            </div>

            {students.length === 0 ? (
                <EmptyState icon="🎓" title="No students assigned" description="This teacher has no students yet." />
            ) : view === 'grid' ? (
                <div className={styles.grid}>
                    {students.map(s => (
                        <StudentMiniCard key={s.id} student={s}
                                         onClick={() => navigate(`/supervisor/students/${s.id}`)} />
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {students.map(s => (
                        <StudentMiniListItem key={s.id} student={s}
                                             onClick={() => navigate(`/supervisor/students/${s.id}`)} />
                    ))}
                </div>
            )}
        </div>
    );
}

function StudentMiniCard({ student, onClick }) {
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.sCard} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.sAvatar}>{initials}</div>
            <div className={styles.sName}>{student.firstName} {student.lastName}</div>
            <div className={styles.sMeta}>Term {student.currentTerm.termNumber}</div>
        </div>
    );
}

function StudentMiniListItem({ student, onClick }) {
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.sListItem} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.sAvatarSm}>{initials}</div>
            <div className={styles.sListInfo}>
                <span className={styles.sName}>{student.firstName} {student.lastName}</span>
                <span className={styles.sMeta}>Term {student.currentTerm.termNumber}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}
