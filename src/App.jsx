import { useState, useRef } from 'react';
import './App.css';
import logoRangedCream from './assets/new branding/ranged---cream.png';
import logoRangedDark from './assets/new branding/ranged---dark-gray.png';
import marquePanelCream from './assets/new branding/marque-panel---cream.png';
import sealCream from './assets/new branding/seal---cream.png';
import sealCharcoal from './assets/new branding/seal---dark-gray.png';
import motifCoral from './assets/new branding/motif-7---coral.png';
import speechmarksTopCharcoal from './assets/new branding/speechmarks-top---dark-gray.png';
import speechmarksBottomCharcoal from './assets/new branding/speechmarks-bottom---dark-gray.png';
import brandPattern from './assets/new branding/_Cliphair_Pattern_Off_White_RGB.svg';

/* ─────────────────────────────────────────────
   QUESTION DEFINITIONS — PRD-aligned steps
   ───────────────────────────────────────────── */

const stepsData = [
    {
        id: "problem",
        title: "What's the Problem?",
        description: "Start with pain. Everything else flows from here.",
        questions: [
            {
                id: "problem_statement", label: "What's the problem you're trying to solve?",
                hint: "1-2 sentences in plain English. No jargon needed.", type: "textarea",
                help: {
                    why: "A clear problem statement helps us understand what to fix, not just what to build.",
                    examples: [
                        "We manually check every order for colour mismatches before dispatch, and it takes ages.",
                        "Customers keep emailing asking which extensions suit their hair type, and we answer the same questions over and over.",
                        "Our trade team has no way to see which salons haven't reordered in 3 months."
                    ],
                    tip: 'Try finishing this sentence: "The problem is that..."'
                }
            },
            {
                id: "who_affected", label: "Who does this affect?",
                hint: "Tick all that apply, and add anyone else in the text box",
                type: "multi-select",
                options: [
                    "Customer Service team", "Marketing team", "Warehouse / Fulfilment team",
                    "Trade / B2B team", "Web / Tech team", "Management",
                    "Retail customers (B2C)", "Trade customers (B2B / salons)", "Other"
                ],
                help: {
                    why: "Knowing who's affected helps us understand the scale and who to involve.",
                    examples: [
                        "Customer Service + Retail customers — CS spend half their day answering colour match queries that customers could self-serve.",
                        "Warehouse team — Packers are printing labels manually instead of pulling from Shopify.",
                        "Trade team + Trade customers — Salons can't see their order history or reorder easily."
                    ]
                }
            },
            {
                id: "who_affected_other", label: "Anyone else not listed above?", type: "text",
                showIf: (a) => Array.isArray(a.who_affected) && a.who_affected.includes("Other")
            },
            {
                id: "frequency", label: "How often does this come up?",
                hint: "Select all that apply", type: "multi-select",
                options: [
                    "Multiple times a day", "Daily", "Weekly", "Monthly",
                    "Per order / transaction", "Seasonal (e.g. peak periods, launches)", "Other"
                ],
                help: {
                    why: "Frequency tells us how much pain this causes. Something that happens 50 times a day is more urgent than something monthly.",
                    examples: [
                        '"Multiple times a day" + "Per order" — CS answering the same product question with every enquiry.',
                        '"Weekly" — Manually compiling a trade sales report every Monday.',
                        '"Seasonal" — Bridal season creates a spike in colour match requests every spring.'
                    ]
                }
            },
            {
                id: "frequency_other", label: "Tell us more:", type: "text",
                showIf: (a) => Array.isArray(a.frequency) && a.frequency.includes("Other")
            },
            {
                id: "tried_before", label: "Has anyone tried to solve this before?",
                type: "select", options: ["Yes", "No"],
                help: {
                    why: "Knowing what's been tried stops us repeating the same mistakes.",
                    examples: [
                        "Yes — we built a Google Sheet to track it but nobody kept it updated.",
                        "Yes — we tried a Shopify app but it couldn't handle our colour range.",
                        "No — we've just always done it manually."
                    ]
                }
            },
            {
                id: "tried_before_detail", label: "What was tried and what happened?",
                hint: "What worked, what didn't, and why it was abandoned", type: "textarea",
                showIf: (a) => a.tried_before === "Yes"
            }
        ]
    },
    {
        id: "today",
        title: "What Happens Today?",
        description: "Ground it in reality before jumping to solutions.",
        questions: [
            {
                id: "current_process", label: "Walk us through what happens today, step by step.",
                hint: "Describe the process as if showing a new starter what to do.", type: "textarea",
                help: {
                    why: "Understanding the current process — even if it's messy — helps us work out what to automate and what needs human judgement.",
                    examples: [
                        "1. Customer emails asking for a colour match. 2. CS opens the email and looks at the attached photo. 3. CS compares it against the swatch chart on screen. 4. CS types a recommendation and sends it back. Takes about 10 mins each time.",
                        "1. Abbey downloads the Shopify orders CSV. 2. Filters it by trade customers. 3. Copies the data into a separate spreadsheet. 4. Manually adds margin calculations. 5. Emails it to the trade manager."
                    ],
                    tip: "Numbered steps work best. Don't worry about being too detailed — more is better here."
                }
            },
            {
                id: "time_spent", label: "How much time does this take per week?",
                hint: "Your best guess is fine. Pick the closest size.", type: "select",
                options: [
                    "XS — About 15 minutes",
                    "S — About 30 minutes to 1 hour",
                    "M — 1 to 3 hours",
                    "L — 3 to 5 hours",
                    "XL — 5 hours to a full day",
                    "XXL — More than a full day",
                    "Not sure"
                ],
                help: {
                    why: "This is our single best signal for prioritisation. A task eating 5+ hours a week is a much stronger case than one taking 15 minutes.",
                    examples: [
                        "XS — Copying a tracking number into ClickUp once a day.",
                        "M — Answering colour match emails, about 15-20 per week at 10 mins each.",
                        "XL — Compiling the weekly trade report from scratch every Monday."
                    ],
                    tip: "If multiple people do this task, estimate the combined total across everyone."
                }
            },
            {
                id: "tools_used", label: "Which tools or systems are involved?",
                hint: "Tick all that apply", type: "multi-select",
                options: [
                    "Shopify", "Klaviyo", "ClickUp", "n8n", "Google Sheets",
                    "Google Docs", "Google Drive", "Email (Gmail / Outlook)",
                    "Cliphair website (front-end)", "Phone / manual process", "Other"
                ],
                help: {
                    why: "Knowing which systems are involved tells us what needs to connect to what — and whether we already have the building blocks.",
                    tip: 'If you\'re not sure what tool something lives in, just describe where you go to do the task. "I open a spreadsheet Abbey shared" is perfectly fine.'
                }
            },
            {
                id: "tools_other", label: "Any other tools not listed?", type: "text",
                showIf: (a) => Array.isArray(a.tools_used) && a.tools_used.includes("Other")
            },
            {
                id: "show_us_links", label: "Can you show us? Paste links to screenshots, videos, or docs.",
                hint: "A 30-second Loom video is worth a thousand words. Press 'Add another link' to add more.",
                type: "repeatable-text",
                help: {
                    why: "Seeing the actual screen, spreadsheet, or email thread helps us understand faster than any written description.",
                    examples: [
                        "A screenshot of the spreadsheet you manually update",
                        "A Loom recording of you walking through the process",
                        "A link to the Google Sheet or ClickUp board involved"
                    ],
                    tip: "You can use free tools like Loom (loom.com) or your phone's screen recording to capture a quick walkthrough."
                }
            }
        ]
    },
    {
        id: "fixed",
        title: "What Would \"Fixed\" Look Like?",
        description: "Describe the dream state. We'll figure out what's realistic for v1.",
        questions: [
            {
                id: "desired_outcome", label: "What does the ideal end result look like?",
                hint: "What changes? What gets easier? Be specific if you can.", type: "textarea",
                help: {
                    why: "This helps us understand your vision so we can build towards it — even if v1 only gets partway there.",
                    examples: [
                        "Colour match recommendations happen automatically based on the customer's uploaded photo, and CS only steps in for tricky cases.",
                        "Trade order reports generate themselves every Monday morning and land in the trade manager's inbox.",
                        "Customers can check which extension type suits them without needing to contact us."
                    ],
                    tip: "Describe the dream state. We'll figure out what's realistic for v1."
                }
            },
            {
                id: "must_do", label: "What's the single most important thing this must do?",
                hint: "If it only did one thing, what would it be?", type: "textarea",
                help: {
                    why: "This keeps us focused. Feature lists grow quickly — this anchors us to what actually matters.",
                    examples: [
                        "It must correctly recommend the right colour at least 90% of the time.",
                        "It must pull live order data from Shopify — not a stale export.",
                        "It must notify the trade team when a salon hasn't ordered in 90 days."
                    ]
                }
            },
            {
                id: "human_touchpoints", label: "Where does a human still need to be involved?",
                hint: "AI and automation can handle a lot, but some steps might need a person's judgement. Think about where that line is.",
                type: "textarea",
                help: {
                    why: "Most projects don't fully replace humans — they handle the repetitive parts so your team can focus on the bits that need real judgement.",
                    examples: [
                        "The system can suggest a colour match, but a human should review anything where the customer's photo is poor quality.",
                        "Auto-generate the report, but a manager needs to check the numbers before it goes to the client.",
                        "The chatbot can answer product questions, but anything about refunds or complaints should go to a real person.",
                        "Honestly not sure — maybe it can all be automated?"
                    ],
                    tip: "It's fine to say \"I'm not sure.\" We can work this out together during scoping."
                }
            },
            {
                id: "who_benefits", label: "Who benefits from this being fixed?",
                hint: "Tick all that apply", type: "multi-select",
                options: [
                    "Customer Service team", "Marketing team", "Warehouse / Fulfilment team",
                    "Trade / B2B team", "Web / Tech team", "Management",
                    "Retail customers (B2C)", "Trade customers (B2B / salons)",
                    "The business overall (revenue, efficiency)", "Other"
                ],
                help: {
                    why: "Understanding who gains helps us measure success and get the right people behind the project.",
                    examples: [
                        "Customer Service team + Retail customers — CS gets time back, customers get faster answers.",
                        "The business overall — Less manual work means we can handle more orders without hiring."
                    ]
                }
            },
            {
                id: "who_benefits_other", label: "Anyone else?",
                hint: "Separate names or groups with commas", type: "text",
                showIf: (a) => Array.isArray(a.who_benefits) && a.who_benefits.includes("Other")
            }
        ]
    },
    {
        id: "importance",
        title: "How Important Is This?",
        description: "Not everything that feels urgent is actually important. Let's place it honestly.",
        questions: [
            {
                id: "priority", label: "Where does this sit?",
                hint: "Click the quadrant that best describes this project.", type: "matrix",
                help: {
                    why: "Not everything that feels urgent is actually important, and some important things don't feel urgent. This helps us prioritise honestly.",
                    examples: [
                        '"Do Now" — We\'re manually processing 200 trade orders a week and making errors that cost us returns.',
                        '"Do Next" — We want a customer self-service tool for colour matching, but current CS process works, just slowly.',
                        '"Quick Win" — Auto-tagging ClickUp tasks from Shopify orders would save 20 mins a day.',
                        '"Park It" — It\'d be cool to have a dashboard showing extension trends by region.'
                    ]
                }
            },
            {
                id: "deadline", label: "When does this need to be done by?", type: "select",
                options: [
                    "As soon as possible", "Within 1 month", "1-3 months",
                    "3-6 months", "No hard deadline", "Other"
                ],
                help: {
                    why: "Deadlines help us plan realistically. If there's a hard date (e.g. a product launch or peak season), we need to know early.",
                    examples: [
                        '"Within 1 month" — Bridal season starts in May and we need the colour match tool ready.',
                        '"1-3 months" — We want this before the next trade show in September.',
                        '"No hard deadline" — Whenever it can be done properly.'
                    ]
                }
            },
            {
                id: "deadline_other", label: "Tell us more:",
                hint: "What's the date and why?", type: "text",
                showIf: (a) => a.deadline === "Other"
            },
            {
                id: "approver", label: "Who needs to sign off on this?", type: "select",
                options: ["Manager", "Director", "Both (Manager recommends, Director approves)"],
                help: { why: "So we know who to loop in for approval and who has final say." }
            },
            {
                id: "anyone_else", label: "Anyone else who should be involved or kept in the loop?",
                hint: "Names or roles", type: "textarea",
                help: {
                    why: "Other people often have context that changes the approach. Better to know now than find out halfway through.",
                    examples: [
                        "Abbey in marketing — she manages the brand guidelines.",
                        "The trade team lead — they'll be the main users.",
                        "Nobody else, just me and my manager."
                    ]
                }
            }
        ]
    }
];

