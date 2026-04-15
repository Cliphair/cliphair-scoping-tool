import { memo } from 'react';

const ProgressBar = memo(function ProgressBar({ currentStep, totalSteps, stepLabels }) {
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
});

export default ProgressBar;
