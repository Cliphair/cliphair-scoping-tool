import { memo, useState, useCallback } from 'react';
import QuestionField from '../ui/QuestionField';
import marquePanelCoral from '../../assets/new branding/marque-panel---coral.png';
import { validateQuestions, isValid } from '../../utils/validation';

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
    const [errors, setErrors] = useState({});

    const handleAnswer = useCallback((id, value) => {
        onAnswer(id, value);
        // Clear the error for this field as soon as it's answered
        setErrors((prev) => {
            if (!prev[id]) return prev;
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, [onAnswer]);

    const handleNext = useCallback(() => {
        const newErrors = validateQuestions(step.questions, answers);
        if (!isValid(newErrors)) {
            setErrors(newErrors);
            // Scroll to the first invalid field
            const firstId = Object.keys(newErrors)[0];
            document.getElementById(`field-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setErrors({});
        onNext();
    }, [step.questions, answers, onNext]);

    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-number-row">
                    <img src={marquePanelCoral} alt="" className="step-marque-icon" />
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
                        onChange={handleAnswer}
                        answers={answers}
                        openHelp={openHelp}
                        onToggleHelp={onToggleHelp}
                        error={errors[q.id]}
                    />
                ))}
            </div>
            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Continue →</button>
            </div>
        </div>
    );
});

export default StepQuestions;
