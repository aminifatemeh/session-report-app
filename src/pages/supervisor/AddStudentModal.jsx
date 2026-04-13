import { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { createStudent } from '../../services/api';

const empty = { firstName: '', lastName: '', username: '', password: '' };

export default function AddStudentModal({ isOpen, onClose, onAdded }) {
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'Required';
        if (!form.lastName.trim())  e.lastName  = 'Required';
        if (!form.username.trim())  e.username  = 'Required';
        if (!form.password.trim())  e.password  = 'Required';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        try {
            const student = await createStudent(form);
            setForm(empty);
            setErrors({});
            onAdded(student);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { setForm(empty); setErrors({}); onClose(); };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Student"
            footer={
                <>
                    <Button variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving…' : 'Add Student'}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="First Name" error={errors.firstName} required>
                        <input className="input" value={form.firstName} onChange={set('firstName')} placeholder="e.g. Parisa" />
                    </FormField>
                    <FormField label="Last Name" error={errors.lastName} required>
                        <input className="input" value={form.lastName} onChange={set('lastName')} placeholder="e.g. Tehrani" />
                    </FormField>
                </div>
                <FormField label="Username" error={errors.username} required>
                    <input className="input" value={form.username} onChange={set('username')} placeholder="e.g. parisa.tehrani" />
                </FormField>
                <FormField label="Password" error={errors.password} required>
                    <input className="input" type="password" value={form.password} onChange={set('password')} placeholder="Set a password" />
                </FormField>
            </div>
        </Modal>
    );
}
