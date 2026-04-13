import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTeacherWithStudents } from '../../services/api';
import ViewToggle from '../../components/common/ViewToggle';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import styles from './TeacherDashboard.module.scss';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');

    useEffect(() => {
        getTeacherWithStudents(user.id).then(d => { setData(d); setLoading(false); });
    }, [user.id]);

    if (loading) return <LoadingSpinner centered />;

    const { teacher, students } = data;

    return (
        <div className="page-content animate-fade-in">
            {/* Teacher Info */}
            <div className={styles.infoCard}>
                <div className={styles.avatar}>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div className={styles.infoText}>
                    <h1 className={styles.name}>{teacher.firstName} {teacher.lastName}</h1>
                    <p className={styles.sub}>@{teacher.username}</p>
                    <div className={styles.chips}>
            <span className={styles.chip}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
                {students.length} student{students.length !== 1 ? 's' : ''}
            </span>
                        <a href={teacher.classLink} target="_blank" rel="noopener noreferrer" className={styles.linkChip}>
                            📎 Class Link
                        </a>
                    </div>
                </div>
            </div>

            {/* Students Section */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>My Students</h2>
                <ViewToggle view={view} onToggle={setView} />
            </div>

            {students.length === 0 ? (
                <EmptyState icon="🎓" title="No students yet" description="You have no assigned students." />
            ) : view === 'grid' ? (
                <div className={styles.grid}>
                    {students.map(s => (
                        <StudentCard
                            key={s.id}
                            student={s}
                            onClick={() => navigate(`/teacher/students/${s.id}/terms/${s.currentTerm.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {students.map(s => (
                        <StudentListItem
                            key={s.id}
                            student={s}
                            onClick={() => navigate(`/teacher/students/${s.id}/terms/${s.currentTerm.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function StudentCard({ student, onClick }) {
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.sCard} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.sAvatar}>{initials}</div>
            <div className={styles.sName}>{student.firstName} {student.lastName}</div>
            <div className={styles.sMeta}>Term {student.currentTerm.termNumber}</div>
            <div className={styles.sDays}>{student.currentTerm.classDays.join(', ')}</div>
        </div>
    );
}

function StudentListItem({ student, onClick }) {
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.sListItem} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.sAvatarSm}>{initials}</div>
            <div className={styles.sListInfo}>
                <span className={styles.sName}>{student.firstName} {student.lastName}</span>
                <span className={styles.sMeta}>Term {student.currentTerm.termNumber} · {student.currentTerm.classDays.join(', ')}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}