const typeSpecificQuestions = {
    automation: {
        label: "Automation",
        icon: "⚙️",
        tagline: "Replacing repetitive manual tasks with automated workflows",
        questions: [
            {
                id: "auto_trigger", label: "What kicks this off?", type: "select",
                options: [
                    "Something happens (new order, form submitted, email received)",
                    "A schedule (daily, weekly, monthly)",
                    "Someone clicks a button or makes a request",
                    "Other"
                ],
                help: {
                    examples: [
                        "Every time a new Shopify order comes in with a trade customer tag.",
                        "Every Monday at 7am, before the team arrives.",
                        "When someone clicks 'Generate Report' in ClickUp."
                    ]
                }
            },
            { id: "auto_trigger_detail", label: "Tell us more about the trigger:", type: "textarea" },
            {
                id: "auto_steps", label: "What should happen automatically, in order?",
                hint: "Step 1 does X, then step 2 does Y, etc.", type: "textarea",
                help: {
                    why: "This is the recipe. The more detail you give, the more accurately we can build it.",
                    examples: [
                        "1. Pull all new orders from Shopify tagged 'trade'. 2. Match each order to the salon's account in our trade spreadsheet. 3. Calculate the margin for each product. 4. Add a row to the weekly trade report. 5. If any order is over £500, send a Slack message to the trade manager."
                    ]
                }
            },
            {
                id: "auto_output", label: "What's the end result?",
                hint: "An email sent, a spreadsheet updated, a notification, a record created, etc.", type: "textarea",
                help: {
                    examples: [
                        "An updated Google Sheet with this week's trade orders and margins.",
                        "An automatic email to the customer with their colour match recommendation.",
                        "A ClickUp task created for the warehouse team with packing instructions."
                    ]
                }
            },
            {
                id: "auto_failure", label: "What should happen if something goes wrong?",
                hint: "Who gets told? Should it retry? Should it stop?", type: "textarea",
                help: {
                    why: "Things will go wrong eventually — a system goes down, data is missing, an API changes. Deciding this now means failures get caught instead of silently breaking.",
                    examples: [
                        "Email me if it fails. Don't retry — I'll check manually.",
                        "Post a message in the #errors Slack channel and retry once after 5 minutes.",
                        "Not sure — what would you recommend?"
                    ]
                }
            },
            {
                id: "auto_sensitive", label: "Does this involve sensitive data?", type: "select",
                options: [
                    "Yes — customer data (names, emails, addresses)",
                    "Yes — payment or financial data",
                    "Yes — login credentials or passwords",
                    "Yes — multiple types of sensitive data",
                    "No sensitive data",
                    "Not sure"
                ],
                help: { why: "Sensitive data needs extra security measures. If it touches customer details, payment info, or credentials, we need to handle it carefully." }
            }
        ]
    },
    agent: {
        label: "Agent / AI Assistant",
        icon: "🤖",
        tagline: "An AI that answers questions, handles requests, or guides users",
        questions: [
            {
                id: "agent_job", label: "What's this agent's core job?",
                hint: "Answer customer questions, triage support tickets, recommend products, etc.", type: "textarea",
                help: {
                    why: "An agent that tries to do everything does nothing well. What's the one thing it must be great at?",
                    examples: [
                        "Help customers find the right extension type and colour for their hair.",
                        "Answer trade customer questions about bulk pricing and stock availability.",
                        "Triage incoming customer service emails and draft suggested responses for the team to review."
                    ]
                }
            },
            {
                id: "agent_knowledge", label: "What information does it need access to?",
                hint: "Product guides, FAQs, order data, policies, etc.", type: "textarea",
                help: {
                    why: "An agent is only as good as the information it can draw from. The more specific you are, the better it'll perform.",
                    examples: [
                        "Our product guide, colour chart, hair type suitability charts, and care instructions.",
                        "The Cliphair FAQ page, returns policy, and shipping information.",
                        "Live Shopify order data so it can look up order status."
                    ]
                }
            },
            {
                id: "agent_channel", label: "Where will people use it?", type: "select",
                options: [
                    "Website chat widget", "Slack", "Email",
                    "Inside another tool (ClickUp, Shopify, etc.)",
                    "Multiple places", "Other"
                ],
                help: {
                    examples: [
                        '"Website chat widget" — for customer-facing product advice.',
                        '"Slack" — for internal team questions about processes or policies.',
                        '"Email" — to draft responses to incoming customer emails.'
                    ]
                }
            },
            {
                id: "agent_boundaries", label: "What should it never do or say?",
                hint: "Topics to avoid, actions it shouldn't take, limits on its authority", type: "textarea",
                help: {
                    why: "Guardrails prevent the agent from going off-script. Think about what could go wrong if it answered incorrectly.",
                    examples: [
                        "Never recommend self-application of permanent extensions — always direct to a professional.",
                        "Don't give specific refund amounts — direct to CS.",
                        "Never badmouth competitor brands.",
                        "Don't make claims about hair lasting longer than our stated lifespans."
                    ]
                }
            },
            {
                id: "agent_escalation", label: "When should it hand off to a real person?",
                hint: "What triggers the handoff, and who does it go to?", type: "textarea",
                help: {
                    why: "Even the best AI needs to know when to step aside. Clear escalation rules prevent frustrated customers.",
                    examples: [
                        "If the customer asks about a refund or complaint, hand off to CS immediately.",
                        "If it's not confident in the colour match, escalate to a human with the photo attached.",
                        "If the customer asks the same question three times, assume it's not helping and offer a human."
                    ]
                }
            }
        ]
    },
    app: {
        label: "App / Dashboard",
        icon: "🖥️",
        tagline: "A custom tool with a screen people interact with",
        questions: [
            {
                id: "app_who", label: "Who is this for?", type: "select",
                options: [
                    "Internal team only", "Customers (public-facing)",
                    "Trade customers (salons / professionals)",
                    "Both internal and external"
                ],
                help: { why: "Internal tools can be rougher and simpler. Customer-facing tools need to look polished and follow brand guidelines." }
            },
            {
                id: "app_screens", label: "Describe the key screens or pages — even roughly.",
                hint: "What does someone see and do on each screen?", type: "textarea",
                help: {
                    why: "Even a rough description helps us estimate the size of the build and start thinking about layout.",
                    examples: [
                        "A dashboard showing this week's trade orders, with filters by salon and product type. A detail page for each order. An export button.",
                        "A page where the customer uploads a photo, a results page showing recommended colours, and an 'add to basket' link for each one.",
                        "A simple internal form where CS can log a complaint, with a list view of all open complaints."
                    ],
                    tip: "Bullet points are fine. You don't need wireframes at this stage."
                }
            },
            {
                id: "app_login", label: "Do people need to log in?", type: "select",
                options: [
                    "Yes — different users see different things",
                    "Yes — but everyone sees the same content",
                    "No — open access",
                    "Not sure"
                ],
                help: {
                    examples: [
                        '"Yes, different views" — trade customers see their own orders only.',
                        '"Yes, same content" — internal team all see the same dashboard but need a login for security.',
                        '"No" — a public tool on the website anyone can use.'
                    ]
                }
            },
            {
                id: "app_mobile", label: "Does it need to work on mobile?", type: "select",
                options: [
                    "Yes — mobile first",
                    "Yes — should work on both mobile and desktop",
                    "Desktop only",
                    "Not sure"
                ],
                help: { tip: "If customers or trade clients will use this, it probably needs to work on mobile. Internal tools used at a desk can often be desktop only." }
            },
            {
                id: "app_reference", label: "Is there an existing tool or website that looks roughly like what you're after?",
                hint: "A link, a screenshot, or just describe it", type: "textarea",
                help: {
                    why: '"Something like this, but for our trade team" saves hours of explanation.',
                    examples: [
                        "Like the Shopify orders page, but filtered to show only trade customers with margin data.",
                        "Something like Notion's table view where we can filter and sort.",
                        "I've seen a tool called [X] that does something similar — here's the link."
                    ]
                }
            }
        ]
    }
};

