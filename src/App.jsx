import { useState, useCallback } from 'react';
import './App.css';
import logoRangedCream from './assets/new branding/ranged---cream.png';
import sealCream from './assets/new branding/seal---cream.png';
import brandPattern from './assets/new branding/_Cliphair_Pattern_Off_White_RGB.svg';
import { stepsData } from './data/stepsData';
import { anythingElseStep } from './data/anythingElseStep';
import ProgressBar from './components/ui/ProgressBar';
import StepIntro from './components/steps/StepIntro';
import StepQuestions from './components/steps/StepQuestions';
import StepProjectType from './components/steps/StepProjectType';
import StepTypeSpecific from './components/steps/StepTypeSpecific';
import StepSummary from './components/steps/StepSummary';

const TOTAL_STEPS = 9;

// Derived from static data — defined at module level so it's never re-created
const stepLabels = [
    "Welcome",
    ...stepsData.map((s) => s.title),
    "Project Type",
    "Type-Specific",
    "Anything Else",
    "Review Brief",
];

const notSureRecommendations = {
    automation: "This sounds like a repeatable process that can run on its own once set up.",
    agent: "This sounds like it needs an AI that can understand questions and give relevant answers.",
    app: "This sounds like you need a dedicated tool with a visual interface.",
    combination: "This sounds like it might need more than one piece — for example, an automation that feeds data into a dashboard, or an AI agent backed by an automated workflow."
};

/* Anything-else step (Step 7 in PRD) */
const anythingElseStep = {
    id: "anything_else_step",
    title: "Anything Else?",
    description: "Catch-all for context that doesn't fit elsewhere.",
    questions: [
        {
            id: "constraints", label: "Are there any constraints we should know about?",
            hint: "Budget limits, security requirements, things that can't change, legal or compliance needs",
            type: "textarea",
            help: {
                examples: [
                    "It must work within Shopify's API rate limits.",
                    "Customer data can't leave the EU.",
                    "We only have budget for a quick fix right now — a full build can wait.",
                    "None that I know of."
                ]
            }
        },
        {
            id: "brand_guidelines", label: "Does this need to follow Cliphair brand guidelines?",
            type: "select", options: ["Yes", "No", "Not sure"],
            help: { tip: 'If customers or trade clients will see it, the answer is probably "Yes." Internal-only tools usually don\'t need full brand styling.' }
        },
        {
            id: "anything_else", label: "Anything else that would help us understand this?",
            hint: "Background context, things you've tried, links to similar tools, gut feelings",
            type: "textarea",
            help: { tip: "There's no wrong answer here. If something feels relevant but you're not sure where it fits, put it here." }
        }
    ]
};

/* ─────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────── */

function ProgressBar({ currentStep, totalSteps, stepLabels }) {
    const percentage = Math.round((currentStep / (totalSteps - 1)) * 100);

    return (
        <div className="progress-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="progress-label">
                Step {currentStep} of {totalSteps - 1} — {stepLabels[currentStep]}
            </div>
        </div>
    );
}

