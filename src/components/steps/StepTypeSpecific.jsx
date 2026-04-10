import { memo } from 'react';
import { typeSpecificQuestions } from '../../data/typeSpecificQuestions';
import QuestionField from '../ui/QuestionField';
import marquePanelCream from '../../assets/new branding/marque-panel---cream.png';

const StepTypeSpecific = memo(function StepTypeSpecific({
    projectType,
    answers,
    onAnswer,
    onNext,
    onBack,
    openHelp,
    onToggleHelp,
}) {
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
});

export default StepTypeSpecific;
