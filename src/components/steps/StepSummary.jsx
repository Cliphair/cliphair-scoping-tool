import { memo, useRef, useCallback, useMemo, useState } from 'react';
import { stepsData } from '../../data/stepsData';
import { typeSpecificQuestions } from '../../data/typeSpecificQuestions';
import { anythingElseStep } from '../../data/anythingElseStep';
import logoRangedDark from '../../assets/new branding/ranged---dark-gray.png';

const WEBHOOK_URL = 'https://n8n.srv1418821.hstgr.cloud/webhook/3764b167-82f6-4f37-b047-5e36e945532f';

// Pure utility — no closure over component state
function formatValue(val) {
    if (Array.isArray(val)) return val.filter(Boolean).join(", ") || "—";
    return val || "—";
}

const StepSummary = memo(function StepSummary({ answers, projectType, onBack, onReset }) {
    const briefRef = useRef(null);
    const typeConfig = typeSpecificQuestions[projectType];

    const [modalOpen, setModalOpen] = useState(false);
    const [publishStatus, setPublishStatus] = useState(null); // null | 'loading' | 'success' | 'error'
    const [publishError, setPublishError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', projectName: '' });
    const [formErrors, setFormErrors] = useState({});

    const allSections = useMemo(() => [
        ...stepsData.map((s) => ({ title: s.title, questions: s.questions })),
        { title: `${typeConfig.icon} ${typeConfig.label} — Specific Details`, questions: typeConfig.questions, isTypeSpecific: true },
        { title: anythingElseStep.title, questions: anythingElseStep.questions }
    ], [typeConfig]);

    const generateMarkdown = useCallback(() => {
        const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

        let md = `# Project Brief\n\n`;
        md += `**Generated:** ${now}\n`;
        md += `**Project Type:** ${typeConfig.icon} ${typeConfig.label}\n\n---\n\n`;

        stepsData.forEach((step) => {
            md += `## ${step.title}\n\n`;
            step.questions.forEach((q) => {
                if (q.showIf && !q.showIf(answers)) return;
                md += `**${q.label}**\n${formatValue(answers[q.id])}\n\n`;
            });
        });

        md += `---\n\n## ${typeConfig.icon} ${typeConfig.label} — Specific Details\n\n`;
        typeConfig.questions.forEach((q) => {
            if (q.showIf && !q.showIf(answers)) return;
            md += `**${q.label}**\n${formatValue(answers[q.id])}\n\n`;
        });

        md += `---\n\n## Anything Else\n\n`;
        anythingElseStep.questions.forEach((q) => {
            if (q.showIf && !q.showIf(answers)) return;
            md += `**${q.label}**\n${formatValue(answers[q.id])}\n\n`;
        });

        return md;
    }, [answers, typeConfig]);

    const handleCopy = useCallback(() => {
        const md = generateMarkdown();
        navigator.clipboard.writeText(md).then(() => alert("Brief copied to clipboard as Markdown!"));
    }, [generateMarkdown]);

    const handleDownload = useCallback(() => {
        const md = generateMarkdown();
        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `project-brief-${projectType}-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }, [generateMarkdown, projectType]);

    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};
        if (!form.name.trim()) errors.name = 'Your name is required.';
        if (!form.email.trim()) {
            errors.email = 'Your email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Please enter a valid email address.';
        }
        if (!form.projectName.trim()) errors.projectName = 'A project name is required.';
        return errors;
    }, [form]);

    const handlePublish = useCallback(async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setPublishStatus('loading');

        const payload = {
            submitter: {
                name: form.name.trim(),
                email: form.email.trim(),
            },
            project_name: form.projectName.trim(),
            project_type: projectType,
            project_type_label: typeConfig.label,
            submitted_at: new Date().toISOString(),
            answers,
            brief_markdown: generateMarkdown(),
        };

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            setPublishStatus('success');
        } catch (err) {
            setPublishError(err.message || 'Something went wrong. Please try again.');
            setPublishStatus('error');
        }
    }, [form, validateForm, answers, projectType, typeConfig, generateMarkdown]);

    const openModal = useCallback(() => {
        setPublishStatus(null);
        setPublishError('');
        setFormErrors({});
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        if (publishStatus === 'loading') return;
        setModalOpen(false);
    }, [publishStatus]);

    return (
        <div className="step-content summary-step" ref={briefRef}>
            <div className="step-header">
                <h2>📄 Project Brief — Review</h2>
                <p className="step-description">
                    Review the compiled brief below. Copy or download it to hand off to the build team.
                </p>
            </div>

            <div className="summary-actions">
                <button className="btn btn-primary" onClick={openModal}>🚀 Publish Brief</button>
                <button className="btn btn-secondary" onClick={handleCopy}>📋 Copy as Markdown</button>
                <button className="btn btn-secondary" onClick={handleDownload}>⬇ Download .md</button>
                <button className="btn btn-outline" onClick={onReset}>🔄 Start Over</button>
            </div>

            <div className="brief-output">
                <div className="brief-header-brand">
                    <img src={logoRangedDark} alt="Cliphair" className="brief-logo" />
                </div>
                <div className="brief-meta">
                    <span className="brief-type">{typeConfig.icon} {typeConfig.label}</span>
                    <span className="brief-date">
                        {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                </div>

                {allSections.map((section) => (
                    <div key={section.title} className={`brief-section ${section.isTypeSpecific ? "type-specific-section" : ""}`}>
                        <h3>{section.title}</h3>
                        {section.questions.map((q) => {
                            if (q.showIf && !q.showIf(answers)) return null;
                            const val = formatValue(answers[q.id]);
                            return (
                                <div key={q.id} className="brief-item">
                                    <dt>{q.label}</dt>
                                    <dd className={val === "—" ? "empty" : ""}>{val}</dd>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="brief-output-next">
                <h3>What Happens Next</h3>
                <ol>
                    <li>Brief lands with the build team</li>
                    <li>Builder reviews and books a short scoping call if needed</li>
                    <li>Builder produces a scope estimate and recommended approach</li>
                    <li>Approver signs off</li>
                    <li>Work begins</li>
                </ol>
            </div>

            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back to Edit</button>
            </div>

            {modalOpen && (
                <div className="publish-overlay" role="dialog" aria-modal="true" aria-labelledby="publish-modal-title" onClick={closeModal}>
                    <div className="publish-modal" onClick={(e) => e.stopPropagation()}>

                        {publishStatus === 'success' ? (
                            <div className="publish-success">
                                <div className="publish-success-icon">✅</div>
                                <h3>Brief Published!</h3>
                                <p>
                                    Your project brief has been sent to the build team. You'll hear back
                                    once it's been reviewed.
                                </p>
                                <button className="btn btn-primary" onClick={closeModal}>Close</button>
                            </div>
                        ) : (
                            <>
                                <div className="publish-modal-header">
                                    <h3 id="publish-modal-title">Publish Project Brief</h3>
                                    <button className="publish-modal-close" onClick={closeModal} aria-label="Close" disabled={publishStatus === 'loading'}>✕</button>
                                </div>

                                <p className="publish-modal-desc">
                                    This will create a task in ClickUp and notify the build team. Please fill
                                    in your details below so they know who submitted the brief.
                                </p>

                                <div className="publish-form">
                                    <div className="publish-field">
                                        <label htmlFor="publish-project-name">Project Name</label>
                                        <input
                                            id="publish-project-name"
                                            name="projectName"
                                            type="text"
                                            placeholder="e.g. Checkout Redesign Q2"
                                            value={form.projectName}
                                            onChange={handleFormChange}
                                            disabled={publishStatus === 'loading'}
                                        />
                                        {formErrors.projectName && <span className="publish-field-error">{formErrors.projectName}</span>}
                                    </div>

                                    <div className="publish-field">
                                        <label htmlFor="publish-name">Your Name</label>
                                        <input
                                            id="publish-name"
                                            name="name"
                                            type="text"
                                            placeholder="Jane Smith"
                                            value={form.name}
                                            onChange={handleFormChange}
                                            disabled={publishStatus === 'loading'}
                                        />
                                        {formErrors.name && <span className="publish-field-error">{formErrors.name}</span>}
                                    </div>

                                    <div className="publish-field">
                                        <label htmlFor="publish-email">Your Email</label>
                                        <input
                                            id="publish-email"
                                            name="email"
                                            type="email"
                                            placeholder="jane@cliphair.com"
                                            value={form.email}
                                            onChange={handleFormChange}
                                            disabled={publishStatus === 'loading'}
                                        />
                                        {formErrors.email && <span className="publish-field-error">{formErrors.email}</span>}
                                    </div>
                                </div>

                                {publishStatus === 'error' && (
                                    <p className="publish-error-msg">⚠️ {publishError}</p>
                                )}

                                <div className="publish-modal-actions">
                                    <button
                                        className="btn btn-outline"
                                        onClick={closeModal}
                                        disabled={publishStatus === 'loading'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handlePublish}
                                        disabled={publishStatus === 'loading'}
                                    >
                                        {publishStatus === 'loading' ? 'Publishing…' : '🚀 Publish Brief'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default StepSummary;