/* Guided "Not Sure" flow */
const notSureQuestions = [
    {
        id: "guide_nature",
        label: "Which of these best describes what you need?",
        options: [
            { value: "replace_steps", label: "Replace manual steps that follow the same pattern every time", maps: "automation" },
            { value: "answer_questions", label: "Something that can answer questions or have conversations", maps: "agent" },
            { value: "screen_tool", label: "A screen or dashboard where people can look things up, enter data, or manage something", maps: "app" },
            { value: "still_unsure", label: "I'm still not sure", maps: null }
        ]
    },
    {
        id: "guide_interaction",
        label: "How do people interact with this today?",
        options: [
            { value: "no_interaction", label: "Nobody interacts with it — it just needs to happen in the background", maps: "automation" },
            { value: "ask_and_answer", label: "Someone asks a question and gets an answer back", maps: "agent" },
            { value: "click_and_browse", label: "Someone opens a screen, clicks around, looks at data, or fills in fields", maps: "app" },
            { value: "mix", label: "It's a mix of these", maps: null }
        ]
    },
    {
        id: "guide_trigger",
        label: "What kicks this off?",
        options: [
            { value: "event", label: "Something happens automatically (a new order, a form submission, a timer)", maps: "automation" },
            { value: "person_asks", label: "A person asks a question or makes a request", maps: "agent" },
            { value: "person_opens", label: "A person opens a tool or screen to do something", maps: "app" },
            { value: "all_of_above", label: "All of the above, honestly", maps: "combination" }
        ]
    }
];

