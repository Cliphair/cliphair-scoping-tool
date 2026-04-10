import { memo, useCallback } from 'react';
import HelpBox from './HelpBox';
import PriorityMatrix from './PriorityMatrix';

const QuestionField = memo(function QuestionField({ question, value, onChange, answers, openHelp, onToggleHelp }) {
    if (question.showIf && !question.showIf(answers)) return null;

    const inputId = `field-${question.id}`;

    // Stable callbacks — question.id is from static data so never changes between renders
    const handleToggleHelp = useCallback(
        () => onToggleHelp(question.id),
        [onToggleHelp, question.id]
    );

    const handleTextChange = useCallback(
        (e) => onChange(question.id, e.target.value),
        [onChange, question.id]
    );

    const handleMatrixChange = useCallback(
        (val) => onChange(question.id, val),
        [onChange, question.id]
    );

    const handleCheckbox = useCallback((opt) => {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(opt)
            ? current.filter((v) => v !== opt)
            : [...current, opt];
        onChange(question.id, next);
    }, [value, onChange, question.id]);

    // Repeatable-text helpers
    const repeatableValues = Array.isArray(value) ? value : [""];

    const handleRepeatableChange = useCallback((idx, val) => {
        const next = [...repeatableValues];
        next[idx] = val;
        onChange(question.id, next);
    }, [repeatableValues, onChange, question.id]);

    const addRow = useCallback(
        () => onChange(question.id, [...repeatableValues, ""]),
        [repeatableValues, onChange, question.id]
    );

    const removeRow = useCallback((idx) => {
        const next = repeatableValues.filter((_, i) => i !== idx);
        onChange(question.id, next.length ? next : [""]);
    }, [repeatableValues, onChange, question.id]);

    return (
        <div className="question-field">
            <div className="label-row">
                <label htmlFor={inputId}>{question.label}</label>
                <HelpBox
                    help={question.help}
                    isOpen={openHelp === question.id}
                    onToggle={handleToggleHelp}
                />
            </div>
            {question.hint && <span className="hint">{question.hint}</span>}

            {question.type === "text" && (
                <input
                    id={inputId}
                    type="text"
                    value={value || ""}
                    onChange={handleTextChange}
                    autoComplete="off"
                />
            )}

            {question.type === "textarea" && (
                <textarea
                    id={inputId}
                    value={value || ""}
                    onChange={handleTextChange}
                    rows={4}
                />
            )}

            {question.type === "select" && (
                <select id={inputId} value={value || ""} onChange={handleTextChange}>
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
                                <button
                                    type="button"
                                    className="btn-remove-row"
                                    onClick={() => removeRow(idx)}
                                    aria-label="Remove"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline btn-sm" onClick={addRow}>
                        + Add another link
                    </button>
                </div>
            )}

            {question.type === "matrix" && (
                <PriorityMatrix value={value} onChange={handleMatrixChange} />
            )}
        </div>
    );
});

export default QuestionField;
