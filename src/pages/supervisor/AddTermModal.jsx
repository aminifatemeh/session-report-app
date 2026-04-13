import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { getTeachers, createTerm } from '../../services/api';
import { toGregorian, isValidJalaliInput, toJalaliInput } from '../../utils/dateUtils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const emptyForm = {
    teacherId: '',
    startDate: '',   // stored as Jalali input string
    classDays: [],
    classTime: '',
};

export default function AddTermModal({ isOpen, onClose, studentId, onAdded }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) getTeachers().then(setTeachers);
    }, [isOpen]);

    const toggleDay = (day) => {
        setForm(f => ({
            ...f,
            classDays: f.classDays.includes(day)
                ? f.classDays.filter(d => d !== day)
                : [...f.classDays, day],
        }));
    };

    const validate = () => {
        const e = {};
        if (!form.teacherId)              e.teacherId  = 'Please select a teacher';
        if (!form.startDate)              e.startDate  = 'Required';
        else if (!isValidJalaliInput(form.startDate)) e.startDate = 'Invalid date (use YYYY/MM/DD)';
        if (form.classDays.length === 0)  e.classDays  = 'Select at least one day';
        if (!form.classTime)              e.classTime  = 'Required';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        try {
            await createTerm({
                studentId,
                teacherId: form.teacherId,
                startDate: toGregorian(form.startDate),
                classDays: form.classDays,
                classTime: form.classTime,
            });
            setForm(emptyForm);
            setErrors({});
            onAdded();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { setForm(emptyForm); setErrors({}); onClose(); };

    const selectedTeacher = teachers.find(t => t.id === form.teacherId);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Term"
            footer={
                <>
                    <Button variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving…' : 'Create Term'}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FormField label="Teacher" error={errors.teacherId} required>
                    <select
                        className="input"
                        value={form.teacherId}
                        onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}
                    >
                        <option value="">Select a teacher…</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.firstName} {t.lastName}
                            </option>
                        ))}
                    </select>
                </FormField>

                {selectedTeacher && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: 'var(--color-primary-lighter, #d6e8f5)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#5a7d9a',
                    }}>
                        📎 Class link: <a href={selectedTeacher.classLink} target="_blank" rel="noopener noreferrer"
                                         style={{ color: '#5a7d9a', textDecoration: 'underline' }}>
                        {selectedTeacher.classLink}
                    </a>
                    </div>
                )}

                <FormField
                    label="Start Date (Jalali)"
                    error={errors.startDate}
                    helper="Format: YYYY/MM/DD — e.g. 1403/07/01"
                    required
                >
                    <input
                        className="input"
                        placeholder="1403/07/01"
                        value={form.startDate}
                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    />
                </FormField>

                <FormField label="Class Days" error={errors.classDays} required>
                    <DayPicker selected={form.classDays} onToggle={toggleDay} />
                </FormField>

                <FormField label="Class Time" error={errors.classTime} required>
                    <input
                        className="input"
                        type="time"
                        value={form.classTime}
                        onChange={e => setForm(f => ({ ...f, classTime: e.target.value }))}
                    />
                </FormField>
            </div>
        </Modal>
    );
}

function DayPicker({ selected, onToggle }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {DAYS.map(day => (
                <button
                    key={day}
                    type="button"
                    onClick={() => onToggle(day)}
                    style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        border: selected.includes(day) ? '2px solid #7c9cbf' : '1.5px solid #e2e6ea',
                        background: selected.includes(day) ? '#d6e8f5' : '#fff',
                        color: selected.includes(day) ? '#5a7d9a' : '#6b7683',
                        fontSize: '0.8125rem',
                        fontWeight: selected.includes(day) ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                >
                    {day.slice(0, 3)}
                </button>
            ))}
        </div>
    );
}
