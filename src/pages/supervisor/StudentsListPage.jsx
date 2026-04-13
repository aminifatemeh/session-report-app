import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, getTermsByStudent } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ViewToggle from '../../components/common/ViewToggle';
import AddStudentModal from '../../pages/supervisor/AddStudentModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import styles from './StudentsListPage.module.scss';

export default function StudentsListPage() {
    const [students, setStudents] = useState([]);
    const [termCounts, setTermCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [showAdd, setShowAdd] = useState(false);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
        const counts = {};
        for (const s of data) {
            const terms = await getTermsByStudent(s.id);
            counts[s.id] = terms.length;
        }
        setTermCounts(counts);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleAdded = (newStudent) => {
        setShowAdd(false);
        navigate(`/supervisor/students/${newStudent.id}`);
    };

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title="Students"
                subtitle={`${students.length} student${students.length !== 1 ? 's' : ''} registered`}
                backTo="/supervisor"
                actions={
                    <>
                        <ViewToggle view={view} onToggle={setView} />
                        <Button onClick={() => setShowAdd(true)} icon={
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        }>
                            Add Student
                        </Button>
                    </>
                }
            />

            {students.length === 0 ? (
                <EmptyState
                    icon="🎓"
                    title="No students yet"
                    description="Add your first student to get started."
                    action={<Button onClick={() => setShowAdd(true)}>Add Student</Button>}
                />
            ) : view === 'grid' ? (
                <div className={styles.grid}>
                    {students.map(s => (
                        <StudentCard
                            key={s.id}
                            student={s}
                            termCount={termCounts[s.id] ?? 0}
                            onClick={() => navigate(`/supervisor/students/${s.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {students.map(s => (
                        <StudentListItem
                            key={s.id}
                            student={s}
                            termCount={termCounts[s.id] ?? 0}
                            onClick={() => navigate(`/supervisor/students/${s.id}`)}
                        />
                    ))}
                </div>
            )}

            <AddStudentModal isOpen={showAdd} onClose={() => setShowAdd(false)} onAdded={handleAdded} />
        </div>
    );
}

function StudentCard({ student, termCount, onClick }) {
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.card} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.avatar}>{initials}</div>
            <h3 className={styles.name}>{student.firstName} {student.lastName}</h3>
            <p className={styles.username}>@{student.username}</p>
            <span className={styles.termBadge}>
        {termCount} term{termCount !== 1 ? 's' : ''}
      </span>
        </div>
    );
}

function StudentListItem({ student, termCount, onClick }) {
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
    return (
        <div className={styles.listItem} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && onClick()}>
            <div className={styles.avatarSm}>{initials}</div>
            <div className={styles.listInfo}>
                <span className={styles.listName}>{student.firstName} {student.lastName}</span>
                <span className={styles.listSub}>@{student.username}</span>
            </div>
            <span className={styles.termBadge}>{termCount} term{termCount !== 1 ? 's' : ''}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.arrow}>
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}