const notSureRecommendations = {
    automation: "This sounds like a repeatable process that can run on its own once set up.",
    agent: "This sounds like it needs an AI that can understand questions and give relevant answers.",
    app: "This sounds like you need a dedicated tool with a visual interface.",
    combination: "This sounds like it might need more than one piece — for example, an automation that feeds data into a dashboard, or an AI agent backed by an automated workflow."
};

/* Anything-else step (Step 7 in PRD) */
const anythingElseStep = {
    id: "anything_else_step",
    title: "Anything Else?",
    description: "Catch-all for context that doesn't fit elsewhere.",
    questions: [
        {
            id: "constraints", label: "Are there any constraints we should know about?",
            hint: "Budget limits, security requirements, things that can't change, legal or compliance needs",
            type: "textarea",
            help: {
                examples: [
                    "It must work within Shopify's API rate limits.",
                    "Customer data can't leave the EU.",
                    "We only have budget for a quick fix right now — a full build can wait.",
                    "None that I know of."
                ]
            }
        },
        {
            id: "brand_guidelines", label: "Does this need to follow Cliphair brand guidelines?",
            type: "select", options: ["Yes", "No", "Not sure"],
            help: { tip: 'If customers or trade clients will see it, the answer is probably "Yes." Internal-only tools usually don\'t need full brand styling.' }
        },
        {
            id: "anything_else", label: "Anything else that would help us understand this?",
            hint: "Background context, things you've tried, links to similar tools, gut feelings",
            type: "textarea",
            help: { tip: "There's no wrong answer here. If something feels relevant but you're not sure where it fits, put it here." }
        }
    ]
};

