import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, saveReport, submitReport } from '../../services/api';
import { toJalali, toJalaliInput, toGregorian, isValidJalaliInput } from '../../utils/dateUtils';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './ReportWritingPage.module.scss';

const emptyReport = {
    date: '',
    lessonCovered: '',
    postClassActivity: '',
    summaryOfActivities: '',
    extraPoints: '',
    homeworkAssigned: '',
    positivePoints: ['', ''],
    areasForImprovement: '',
};

export default function ReportWritingPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [form, setForm] = useState(emptyReport);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            const ses = await getSessionById(sessionId);
            setSession(ses);
            if (ses.report) {
                setForm({
                    ...ses.report,
                    date: toJalaliInput(ses.report.date),
                    positivePoints: ses.report.positivePoints || ['', ''],
                });
            } else {
                setForm({ ...emptyReport, date: toJalaliInput(ses.date) });
            }
            setLoading(false);
        })();
    }, [sessionId]);

    const set = (field) => (e) =>
        setForm(f => ({ ...f, [field]: e.target.value }));

    const setPositive = (i) => (e) =>
        setForm(f => {
            const pp = [...f.positivePoints];
            pp[i] = e.target.value;
            return { ...f, positivePoints: pp };
        });

    const validate = () => {
        const e = {};
        if (!form.date) { e.date = 'Required'; }
        else if (!isValidJalaliInput(form.date)) { e.date = 'Invalid date (use YYYY/MM/DD)'; }
        if (!form.lessonCovered.trim())        e.lessonCovered       = 'Required';
        if (!form.summaryOfActivities.trim())  e.summaryOfActivities = 'Required';
        if (!form.homeworkAssigned.trim())     e.homeworkAssigned    = 'Required';
        return e;
    };

    const buildPayload = () => ({
        ...form,
        date: toGregorian(form.date),
    });

    const handleSave = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSaving(true);
        try {
            const updated = await saveReport(sessionId, buildPayload(), false);
            setSession(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSaving(true);
        try {
            await submitReport(sessionId, buildPayload());
            navigate(-1);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="page-content animate-fade-in">
            <PageHeader
                title={`Session ${session.sessionNumber} — Report`}
                subtitle={`Date: ${toJalali(session.date)}`}
                backTo={-1}
                backLabel="Back to Sessions"
            />

            <div className={styles.formCard}>
                {/* Date */}
                <FormField
                    label="Session Date (Jalali)"
                    error={errors.date}
                    helper="Format: YYYY/MM/DD — editing this updates the date across all panels"
                    required
                >
                    <input
                        className={`input${errors.date ? ' error' : ''}`}
                        value={form.date}
                        onChange={set('date')}
                        placeholder="e.g. 1403/07/01"
                    />
                </FormField>

                <div className={styles.divider} />

                {/* Lesson Covered */}
                <FormField label="Lesson Covered" error={errors.lessonCovered} required>
                    <input className={`input${errors.lessonCovered ? ' error' : ''}`}
                           value={form.lessonCovered} onChange={set('lessonCovered')}
                           placeholder="e.g. Unit 5 — Past tense structures" />
                </FormField>

                {/* Post Class Activity */}
                <FormField label="Post-Class Activity Covered">
                    <input className="input"
                           value={form.postClassActivity} onChange={set('postClassActivity')}
                           placeholder="e.g. Review worksheet for Unit 5" />
                </FormField>

                {/* Summary */}
                <FormField
                    label="Summary of Activities"
                    error={errors.summaryOfActivities}
                    helper="Briefly describe what was taught and practiced during the session."
                    required
                >
          <textarea
              className={`input${errors.summaryOfActivities ? ' error' : ''}`}
              value={form.summaryOfActivities}
              onChange={set('summaryOfActivities')}
              placeholder="Describe the main activities…"
              rows={4}
          />
                </FormField>

                {/* Extra Points */}
                <FormField
                    label="Extra Points Covered"
                    helper="Any additional topics, corrections, or skills worked on."
                >
          <textarea
              className="input"
              value={form.extraPoints}
              onChange={set('extraPoints')}
              placeholder="Any extra points…"
              rows={3}
          />
                </FormField>

                {/* Homework */}
                <FormField
                    label="Homework Assigned"
                    error={errors.homeworkAssigned}
                    helper="Include specific instructions."
                    required
                >
          <textarea
              className={`input${errors.homeworkAssigned ? ' error' : ''}`}
              value={form.homeworkAssigned}
              onChange={set('homeworkAssigned')}
              placeholder="Describe the homework…"
              rows={3}
          />
                </FormField>

                {/* Positive Points */}
                <div className={styles.section}>
                    <div className={styles.sectionLabel}>Positive Points</div>
                    <div className={styles.positiveGrid}>
                        <FormField label="Point 1">
                            <input className="input" value={form.positivePoints[0]}
                                   onChange={setPositive(0)} placeholder="e.g. Great participation" />
                        </FormField>
                        <FormField label="Point 2">
                            <input className="input" value={form.positivePoints[1]}
                                   onChange={setPositive(1)} placeholder="e.g. Improved pronunciation" />
                        </FormField>
                    </div>
                </div>

                {/* Areas for Improvement */}
                <FormField
                    label="Areas for Improvement"
                    helper="Note any difficulties, mistakes, or things to focus on next time."
                >
          <textarea
              className="input"
              value={form.areasForImprovement}
              onChange={set('areasForImprovement')}
              placeholder="Describe areas to work on…"
              rows={3}
          />
                </FormField>

                <div className={styles.actions}>
                    {saved && (
                        <span className={styles.savedMsg}>
              ✓ Draft saved
            </span>
                    )}
                    <Button
                        variant="ghost"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving…' : 'Save Draft'}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        icon={
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        }
                    >
                        {saving ? 'Submitting…' : 'Submit Report'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
