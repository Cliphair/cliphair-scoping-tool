import { memo } from 'react';

// Defined outside the component — static data, never changes at runtime
const quadrants = [
    { id: "Do Next", label: "Do Next", desc: "Important but not urgent — big impact, can be planned in", row: "top", col: "left" },
    { id: "Do Now", label: "Do Now", desc: "Important and urgent — losing money, customers, or significant time", row: "top", col: "right" },
    { id: "Park It", label: "Park It", desc: "Nice to have — worth recording but not a priority right now", row: "bottom", col: "left" },
    { id: "Quick Win", label: "Quick Win", desc: "Not critical, but urgent or easy — low effort, clear payoff", row: "bottom", col: "right" }
];

const PriorityMatrix = memo(function PriorityMatrix({ value, onChange }) {
    return (
        <div className="priority-matrix">
            <div className="matrix-axis matrix-y-label">Important</div>
            <div className="matrix-axis matrix-x-label">Urgent</div>
            <div className="matrix-grid">
                {quadrants.map((q) => (
                    <button
                        key={q.id}
                        type="button"
                        className={`matrix-cell matrix-${q.row}-${q.col} ${value === q.id ? "selected" : ""}`}
                        onClick={() => onChange(q.id)}
                    >
                        <span className="matrix-label">{q.label}</span>
                        <span className="matrix-desc">{q.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});

export default PriorityMatrix;
