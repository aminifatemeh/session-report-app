import { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { createTeacher } from '../../services/api';

const empty = { firstName: '', lastName: '', username: '', password: '', classLink: '' };

export default function AddTeacherModal({ isOpen, onClose, onAdded }) {
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.firstName.trim())  e.firstName  = 'Required';
        if (!form.lastName.trim())   e.lastName   = 'Required';
        if (!form.username.trim())   e.username   = 'Required';
        if (!form.password.trim())   e.password   = 'Required';
        if (!form.classLink.trim())  e.classLink  = 'Required';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        try {
            await createTeacher(form);
            setForm(empty);
            setErrors({});
            onAdded();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm(empty);
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Teacher"
            footer={
                <>
                    <Button variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving…' : 'Add Teacher'}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="First Name" error={errors.firstName} required>
                        <input className="input" value={form.firstName} onChange={set('firstName')} placeholder="e.g. Sara" />
                    </FormField>
                    <FormField label="Last Name" error={errors.lastName} required>
                        <input className="input" value={form.lastName} onChange={set('lastName')} placeholder="e.g. Ahmadi" />
                    </FormField>
                </div>
                <FormField label="Username" error={errors.username} required>
                    <input className="input" value={form.username} onChange={set('username')} placeholder="e.g. sara.ahmadi" />
                </FormField>
                <FormField label="Password" error={errors.password} required>
                    <input className="input" type="password" value={form.password} onChange={set('password')} placeholder="Set a password" />
                </FormField>
                <FormField label="Class Link" error={errors.classLink} required>
                    <input className="input" value={form.classLink} onChange={set('classLink')} placeholder="https://meet.google.com/..." />
                </FormField>
            </div>
        </Modal>
    );
}