/* ─────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────── */

function ProgressBar({ currentStep, totalSteps, stepLabels }) {
    const percentage = Math.round((currentStep / (totalSteps - 1)) * 100);

    return (
        <div className="progress-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="progress-label">
                Step {currentStep + 1} of {totalSteps} — {stepLabels[currentStep]}
            </div>
        </div>
    );
}

/* ── Help Box ── */
function HelpBox({ help, isOpen, onToggle }) {
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
}

/* ── Question Field ── */
function QuestionField({ question, value, onChange, answers, openHelp, onToggleHelp }) {
    if (question.showIf && !question.showIf(answers)) return null;

    const inputId = `field-${question.id}`;

    /* Multi-select checkbox handler */
    const handleCheckbox = (opt) => {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt];
        onChange(question.id, next);
    };

    /* Repeatable text handler */
    const repeatableValues = Array.isArray(value) ? value : [""];
    const handleRepeatableChange = (idx, val) => {
        const next = [...repeatableValues];
        next[idx] = val;
        onChange(question.id, next);
    };
    const addRow = () => onChange(question.id, [...repeatableValues, ""]);
    const removeRow = (idx) => {
        const next = repeatableValues.filter((_, i) => i !== idx);
        onChange(question.id, next.length ? next : [""]);
    };

    return (
        <div className="question-field">
            <div className="label-row">
                <label htmlFor={inputId}>{question.label}</label>
                <HelpBox help={question.help} isOpen={openHelp === question.id} onToggle={() => onToggleHelp(question.id)} />
            </div>
            {question.hint && <span className="hint">{question.hint}</span>}

            {question.type === "text" && (
                <input id={inputId} type="text" value={value || ""} onChange={(e) => onChange(question.id, e.target.value)} autoComplete="off" />
            )}

            {question.type === "textarea" && (
                <textarea id={inputId} value={value || ""} onChange={(e) => onChange(question.id, e.target.value)} rows={4} />
            )}

            {question.type === "select" && (
                <select id={inputId} value={value || ""} onChange={(e) => onChange(question.id, e.target.value)}>
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
                                <button type="button" className="btn-remove-row" onClick={() => removeRow(idx)} aria-label="Remove">✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline btn-sm" onClick={addRow}>+ Add another link</button>
                </div>
            )}

            {question.type === "matrix" && (
                <PriorityMatrix value={value} onChange={(val) => onChange(question.id, val)} />
            )}
        </div>
    );
}

