import { memo, useRef, useEffect } from 'react';

const HelpBox = memo(function HelpBox({ help, isOpen, onToggle }) {
    const wrapRef = useRef(null);

    // Close on outside click/tap
    useEffect(() => {
        if (!isOpen) return;
        const handlePointerDown = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                onToggle();
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [isOpen, onToggle]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onToggle();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onToggle]);

    // Scroll lock
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!help) return null;

    return (
        <>
            {isOpen && <div className="help-backdrop" />}
            <span className="help-trigger-wrap" ref={wrapRef}>
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
        </>
    );
});

export default HelpBox;
