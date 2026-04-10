import { memo } from 'react';
import motifCoral from '../../assets/new branding/motif-7---coral.png';
import speechmarksTopCharcoal from '../../assets/new branding/speechmarks-top---dark-gray.png';
import speechmarksBottomCharcoal from '../../assets/new branding/speechmarks-bottom---dark-gray.png';

const StepIntro = memo(function StepIntro({ onNext }) {
    return (
        <div className="step-content intro-step">
            <div className="intro-motif-bg" style={{ backgroundImage: `url(${motifCoral})` }}></div>
            <img src={speechmarksTopCharcoal} alt="" className="intro-speechmark intro-speechmark-open" />
            <h1>Project Scoping Questionnaire</h1>
            <p className="intro-strapline">Be the you you want to be.</p>
            <p className="intro-lead">
                This guided questionnaire helps you capture the problem, the context,
                and what good would look like — so the build team has everything they need.
            </p>
            <div className="intro-process">
                <h3>How it works</h3>
                <ol>
                    <li><strong>What's the Problem?</strong> — Define the pain point and who it affects</li>
                    <li><strong>What Happens Today?</strong> — Current process, tools, and time spent</li>
                    <li><strong>What Would Fixed Look Like?</strong> — Desired outcome and priorities</li>
                    <li><strong>How Important Is This?</strong> — Urgency, timeline, and approval</li>
                    <li><strong>What Type of Project?</strong> — Automation, Agent, or App</li>
                    <li><strong>Type-Specific Questions</strong> — Tailored follow-up</li>
                    <li><strong>Anything Else?</strong> — Constraints and context</li>
                    <li><strong>Review & Export</strong> — Copy or download your brief</li>
                </ol>
            </div>
            <p className="intro-tip">
                <img src={speechmarksBottomCharcoal} alt="" className="inline-speechmark" />
                <strong>Tip:</strong> Plain English is perfect. "I don't know" is a valid answer.
                A screenshot or screen recording beats a paragraph every time.
            </p>
            <button className="btn btn-primary btn-lg" onClick={onNext}>
                Get Started →
            </button>
            <img src={speechmarksBottomCharcoal} alt="" className="intro-speechmark intro-speechmark-close" />
        </div>
    );
});

export default StepIntro;
