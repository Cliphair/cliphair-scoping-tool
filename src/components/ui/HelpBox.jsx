import { memo } from 'react';

const HelpBox = memo(function HelpBox({ help, isOpen, onToggle }) {
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
});

export default HelpBox;
