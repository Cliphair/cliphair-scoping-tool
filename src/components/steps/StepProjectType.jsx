import { memo, useState, useCallback } from 'react';
import { typeSpecificQuestions, notSureQuestions, notSureRecommendations } from '../../data/typeSpecificQuestions';
import marquePanelCream from '../../assets/new branding/marque-panel---cream.png';

const StepProjectType = memo(function StepProjectType({
    selectedType,
    onSelect,
    onNext,
    onBack,
    onAnswer,
}) {
    const [notSureStep, setNotSureStep] = useState(0);
    const [recommendation, setRecommendation] = useState(null);
    const showingNotSure = selectedType === "not_sure";

    const handleTypeSelect = useCallback((key) => {
        onSelect(key);
        setNotSureStep(0);
        setRecommendation(null);
    }, [onSelect]);

    const handleNotSureAnswer = useCallback((option) => {
        onAnswer(`guide_${notSureQuestions[notSureStep].id}`, option.value);

        if (option.maps) {
            setRecommendation(option.maps);
        } else if (notSureStep < notSureQuestions.length - 1) {
            setNotSureStep((prev) => prev + 1);
        }
    }, [onAnswer, notSureStep]);

    const confirmRecommendation = useCallback((type) => {
        onSelect(type);
        setRecommendation(null);
    }, [onSelect]);

    const resetNotSure = useCallback(() => {
        setRecommendation(null);
        setNotSureStep(0);
        onSelect("not_sure");
    }, [onSelect]);

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
                                <button className="btn btn-secondary" onClick={resetNotSure}>No, let me pick manually</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-ghost" onClick={() => handleTypeSelect("automation")}>Populate test data</button>
                <button
                    className="btn btn-primary"
                    onClick={onNext}
                    disabled={!selectedType || selectedType === "not_sure"}
                >
                    Continue →
                </button>
            </div>
        </div>
    );
});

export default StepProjectType;
