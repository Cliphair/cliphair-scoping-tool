import { useState } from "react";

const PHASES = [
  {
    id: "capture",
    label: "Capture",
    icon: "💡",
    questions: [
      { key: "what", label: "What is it?", placeholder: "A dashboard that pulls my ClickUp tasks and shows what's overdue...", type: "textarea" },
      { key: "who", label: "Who is it for?", placeholder: "Me and the team at Cliphair...", type: "input" },
      { key: "why", label: "Why does it matter?", placeholder: "I keep missing deadlines because I check three different tools...", type: "textarea" },
      { key: "done", label: "What does 'done' look like?", placeholder: "I open one page and see everything that needs my attention today...", type: "textarea" },
    ],
  },
  {
    id: "classify",
    label: "Classify",
    icon: "🔀",
    questions: [
      { key: "type", label: "What type is this?", type: "select", options: ["Project (a standalone app/tool)", "Automation (runs on a trigger)", "Both (automation feeding a project)"] },
      { key: "stack", label: "What tech will you use?", placeholder: "LAMP stack, vanilla JS, XAMPP local... or n8n automation...", type: "input" },
      { key: "complexity", label: "How complex is this?", type: "select", options: ["Quick win (1-2 hours)", "Weekend build (half a day)", "Proper project (multiple sessions)", "System (multiple connected pieces)"] },
    ],
  },
  {
    id: "challenge",
    label: "Challenge",
    icon: "⚡",
    questions: [
      { key: "exists", label: "Does something like this already exist?", placeholder: "Could a ClickUp automation or n8n workflow do this without custom code?", type: "textarea" },
      { key: "simplest", label: "What's the absolute simplest version?", placeholder: "Strip it down — what's the one thing it must do on day one?", type: "textarea" },
      { key: "blockers", label: "What could go wrong or block you?", placeholder: "API access, data format issues, skills I don't have yet...", type: "textarea" },
      { key: "connect", label: "How does this connect to your other projects?", placeholder: "Does it feed data to/from something else? Could it share components?", type: "textarea" },
    ],
  },
  {
    id: "plan",
    label: "Plan",
    icon: "📋",
    questions: [
      { key: "layers", label: "Map to 5 Layer Model — what goes where?", placeholder: "Layer 2: PRD for requirements, AGENTS.md update...\nLayer 3: New skill needed?\nLayer 4: Git repo, XAMPP isolation...", type: "textarea" },
      { key: "prd_scope", label: "What sections does the PRD need?", placeholder: "System overview, folder structure, file specs, config, implementation order...", type: "textarea" },
      { key: "first_step", label: "What's the very first thing to build?", placeholder: "The part that proves the concept works — usually the data flow...", type: "textarea" },
    ],
  },
];

const LAYER_MAP = {
  "Project (a standalone app/tool)": [
    "Layer 1: Chat prompts to build each file from PRD",
    "Layer 2: PRD in prds/ folder, check AGENTS.md",
    "Layer 3: Check for relevant skills, create if needed",
    "Layer 4: git init, commit after each file",
    "Layer 5: Run code-reviewer agent, test in XAMPP",
  ],
  "Automation (runs on a trigger)": [
    "Layer 1: Prompts to configure triggers and actions",
    "Layer 2: PRD describing the workflow and triggers",
    "Layer 3: n8n workflows, API connections, ClickUp automations",
    "Layer 4: Test with dummy data first, version control configs",
    "Layer 5: Monitor runs, check edge cases",
  ],
  "Both (automation feeding a project)": [
    "Layer 1: Build the project first, then wire the automation",
    "Layer 2: Two PRDs — one for the app, one for the automation",
    "Layer 3: Skills for the app, n8n/API for the automation",
    "Layer 4: Separate git repos or branches, test independently",
    "Layer 5: End-to-end test the full pipeline",
  ],
};

