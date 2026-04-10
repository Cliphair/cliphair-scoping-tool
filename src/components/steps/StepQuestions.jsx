import { memo } from 'react';
import QuestionField from '../ui/QuestionField';
import marquePanelCream from '../../assets/new branding/marque-panel---cream.png';

const StepQuestions = memo(function StepQuestions({
    step,
    stepIndex,
    totalCoreSteps,
    answers,
    onAnswer,
    onNext,
    onBack,
    openHelp,
    onToggleHelp,
}) {
    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-number-row">
                    <img src={marquePanelCream} alt="" className="step-marque-icon" />
                    {/* <span className="step-number">Step {stepIndex + 1} of {totalCoreSteps}</span> */}
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
});

export default StepQuestions;
