import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeachers, getTermsByTeacher } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ViewToggle from '../../components/common/ViewToggle';
import AddTeacherModal from './AddTeacherModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common//EmptyState';
import styles from './TeachersListPage.module.scss';

export default function TeachersListPage() {
    const [teachers, setTeachers] = useState([]);
    const [studentCounts, setStudentCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [showAdd, setShowAdd] = useState(false);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        const data = await getTeachers();
        setTeachers(data);

        // Count unique students per teacher
        const counts = {};
        for (const t of data) {
            const terms = await getTermsByTeacher(t.id);
            const unique = new Set(terms.map(tr => tr.studentId));
            counts[t.id] = unique.size;
        }
        setStudentCounts(counts);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleAdded = () => { setShowAdd(false); load(); };

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title="Teachers"
                subtitle={`${teachers.length} teacher${teachers.length !== 1 ? 's' : ''} registered`}
                backTo="/supervisor"
                actions={
                    <>
                        <ViewToggle view={view} onToggle={setView} />
                        <Button onClick={() => setShowAdd(true)} icon={
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        }>
                            Add Teacher
                        </Button>
                    </>
                }
            />

            {teachers.length === 0 ? (
                <EmptyState
                    icon="👩‍🏫"
                    title="No teachers yet"
                    description="Add your first teacher to get started."
                    action={<Button onClick={() => setShowAdd(true)}>Add Teacher</Button>}
                />
            ) : view === 'grid' ? (
                <div className={styles.grid}>
                    {teachers.map(t => (
                        <TeacherCard
                            key={t.id}
                            teacher={t}
                            studentCount={studentCounts[t.id] ?? 0}
                            onClick={() => navigate(`/supervisor/teachers/${t.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {teachers.map(t => (
                        <TeacherListItem
                            key={t.id}
                            teacher={t}
                            studentCount={studentCounts[t.id] ?? 0}
                            onClick={() => navigate(`/supervisor/teachers/${t.id}`)}
                        />
                    ))}
                </div>
            )}

            <AddTeacherModal isOpen={showAdd} onClose={() => setShowAdd(false)} onAdded={handleAdded} />
        </div>
    );
}

function TeacherCard({ teacher, studentCount, onClick }) {
    const initials = `${teacher.firstName[0]}${teacher.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.card} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.avatar}>{initials}</div>
            <h3 className={styles.name}>{teacher.firstName} {teacher.lastName}</h3>
            <p className={styles.username}>@{teacher.username}</p>
            <div className={styles.meta}>
        <span className={styles.metaItem}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
            {studentCount} student{studentCount !== 1 ? 's' : ''}
        </span>
            </div>
        </div>
    );
}

function TeacherListItem({ teacher, studentCount, onClick }) {
    const initials = `${teacher.firstName[0]}${teacher.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.listItem} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={[styles.avatar, styles.avatarSm].join(' ')}>{initials}</div>
            <div className={styles.listInfo}>
                <span className={styles.listName}>{teacher.firstName} {teacher.lastName}</span>
                <span className={styles.listSub}>@{teacher.username}</span>
            </div>
            <span className={styles.listCount}>{studentCount} student{studentCount !== 1 ? 's' : ''}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.listArrow}>
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}
