import { memo, useState, useCallback } from 'react';
import { typeSpecificQuestions } from '../../data/typeSpecificQuestions';
import QuestionField from '../ui/QuestionField';
import marquePanelCream from '../../assets/new branding/marque-panel---cream.png';
import { validateQuestions, isValid } from '../../utils/validation';

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
    const [errors, setErrors] = useState({});

    const handleAnswer = useCallback((id, value) => {
        onAnswer(id, value);
        setErrors((prev) => {
            if (!prev[id]) return prev;
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, [onAnswer]);

    const handleNext = useCallback(() => {
        const newErrors = validateQuestions(config.questions, answers);
        if (!isValid(newErrors)) {
            setErrors(newErrors);
            const firstId = Object.keys(newErrors)[0];
            document.getElementById(`field-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setErrors({});
        onNext();
    }, [config.questions, answers, onNext]);

    const handlePopulate = useCallback(() => {
        config.questions.forEach((q) => {
            if (q.test_data !== undefined) {
                onAnswer(q.id, q.test_data);
            }
        });
        setErrors({});
    }, [config.questions, onAnswer]);

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
                <button className="btn btn-ghost" onClick={handlePopulate}>Populate test data</button>
                <button className="btn btn-primary" onClick={handleNext}>Continue →</button>
            </div>
        </div>
    );
});

export default StepTypeSpecific;