/* ── Priority Matrix ── */
function PriorityMatrix({ value, onChange }) {
    const quadrants = [
        { id: "Do Next", label: "Do Next", desc: "Important but not urgent — big impact, can be planned in", row: "top", col: "left" },
        { id: "Do Now", label: "Do Now", desc: "Important and urgent — losing money, customers, or significant time", row: "top", col: "right" },
        { id: "Park It", label: "Park It", desc: "Nice to have — worth recording but not a priority right now", row: "bottom", col: "left" },
        { id: "Quick Win", label: "Quick Win", desc: "Not critical, but urgent or easy — low effort, clear payoff", row: "bottom", col: "right" }
    ];

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
}

/* ── Welcome / Intro ── */
function StepIntro({ onNext }) {
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
}

/* ── Generic Step (Steps 1–4 & Step 7) ── */
function StepQuestions({ step, stepIndex, totalCoreSteps, answers, onAnswer, onNext, onBack, openHelp, onToggleHelp }) {
    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-number-row">
                    <img src={marquePanelCream} alt="" className="step-marque-icon" />
                    <span className="step-number">Step {stepIndex + 1} of {totalCoreSteps}</span>
                </div>
                <h2>{step.title}</h2>
                <p className="step-description">{step.description}</p>
            </div>
            <div className="questions-group">
                {step.questions.map((q) => (
                    <QuestionField
                        key={q.id}
                        question={q}
                        value={answers[q.id]}
                        onChange={onAnswer}
                        answers={answers}
                        openHelp={openHelp}
                        onToggleHelp={onToggleHelp}
                    />
                ))}
            </div>
            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-primary" onClick={onNext}>Continue →</button>
            </div>
        </div>
    );
}

