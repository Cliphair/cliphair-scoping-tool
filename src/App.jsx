import { useState, useCallback } from 'react';
import './App.css';
import logoRangedCream from './assets/new branding/ranged---cream.png';
import sealCream from './assets/new branding/seal---cream.png';
import brandPattern from './assets/new branding/_Cliphair_Pattern_Off_White_RGB.svg';
import { stepsData } from './data/stepsData';
import { anythingElseStep } from './data/anythingElseStep';
import ProgressBar from './components/ui/ProgressBar';
import StepIntro from './components/steps/StepIntro';
import StepQuestions from './components/steps/StepQuestions';
import StepProjectType from './components/steps/StepProjectType';
import StepTypeSpecific from './components/steps/StepTypeSpecific';
import StepSummary from './components/steps/StepSummary';

const TOTAL_STEPS = 9;

// Derived from static data — defined at module level so it's never re-created
const stepLabels = [
    "Welcome",
    ...stepsData.map((s) => s.title),
    "Project Type",
    "Type-Specific",
    "Anything Else",
    "Review Brief",
];

function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [projectType, setProjectType] = useState("");
    const [openHelp, setOpenHelp] = useState(null);

    /*
     * Steps:
     * 0 = Welcome
     * 1–4 = Core steps (Problem, Today, Fixed, Importance)
     * 5 = Project Type selection
     * 6 = Type-specific questions
     * 7 = Anything Else
     * 8 = Review & Export
     */

    const handleAnswer = useCallback((id, value) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    }, []);

    const toggleHelp = useCallback((id) => {
        setOpenHelp((prev) => (prev === id ? null : id));
    }, []);

    const goNext = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
        setOpenHelp(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const goBack = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        setOpenHelp(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleReset = useCallback(() => {
        if (confirm("This will clear all your answers. Are you sure?")) {
            setAnswers({});
            setProjectType("");
            setCurrentStep(0);
            setOpenHelp(null);
        }
    }, []);

    const renderStep = () => {
        if (currentStep === 0) {
            return <StepIntro onNext={goNext} />;
        }

        if (currentStep >= 1 && currentStep <= 4) {
            return (
                <StepQuestions
                    step={stepsData[currentStep - 1]}
                    stepIndex={currentStep - 1}
                    totalCoreSteps={8}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onNext={goNext}
                    onBack={goBack}
                    openHelp={openHelp}
                    onToggleHelp={toggleHelp}
                />
            );
        }

        if (currentStep === 5) {
            return (
                <StepProjectType
                    selectedType={projectType}
                    onSelect={setProjectType}
                    onNext={goNext}
                    onBack={goBack}
                    onAnswer={handleAnswer}
                />
            );
        }

        if (currentStep === 6) {
            return (
                <StepTypeSpecific
                    projectType={projectType}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onNext={goNext}
                    onBack={goBack}
                    openHelp={openHelp}
                    onToggleHelp={toggleHelp}
                />
            );
        }

        if (currentStep === 7) {
            return (
                <StepQuestions
                    step={anythingElseStep}
                    stepIndex={6}
                    totalCoreSteps={8}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onNext={goNext}
                    onBack={goBack}
                    openHelp={openHelp}
                    onToggleHelp={toggleHelp}
                />
            );
        }

        if (currentStep === 8) {
            return (
                <StepSummary
                    answers={answers}
                    projectType={projectType}
                    onBack={goBack}
                    onReset={handleReset}
                />
            );
        }
    };

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="header-inner">
                    <img src={logoRangedCream} alt="Cliphair" className="header-logo" />
                    <span className="logo-subtitle">Scoping Tool</span>
                </div>
            </header>

            {currentStep > 0 && (
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    stepLabels={stepLabels}
                />
            )}

            <main className="app-main">
                {renderStep()}
            </main>

            <footer className="app-footer">
                <div className="footer-pattern" style={{ backgroundImage: `url(${brandPattern})` }}></div>
                <div className="footer-content">
                    <img src={sealCream} alt="" className="footer-seal" />
                    <img src={logoRangedCream} alt="Cliphair" className="footer-logo" />
                    <p>Project Scoping Questionnaire — Cliphair</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
