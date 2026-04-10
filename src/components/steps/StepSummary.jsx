import { memo, useRef, useCallback, useMemo } from 'react';
import { stepsData } from '../../data/stepsData';
import { typeSpecificQuestions } from '../../data/typeSpecificQuestions';
import { anythingElseStep } from '../../data/anythingElseStep';
import logoRangedDark from '../../assets/new branding/ranged---dark-gray.png';

// Pure utility — no closure over component state
function formatValue(val) {
    if (Array.isArray(val)) return val.filter(Boolean).join(", ") || "—";
    return val || "—";
}

const StepSummary = memo(function StepSummary({ answers, projectType, onBack, onReset }) {
    const briefRef = useRef(null);
    const typeConfig = typeSpecificQuestions[projectType];

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
});

export default StepSummary;