/* ── Project Type Selection (Step 5) ── */
function StepProjectType({ selectedType, onSelect, onNext, onBack, answers, onAnswer, openHelp, onToggleHelp }) {
    const [notSureStep, setNotSureStep] = useState(0);
    const [recommendation, setRecommendation] = useState(null);
    const showingNotSure = selectedType === "not_sure";

    const handleTypeSelect = (key) => {
        onSelect(key);
        setNotSureStep(0);
        setRecommendation(null);
    };

    const handleNotSureAnswer = (option) => {
        onAnswer(`guide_${notSureQuestions[notSureStep].id}`, option.value);

        if (option.maps) {
            /* We have a recommendation */
            setRecommendation(option.maps);
        } else {
            /* Continue to next diagnostic question */
            if (notSureStep < notSureQuestions.length - 1) {
                setNotSureStep((prev) => prev + 1);
            }
        }
    };

    const confirmRecommendation = (type) => {
        onSelect(type);
        setRecommendation(null);
    };

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

            {/* Not-Sure guided flow */}
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

            {/* Recommendation */}
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
                                <button className="btn btn-secondary" onClick={() => { setRecommendation(null); setNotSureStep(0); handleTypeSelect("not_sure"); }}>No, let me pick manually</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-primary" onClick={onNext} disabled={!selectedType || selectedType === "not_sure"}>
                    Continue →
                </button>
            </div>
        </div>
    );
}

/* ── Type-Specific Questions (Step 6) ── */
function StepTypeSpecific({ projectType, answers, onAnswer, onNext, onBack, openHelp, onToggleHelp }) {
    const config = typeSpecificQuestions[projectType];

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
                        onChange={onAnswer}
                        answers={answers}
                        openHelp={openHelp}
                        onToggleHelp={onToggleHelp}
                    />
                ))}
            </div>
            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button className="btn btn-primary" onClick={onNext}>Continue →</button>
            </div>
        </div>
    );
}