export default function IdeaBouncer() {
  const [phase, setPhase] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExport, setShowExport] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const current = PHASES[phase];

  const update = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));
  const filled = current.questions.filter((q) => answers[q.key]?.trim()).length;
  const total = current.questions.length;
  const progress = Math.round((filled / total) * 100);

  const generateBrief = () => {
    const lines = [];
    lines.push(`# Project Brief: ${answers.what?.split(".")[0] || "Untitled"}`);
    lines.push(`\n*Generated ${new Date().toLocaleDateString("en-GB")}*\n`);
    lines.push(`## The Idea\n${answers.what || "—"}\n`);
    lines.push(`## Who It's For\n${answers.who || "—"}\n`);
    lines.push(`## Why It Matters\n${answers.why || "—"}\n`);
    lines.push(`## Definition of Done\n${answers.done || "—"}\n`);
    lines.push(`## Classification\n- **Type:** ${answers.type || "—"}\n- **Stack:** ${answers.stack || "—"}\n- **Complexity:** ${answers.complexity || "—"}\n`);
    lines.push(`## Challenge Questions\n- **Existing solutions:** ${answers.exists || "—"}\n- **Simplest version:** ${answers.simplest || "—"}\n- **Potential blockers:** ${answers.blockers || "—"}\n- **Connections:** ${answers.connect || "—"}\n`);
    lines.push(`## Plan\n- **5 Layer mapping:** ${answers.layers || "—"}\n- **PRD scope:** ${answers.prd_scope || "—"}\n- **First step:** ${answers.first_step || "—"}\n`);

    if (answers.type && LAYER_MAP[answers.type]) {
      lines.push(`## Suggested Layer Actions\n`);
      LAYER_MAP[answers.type].forEach((l) => lines.push(`- ${l}`));
    }

    lines.push(`\n---\n*Next: Create prds/prd_[projectname].md from this brief*`);
    return lines.join("\n");
  };

  /* CHANGE 1: Fixed clipboard copy using execCommand fallback */
  const handleCopy = (text, setter) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    el.style.top = "-9999px";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, text.length);
    try { document.execCommand("copy"); setter(true); setTimeout(() => setter(false), 2500); } catch (e) { /* silent */ }
    document.body.removeChild(el);
  };

  const copyBrief = () => {
    handleCopy(generateBrief(), setCopiedBrief);
  };

  /* CHANGE 2: Generate a ready-to-paste prompt built from the user's answers */
  const projectName = answers.what
    ? answers.what.split(/[.,!?]/)[0].trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40)
    : "my-project";

  const generatePrompt = () => {
    const brief = generateBrief();
    const stackLine = answers.stack ? `The tech stack is: ${answers.stack}.` : "Use the tech stack defined in my AGENTS.md.";
    const extras = [
      answers.simplest ? `\nThe simplest MVP version is: ${answers.simplest}` : "",
      answers.blockers ? `\nPotential blockers to address in the PRD: ${answers.blockers}` : "",
      answers.first_step ? `\nThe first thing to build should be: ${answers.first_step}` : "",
    ].filter(Boolean).join("\n");

    return `Here is my project brief. I need you to turn this into a full PRD and save it as prds/prd_${projectName}.md

Follow the PRD format I use in my other PRDs (check my prds/ folder for examples like prd-dashboard.md). ${stackLine}

The PRD must include:
1. System Overview — how it works, with an ASCII diagram
2. Folder Structure — ASCII tree of every file, following my AGENTS.md conventions
3. File-by-File Spec — what each file does, step by step
4. Configuration — anything I need to set up manually
5. Implementation Order — numbered list of files in dependency order
6. Confirmed Decisions — table of key choices${extras}

Inform me of the steps you will take to complete this task and get my confirmation before proceeding.

---

${brief}`;
  };

  const suggestedActions = answers.type ? LAYER_MAP[answers.type] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1a",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: "1px solid rgba(129, 140, 248, 0.2)",
        padding: "24px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ fontSize: "24px" }}>🧠</span>
          <h1 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #818cf8, #a78bfa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}>
            Idea Bouncer
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", letterSpacing: "0.3px" }}>
          Plan projects and automations — never miss a beat
        </p>
      </div>

      {/* Phase tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(129, 140, 248, 0.1)",
        background: "#0d1325",
      }}>
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setPhase(i)}
            style={{
              flex: 1,
              padding: "14px 8px",
              background: i === phase ? "rgba(129, 140, 248, 0.1)" : "transparent",
              border: "none",
              borderBottom: i === phase ? "2px solid #818cf8" : "2px solid transparent",
              color: i === phase ? "#c7d2fe" : "#64748b",
              fontFamily: "inherit",
              fontSize: "12px",
              fontWeight: i === phase ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.5px",
            }}
          >
            <span style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>{p.icon}</span>
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setShowExport(true)}
          style={{
            flex: 1,
            padding: "14px 8px",
            background: showExport ? "rgba(74, 222, 128, 0.1)" : "transparent",
            border: "none",
            borderBottom: showExport ? "2px solid #4ade80" : "2px solid transparent",
            color: showExport ? "#bbf7d0" : "#64748b",
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: showExport ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.5px",
          }}
        >
          <span style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>📄</span>
          Export
        </button>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "680px", margin: "0 auto" }}>
        {!showExport ? (
          <>
            {/* Progress */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "#64748b",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}>
                <span>Phase {phase + 1} of {PHASES.length}: {current.label}</span>
                <span>{filled}/{total} answered</span>
              </div>
              <div style={{
                height: "3px",
                background: "#1e293b",
                borderRadius: "2px",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #818cf8, #a78bfa)",
                  borderRadius: "2px",
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {current.questions.map((q) => (
                <div key={q.key}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#c7d2fe",
                    marginBottom: "8px",
                    letterSpacing: "0.2px",
                  }}>
                    {q.label}
                  </label>
                  {q.type === "select" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => update(q.key, opt)}
                          style={{
                            padding: "10px 14px",
                            background: answers[q.key] === opt
                              ? "rgba(129, 140, 248, 0.15)"
                              : "rgba(15, 23, 42, 0.8)",
                            border: answers[q.key] === opt
                              ? "1px solid rgba(129, 140, 248, 0.4)"
                              : "1px solid rgba(51, 65, 85, 0.5)",
                            borderRadius: "6px",
                            color: answers[q.key] === opt ? "#e0e7ff" : "#94a3b8",
                            fontFamily: "inherit",
                            fontSize: "13px",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {answers[q.key] === opt && <span style={{ marginRight: "8px" }}>◆</span>}
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.type === "textarea" ? (
                    <textarea
                      value={answers[q.key] || ""}
                      onChange={(e) => update(q.key, e.target.value)}
                      placeholder={q.placeholder}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid rgba(51, 65, 85, 0.5)",
                        borderRadius: "6px",
                        color: "#e2e8f0",
                        fontFamily: "inherit",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        resize: "vertical",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "rgba(129, 140, 248, 0.5)"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(51, 65, 85, 0.5)"}
                    />
                  ) : (
                    <input
                      type="text"
                      value={answers[q.key] || ""}
                      onChange={(e) => update(q.key, e.target.value)}
                      placeholder={q.placeholder}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid rgba(51, 65, 85, 0.5)",
                        borderRadius: "6px",
                        color: "#e2e8f0",
                        fontFamily: "inherit",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "rgba(129, 140, 248, 0.5)"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(51, 65, 85, 0.5)"}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Layer suggestions */}
            {phase === 1 && suggestedActions && (
              <div style={{
                marginTop: "28px",
                padding: "16px 20px",
                background: "rgba(129, 140, 248, 0.05)",
                border: "1px solid rgba(129, 140, 248, 0.15)",
                borderRadius: "8px",
              }}>
                <div style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#818cf8",
                  marginBottom: "12px",
                  fontWeight: 600,
                }}>
                  Suggested 5 Layer Actions
                </div>
                {suggestedActions.map((a, i) => (
                  <div key={i} style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    padding: "6px 0",
                    borderBottom: i < suggestedActions.length - 1 ? "1px solid rgba(51, 65, 85, 0.3)" : "none",
                    lineHeight: 1.5,
                  }}>
                    {a}
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(51, 65, 85, 0.3)",
            }}>
              <button
                onClick={() => { setPhase(Math.max(0, phase - 1)); setShowExport(false); }}
                disabled={phase === 0}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid rgba(51, 65, 85, 0.5)",
                  borderRadius: "6px",
                  color: phase === 0 ? "#334155" : "#94a3b8",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  cursor: phase === 0 ? "default" : "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (phase < PHASES.length - 1) {
                    setPhase(phase + 1);
                  } else {
                    setShowExport(true);
                  }
                }}
                style={{
                  padding: "10px 24px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.3px",
                }}
              >
                {phase < PHASES.length - 1 ? "Next →" : "Export Brief →"}
              </button>
            </div>
          </>
        ) : (
          /* Export view */
          <div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}>
              <h2 style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                color: "#c7d2fe",
              }}>
                Your Project Brief
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setShowExport(false)}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    border: "1px solid rgba(51, 65, 85, 0.5)",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  ← Edit
                </button>
                <button
                  onClick={copyBrief}
                  style={{
                    padding: "8px 16px",
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedBrief ? "✓ Copied!" : "Copy to Clipboard"}
                </button>
              </div>
            </div>

            <pre style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderRadius: "8px",
              padding: "20px",
              fontSize: "12px",
              lineHeight: 1.7,
              color: "#cbd5e1",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: "500px",
              overflow: "auto",
              fontFamily: "inherit",
            }}>
              {generateBrief()}
            </pre>

            <div style={{
              marginTop: "20px",
              padding: "16px 20px",
              background: "rgba(74, 222, 128, 0.05)",
              border: "1px solid rgba(74, 222, 128, 0.15)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#86efac",
              lineHeight: 1.6,
            }}>
              <strong>Next steps:</strong> Copy this brief and paste it into a new chat with Claude. Say: "Here's my project brief. Help me turn this into a full PRD following the format in my prds/ folder." Then save the PRD to your VS Code project as <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "3px" }}>prds/prd_[name].md</code>
            </div>

            {/* CHANGE 2: Ready-to-paste prompt section — same green format as above */}
            <div style={{
              marginTop: "20px",
              padding: "16px 20px",
              background: "rgba(74, 222, 128, 0.05)",
              border: "1px solid rgba(74, 222, 128, 0.15)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#86efac",
              lineHeight: 1.6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <strong>Ready-to-paste prompt for Claude Code:</strong>
                <button
                  onClick={() => handleCopy(generatePrompt(), setCopiedPrompt)}
                  style={{
                    padding: "6px 14px",
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedPrompt ? "✓ Copied!" : "Copy Prompt"}
                </button>
              </div>
              <pre style={{
                background: "rgba(0, 0, 0, 0.25)",
                border: "1px solid rgba(74, 222, 128, 0.1)",
                borderRadius: "6px",
                padding: "14px",
                fontSize: "11px",
                lineHeight: 1.65,
                color: "#86efac",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "300px",
                overflow: "auto",
                fontFamily: "inherit",
                margin: 0,
              }}>
                {generatePrompt()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