/* ── Help Box ── */
function HelpBox({ help, isOpen, onToggle }) {
    if (!help) return null;

    return (
        <span className="help-trigger-wrap">
            <button type="button" className="help-trigger" onClick={onToggle} aria-label="Show help">?</button>
            {isOpen && (
                <div className="help-box">
                    <button type="button" className="help-close" onClick={onToggle} aria-label="Close help">✕</button>
                    {help.why && <p className="help-why"><strong>Why we're asking:</strong> {help.why}</p>}
                    {help.examples && (
                        <>
                            <p className="help-heading"><strong>Examples:</strong></p>
                            <ul className="help-examples">
                                {help.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                            </ul>
                        </>
                    )}
                    {help.tip && <p className="help-tip"><strong>Tip:</strong> {help.tip}</p>}
                </div>
            )}
        </span>
    );
}

/* ── Question Field ── */
function QuestionField({ question, value, onChange, answers, openHelp, onToggleHelp }) {
    if (question.showIf && !question.showIf(answers)) return null;

    const inputId = `field-${question.id}`;

    /* Multi-select checkbox handler */
    const handleCheckbox = (opt) => {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt];
        onChange(question.id, next);
    };

    /* Repeatable text handler */
    const repeatableValues = Array.isArray(value) ? value : [""];
    const handleRepeatableChange = (idx, val) => {
        const next = [...repeatableValues];
        next[idx] = val;
        onChange(question.id, next);
    };
    const addRow = () => onChange(question.id, [...repeatableValues, ""]);
    const removeRow = (idx) => {
        const next = repeatableValues.filter((_, i) => i !== idx);
        onChange(question.id, next.length ? next : [""]);
    };

    return (
        <div className="question-field">
            <div className="label-row">
                <label htmlFor={inputId}>{question.label}</label>
                <HelpBox help={question.help} isOpen={openHelp === question.id} onToggle={() => onToggleHelp(question.id)} />
            </div>
            {question.hint && <span className="hint">{question.hint}</span>}

            {question.type === "text" && (
                <input id={inputId} type="text" value={value || ""} onChange={(e) => onChange(question.id, e.target.value)} autoComplete="off" />
            )}

            {question.type === "textarea" && (
                <textarea id={inputId} value={value || ""} onChange={(e) => onChange(question.id, e.target.value)} rows={4} />
            )}

            {question.type === "select" && (
                <select id={inputId} value={value || ""} onChange={(e) => onChange(question.id, e.target.value)}>
                    <option value="">— Select —</option>
                    {question.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            )}

            {question.type === "multi-select" && (
                <div className="checkbox-group">
                    {question.options.map((opt) => (
                        <label key={opt} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={Array.isArray(value) && value.includes(opt)}
                                onChange={() => handleCheckbox(opt)}
                            />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            )}

            {question.type === "repeatable-text" && (
                <div className="repeatable-group">
                    {repeatableValues.map((v, idx) => (
                        <div key={idx} className="repeatable-row">
                            <input
                                type="text"
                                value={v}
                                onChange={(e) => handleRepeatableChange(idx, e.target.value)}
                                placeholder="https://..."
                                autoComplete="off"
                            />
                            {repeatableValues.length > 1 && (
                                <button type="button" className="btn-remove-row" onClick={() => removeRow(idx)} aria-label="Remove">✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline btn-sm" onClick={addRow}>+ Add another link</button>
                </div>
            )}

            {question.type === "matrix" && (
                <PriorityMatrix value={value} onChange={(val) => onChange(question.id, val)} />
            )}
        </div>
    );
}

/* ── Priority Matrix ── */
function PriorityMatrix({ value, onChange }) {
    const quadrants = [
        { id: "Do Next", label: "Do Next", desc: "Important but not urgent — big impact, can be planned in", row: "top", col: "left" },
        { id: "Do Now", label: "Do Now", desc: "Important and urgent — losing money, customers, or significant time", row: "top", col: "right" },
        { id: "Park It", label: "Park It", desc: "Nice to have — worth recording but not a priority right now", row: "bottom", col: "left" },
        { id: "Quick Win", label: "Quick Win", desc: "Not critical, but urgent or easy — low effort, clear payoff", row: "bottom", col: "right" }
    ];

    return (
        <div className="priority-matrix">
            <div className="matrix-axis matrix-y-label">Important</div>
            <div className="matrix-axis matrix-x-label">Urgent</div>
            <div className="matrix-grid">
                {quadrants.map((q) => (
                    <button
                        key={q.id}
                        type="button"
                        className={`matrix-cell matrix-${q.row}-${q.col} ${value === q.id ? "selected" : ""}`}
                        onClick={() => onChange(q.id)}
                    >
                        <span className="matrix-label">{q.label}</span>
                        <span className="matrix-desc">{q.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ── Welcome / Intro ── */
function StepIntro({ onNext }) {
    return (
        <div className="step-content intro-step">
            <div className="intro-motif-bg" style={{ backgroundImage: `url(${motifCoral})` }}></div>
            <img src={speechmarksTopCharcoal} alt="" className="intro-speechmark intro-speechmark-open" />
            <h1>Project Scoping Questionnaire</h1>
            <p className="intro-strapline">Be the you you want to be.</p>
            <p className="intro-lead">
                This guided questionnaire helps you capture the problem, the context,
                and what good would look like — so the build team has everything they need.
            </p>
            <div className="intro-process">
                <h3>How it works</h3>
                <ol>
                    <li><strong>What's the Problem?</strong> — Define the pain point and who it affects</li>
                    <li><strong>What Happens Today?</strong> — Current process, tools, and time spent</li>
                    <li><strong>What Would Fixed Look Like?</strong> — Desired outcome and priorities</li>
                    <li><strong>How Important Is This?</strong> — Urgency, timeline, and approval</li>
                    <li><strong>What Type of Project?</strong> — Automation, Agent, or App</li>
                    <li><strong>Type-Specific Questions</strong> — Tailored follow-up</li>
                    <li><strong>Anything Else?</strong> — Constraints and context</li>
                    <li><strong>Review & Export</strong> — Copy or download your brief</li>
                </ol>
            </div>
            <p className="intro-tip">
                <img src={speechmarksBottomCharcoal} alt="" className="inline-speechmark" />
                <strong>Tip:</strong> Plain English is perfect. "I don't know" is a valid answer.
                A screenshot or screen recording beats a paragraph every time.
            </p>
            <button className="btn btn-primary btn-lg" onClick={onNext}>
                Get Started →
            </button>
            <img src={speechmarksBottomCharcoal} alt="" className="intro-speechmark intro-speechmark-close" />
        </div>
    );
}

/* ── Generic Step (Steps 1–4 & Step 7) ── */
function StepQuestions({ step, stepIndex, totalCoreSteps, answers, onAnswer, onNext, onBack, openHelp, onToggleHelp }) {
    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-number-row">
                    <img src={marquePanelCream} alt="" className="step-marque-icon" />
                    <span className="step-number">Step {stepIndex + 1} of {totalCoreSteps}</span>
                </div>
                <h2>{step.title}</h2>
                <p className="step-description">{step.description}</p>
            </div>
            <div className="questions-group">
                {step.questions.map((q) => (
                    <QuestionField
                        key={q.id}
                        question={q}
                        value={answers[q.id]}
                        onChange={onAnswer}
                        answers={answers}
                        openHelp={openHelp}
                        onToggleHelp={onToggleHelp}
                    />
                ))}
            </div>
            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-primary" onClick={onNext}>Continue →</button>
            </div>
        </div>
    );
}

/* ── Project Type Selection (Step 5) ── */
function StepProjectType({ selectedType, onSelect, onNext, onBack, answers, onAnswer, openHelp, onToggleHelp }) {
    const [notSureStep, setNotSureStep] = useState(0);
    const [recommendation, setRecommendation] = useState(null);
    const showingNotSure = selectedType === "not_sure";

    const handleTypeSelect = (key) => {
        onSelect(key);
        setNotSureStep(0);
        setRecommendation(null);
    };

    const handleNotSureAnswer = (option) => {
        onAnswer(`guide_${notSureQuestions[notSureStep].id}`, option.value);

        if (option.maps) {
            /* We have a recommendation */
            setRecommendation(option.maps);
        } else {
            /* Continue to next diagnostic question */
            if (notSureStep < notSureQuestions.length - 1) {
                setNotSureStep((prev) => prev + 1);
            }
        }
    };

    const confirmRecommendation = (type) => {
        onSelect(type);
        setRecommendation(null);
    };

    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-number-row">
                    <img src={marquePanelCream} alt="" className="step-marque-icon" />
                    <span className="step-number">Step 5 of 8</span>
                </div>
                <h2>What Type of Project Is This?</h2>
                <p className="step-description">
                    Choose the type that best describes what you need, or pick "I'm not sure" and we'll help you work it out.
                </p>
            </div>

            <div className="type-cards">
                {Object.entries(typeSpecificQuestions).map(([key, type]) => (
                    <button
                        key={key}
                        className={`type-card ${selectedType === key ? "selected" : ""}`}
                        onClick={() => handleTypeSelect(key)}
                    >
                        <img src={marquePanelCream} alt="" className="type-card-bg-marque" />
                        <span className="type-icon">{type.icon}</span>
                        <span className="type-label">{type.label}</span>
                        <span className="type-tagline">{type.tagline}</span>
                    </button>
                ))}
                <button
                    className={`type-card ${selectedType === "not_sure" ? "selected" : ""}`}
                    onClick={() => handleTypeSelect("not_sure")}
                >
                    <img src={marquePanelCream} alt="" className="type-card-bg-marque" />
                    <span className="type-icon">🤷</span>
                    <span className="type-label">I'm Not Sure</span>
                    <span className="type-tagline">Help me work out the best approach</span>
                </button>
            </div>

            {/* Not-Sure guided flow */}
            {showingNotSure && !recommendation && (
                <div className="not-sure-flow">
                    <div className="not-sure-question">
                        <h3>{notSureQuestions[notSureStep].label}</h3>
                        <div className="not-sure-options">
                            {notSureQuestions[notSureStep].options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className="btn btn-outline not-sure-option"
                                    onClick={() => handleNotSureAnswer(opt)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendation */}
            {showingNotSure && recommendation && (
                <div className="not-sure-recommendation">
                    {recommendation === "combination" ? (
                        <>
                            <p>{notSureRecommendations.combination}</p>
                            <p>Don't worry about getting it exactly right. Pick the one that feels closest to the core of what you need, and we'll figure out the rest during scoping.</p>
                            <div className="recommendation-pick">
                                <button className="btn btn-primary" onClick={() => confirmRecommendation("automation")}>⚙️ Automation</button>
                                <button className="btn btn-primary" onClick={() => confirmRecommendation("agent")}>🤖 Agent</button>
                                <button className="btn btn-primary" onClick={() => confirmRecommendation("app")}>🖥️ App</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>Based on your answers, this sounds like it's best suited as {recommendation === "automation" ? "an" : "a"} <strong>{typeSpecificQuestions[recommendation].icon} {typeSpecificQuestions[recommendation].label}</strong>.</p>
                            <p>{notSureRecommendations[recommendation]}</p>
                            <p><strong>Does that sound right?</strong></p>
                            <div className="recommendation-pick">
                                <button className="btn btn-primary" onClick={() => confirmRecommendation(recommendation)}>Yes, continue</button>
                                <button className="btn btn-secondary" onClick={() => { setRecommendation(null); setNotSureStep(0); handleTypeSelect("not_sure"); }}>No, let me pick manually</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-primary" onClick={onNext} disabled={!selectedType || selectedType === "not_sure"}>
                    Continue →
                </button>
            </div>
        </div>
    );
}

/* ── Type-Specific Questions (Step 6) ── */
function StepTypeSpecific({ projectType, answers, onAnswer, onNext, onBack, openHelp, onToggleHelp }) {
    const config = typeSpecificQuestions[projectType];

    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-number-row">
                    <img src={marquePanelCream} alt="" className="step-marque-icon" />
                    <span className="step-number">{config.icon} {config.label}</span>
                </div>
                <h2>Type-Specific Questions</h2>
                <p className="step-description">{config.tagline}</p>
            </div>
            <div className="questions-group">
                {config.questions.map((q) => (
                    <QuestionField
                        key={q.id}
                        question={q}
                        value={answers[q.id]}
                        onChange={onAnswer}
                        answers={answers}
                        openHelp={openHelp}
                        onToggleHelp={onToggleHelp}
                    />
                ))}
            </div>
            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-primary" onClick={onNext}>Continue →</button>
            </div>
        </div>
    );
}

/* ── Summary / Review (Step 8) ── */
function StepSummary({ answers, projectType, onBack, onReset }) {
    const briefRef = useRef(null);
    const typeConfig = typeSpecificQuestions[projectType];

    const formatValue = (val) => {
        if (Array.isArray(val)) return val.filter(Boolean).join(", ") || "—";
        return val || "—";
    };

    const generateMarkdown = () => {
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
    };

    const handleCopy = () => {
        const md = generateMarkdown();
        navigator.clipboard.writeText(md).then(() => alert("Brief copied to clipboard as Markdown!"));
    };

    const handleDownload = () => {
        const md = generateMarkdown();
        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `project-brief-${projectType}-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const allSections = [
        ...stepsData.map((s) => ({ title: s.title, questions: s.questions })),
        { title: `${typeConfig.icon} ${typeConfig.label} — Specific Details`, questions: typeConfig.questions, isTypeSpecific: true },
        { title: anythingElseStep.title, questions: anythingElseStep.questions }
    ];

    return (
        <div className="step-content summary-step" ref={briefRef}>
            <div className="step-header">
                <h2>📄 Project Brief — Review</h2>
                <p className="step-description">
                    Review the compiled brief below. Copy or download it to hand off to the build team.
                </p>
            </div>

            <div className="summary-actions">
                <button className="btn btn-primary" onClick={handleCopy}>📋 Copy as Markdown</button>
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
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────── */

function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [projectType, setProjectType] = useState("");
    const [openHelp, setOpenHelp] = useState(null);

    /*
     * Steps:
     * 0 = Welcome
     * 1–4 = Core steps (Problem, Today, Fixed, Importance)
     * 5 = Project Type selection
     * 6 = Type-specific questions
     * 7 = Anything Else
     * 8 = Review & Export
     */

    const handleAnswer = useCallback((id, value) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    }, []);

    const toggleHelp = useCallback((id) => {
        setOpenHelp((prev) => (prev === id ? null : id));
    }, []);

    const goNext = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
        setOpenHelp(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const goBack = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        setOpenHelp(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleReset = useCallback(() => {
        if (confirm("This will clear all your answers. Are you sure?")) {
            setAnswers({});
            setProjectType("");
            setCurrentStep(0);
            setOpenHelp(null);
        }
    }, []);

    const renderStep = () => {
        if (currentStep === 0) {
            return <StepIntro onNext={goNext} />;
        }

        if (currentStep >= 1 && currentStep <= 4) {
            return (
                <StepQuestions
                    step={stepsData[currentStep - 1]}
                    stepIndex={currentStep - 1}
                    totalCoreSteps={8}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onNext={goNext}
                    onBack={goBack}
                    openHelp={openHelp}
                    onToggleHelp={toggleHelp}
                />
            );
        }

        if (currentStep === 5) {
            return (
                <StepProjectType
                    selectedType={projectType}
                    onSelect={setProjectType}
                    onNext={goNext}
                    onBack={goBack}
                    onAnswer={handleAnswer}
                />
            );
        }

        if (currentStep === 6) {
            return (
                <StepTypeSpecific
                    projectType={projectType}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onNext={goNext}
                    onBack={goBack}
                    openHelp={openHelp}
                    onToggleHelp={toggleHelp}
                />
            );
        }

        if (currentStep === 7) {
            return (
                <StepQuestions
                    step={anythingElseStep}
                    stepIndex={6}
                    totalCoreSteps={8}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onNext={goNext}
                    onBack={goBack}
                    openHelp={openHelp}
                    onToggleHelp={toggleHelp}
                />
            );
        }

        if (currentStep === 8) {
            return (
                <StepSummary
                    answers={answers}
                    projectType={projectType}
                    onBack={goBack}
                    onReset={handleReset}
                />
            );
        }
    };

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="header-inner">
                    <img src={logoRangedCream} alt="Cliphair" className="header-logo" />
                    <span className="logo-subtitle">Scoping Tool</span>
                </div>
            </header>

            {currentStep > 0 && (
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    stepLabels={stepLabels}
                />
            )}

            <main className="app-main">
                {renderStep()}
            </main>

            <footer className="app-footer">
                <div className="footer-pattern" style={{ backgroundImage: `url(${brandPattern})` }}></div>
                <div className="footer-content">
                    <img src={sealCream} alt="" className="footer-seal" />
                    <img src={logoRangedCream} alt="Cliphair" className="footer-logo" />
                    <p>Project Scoping Questionnaire — Cliphair</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