/* ── Summary / Review (Step 8) ── */
function StepSummary({ answers, projectType, onBack, onReset }) {
    const briefRef = useRef(null);
    const typeConfig = typeSpecificQuestions[projectType];

    const formatValue = (val) => {
        if (Array.isArray(val)) return val.filter(Boolean).join(", ") || "—";
        return val || "—";
    };

    const generateMarkdown = () => {
        const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

        let md = `# Project Brief\n\n`;
        md += `**Generated:** ${now}\n`;
        md += `**Project Type:** ${typeConfig.icon} ${typeConfig.label}\n\n---\n\n`;

        stepsData.forEach((step) => {
            md += `## ${step.title}\n\n`;
            step.questions.forEach((q) => {
                if (q.showIf && !q.showIf(answers)) return;
                md += `**${q.label}**\n${formatValue(answers[q.id])}\n\n`;
            });
        });

        md += `---\n\n## ${typeConfig.icon} ${typeConfig.label} — Specific Details\n\n`;
        typeConfig.questions.forEach((q) => {
            if (q.showIf && !q.showIf(answers)) return;
            md += `**${q.label}**\n${formatValue(answers[q.id])}\n\n`;
        });

        md += `---\n\n## Anything Else\n\n`;
        anythingElseStep.questions.forEach((q) => {
            if (q.showIf && !q.showIf(answers)) return;
            md += `**${q.label}**\n${formatValue(answers[q.id])}\n\n`;
        });

        return md;
    };

    const handleCopy = () => {
        const md = generateMarkdown();
        navigator.clipboard.writeText(md).then(() => alert("Brief copied to clipboard as Markdown!"));
    };

    const handleDownload = () => {
        const md = generateMarkdown();
        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `project-brief-${projectType}-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const allSections = [
        ...stepsData.map((s) => ({ title: s.title, questions: s.questions })),
        { title: `${typeConfig.icon} ${typeConfig.label} — Specific Details`, questions: typeConfig.questions, isTypeSpecific: true },
        { title: anythingElseStep.title, questions: anythingElseStep.questions }
    ];

    return (
        <div className="step-content summary-step" ref={briefRef}>
            <div className="step-header">
                <h2>📄 Project Brief — Review</h2>
                <p className="step-description">
                    Review the compiled brief below. Copy or download it to hand off to the build team.
                </p>
            </div>

            <div className="summary-actions">
                <button className="btn btn-primary" onClick={handleCopy}>📋 Copy as Markdown</button>
                <button className="btn btn-secondary" onClick={handleDownload}>⬇ Download .md</button>
                <button className="btn btn-outline" onClick={onReset}>🔄 Start Over</button>
            </div>

            <div className="brief-output">
                <div className="brief-header-brand">
                    <img src={logoRangedDark} alt="Cliphair" className="brief-logo" />
                </div>
                <div className="brief-meta">
                    <span className="brief-type">{typeConfig.icon} {typeConfig.label}</span>
                    <span className="brief-date">
                        {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                </div>

                {allSections.map((section) => (
                    <div key={section.title} className={`brief-section ${section.isTypeSpecific ? "type-specific-section" : ""}`}>
                        <h3>{section.title}</h3>
                        {section.questions.map((q) => {
                            if (q.showIf && !q.showIf(answers)) return null;
                            const val = formatValue(answers[q.id]);
                            return (
                                <div key={q.id} className="brief-item">
                                    <dt>{q.label}</dt>
                                    <dd className={val === "—" ? "empty" : ""}>{val}</dd>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="brief-output-next">
                <h3>What Happens Next</h3>
                <ol>
                    <li>Brief lands with the build team</li>
                    <li>Builder reviews and books a short scoping call if needed</li>
                    <li>Builder produces a scope estimate and recommended approach</li>
                    <li>Approver signs off</li>
                    <li>Work begins</li>
                </ol>
            </div>

            <div className="step-nav">
                <button className="btn btn-secondary" onClick={onBack}>← Back to Edit</button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────── */

function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [projectType, setProjectType] = useState("");
    const [openHelp, setOpenHelp] = useState(null);

    /*
     * Steps:
     * 0 = Welcome
     * 1-4 = Core steps (Problem, Today, Fixed, Importance)
     * 5 = Project Type selection
     * 6 = Type-specific questions
     * 7 = Anything Else
     * 8 = Review & Export
     */
    const totalSteps = 9;
    const stepLabels = [
        "Welcome",
        ...stepsData.map((s) => s.title),
        "Project Type",
        "Type-Specific",
        "Anything Else",
        "Review Brief"
    ];

    const handleAnswer = (id, value) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    };

    const toggleHelp = (id) => {
        setOpenHelp((prev) => (prev === id ? null : id));
    };

    const goNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
        setOpenHelp(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        setOpenHelp(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReset = () => {
        if (confirm("This will clear all your answers. Are you sure?")) {
            setAnswers({});
            setProjectType("");
            setCurrentStep(0);
            setOpenHelp(null);
        }
    };

    const renderStep = () => {
        if (currentStep === 0) {
            return <StepIntro onNext={goNext} />;
        }

        /* Steps 1-4: Core question steps */
        if (currentStep >= 1 && currentStep <= 4) {
            const stepData = stepsData[currentStep - 1];
            return (
                <StepQuestions
                    step={stepData}
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

        /* Step 5: Project type */
        if (currentStep === 5) {
            return (
                <StepProjectType
                    selectedType={projectType}
                    onSelect={setProjectType}
                    onNext={goNext}
                    onBack={goBack}
                    answers={answers}
                    onAnswer={handleAnswer}
                    openHelp={openHelp}
                    onToggleHelp={toggleHelp}
                />
            );
        }

        /* Step 6: Type-specific */
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

        /* Step 7: Anything else */
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

        /* Step 8: Summary */
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
                    totalSteps={totalSteps}
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
