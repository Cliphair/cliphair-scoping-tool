export const stepsData = [
    {
        id: "problem",
        title: "What's the Problem?",
        description: "Start with pain. Everything else flows from here.",
        questions: [
            {
                id: "problem_statement", label: "What's the problem you're trying to solve?",
                hint: "1-2 sentences in plain English. No jargon needed.", type: "textarea", required: true,
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
                type: "multi-select", required: true,
                options: [
                    "Customer Service team", "Google Ads", "Paid Social", "Organic Social", "Influencer", "Warehouse / Fulfilment team",
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
                id: "who_affected_other", label: "Anyone else not listed above?", type: "text", required: true,
                showIf: (a) => Array.isArray(a.who_affected) && a.who_affected.includes("Other")
            },
            {
                id: "frequency", label: "How often does this come up?",
                type: "select", required: true,
                options: [
                    "Multiple times a day", "Daily", "Weekly", "Monthly",
                    "Per order / transaction", "Seasonal (e.g. peak periods, launches)", "Other"
                ],
                help: {
                    why: "Frequency tells us how much pain this causes. Something that happens 50 times a day is more urgent than something monthly.",
                    examples: [
                        '"Multiple times a day" — CS answering the same product question with every enquiry.',
                        '"Weekly" — Manually compiling a trade sales report every Monday.',
                        '"Seasonal" — Bridal season creates a spike in colour match requests every spring.'
                    ]
                }
            },
            {
                id: "frequency_other", label: "Tell us more:", type: "text",
                showIf: (a) => a.frequency === "Other"
            },
            {
                id: "tried_before", label: "Has anyone tried to solve this before?",
                type: "select", options: ["Yes", "No"], required: true,
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
                hint: "What worked, what didn't, and why it was abandoned", type: "textarea", required: true,
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
                hint: "Describe the process as if showing a new starter what to do.", type: "textarea", required: true,
                help: {
                    why: "Understanding the current process — even if it's messy — helps us work out what to automate and what needs human judgement.",
                    examples: [
                        "1. Customer emails asking for a colour match. 2. CS opens the email and looks at the attached photo. 3. CS compares it against the swatch chart on screen. 4. CS types a recommendation and sends it back. Takes about 10 mins each time.",
                        "1. A colleague downloads the Shopify orders CSV. 2. Filters it by trade customers. 3. Copies the data into a separate spreadsheet. 4. Manually adds margin calculations. 5. Emails it to the trade manager."
                    ],
                    tip: "Numbered steps work best. Don't worry about being too detailed — more is better here."
                }
            },
            {
                id: "time_spent",
                label: (a) => {
                    const f = a.frequency;
                    if (f === "Multiple times a day" || f === "Daily") return "How much time does this take per day?";
                    if (f === "Per order / transaction") return "How much time does this take per order / transaction?";
                    if (f === "Monthly") return "How much time does this take per month?";
                    if (f === "Seasonal (e.g. peak periods, launches)") return "How much time does this take per season / peak period?";
                    return "How much time does this take per week?";
                },
                hint: "Your best guess is fine. Pick the closest size.", type: "select", required: true,
                options: (a) => {
                    const f = a.frequency;
                    if (f === "Multiple times a day" || f === "Daily") return [
                        "XS — About 5 minutes",
                        "S — About 15 to 30 minutes",
                        "M — 30 minutes to 1 hour",
                        "L — 1 to 3 hours",
                        "XL — 3 to 5 hours",
                        "XXL — More than 5 hours",
                        "Not sure"
                    ];
                    if (f === "Per order / transaction") return [
                        "XS — Under 2 minutes",
                        "S — 2 to 5 minutes",
                        "M — 5 to 15 minutes",
                        "L — 15 to 30 minutes",
                        "XL — 30 to 60 minutes",
                        "XXL — More than an hour",
                        "Not sure"
                    ];
                    if (f === "Monthly") return [
                        "XS — Under 30 minutes",
                        "S — 30 minutes to 2 hours",
                        "M — 2 to 5 hours",
                        "L — 5 to 10 hours",
                        "XL — 10 hours to 2 days",
                        "XXL — More than 2 days",
                        "Not sure"
                    ];
                    if (f === "Seasonal (e.g. peak periods, launches)") return [
                        "XS — A few hours total",
                        "S — About half a day",
                        "M — 1 to 2 days",
                        "L — 3 to 5 days",
                        "XL — More than a week",
                        "XXL — Weeks of effort",
                        "Not sure"
                    ];
                    return [
                        "XS — About 15 minutes",
                        "S — About 30 minutes to 1 hour",
                        "M — 1 to 3 hours",
                        "L — 3 to 5 hours",
                        "XL — 5 hours to a full day",
                        "XXL — More than a full day",
                        "Not sure"
                    ];
                },
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
                hint: "Tick all that apply", type: "multi-select", required: true,
                options: [
                    "Shopify", "Klaviyo", "Attentive", "ClickUp", "Gorgias", "Klear", "Triple Whale", "Google Ads", "Google Analytics", "Intelligems", "Meta", "TikTok", "Instagram", "WhatsApp", "n8n", "Google Sheets",
                    "Google Docs", "Google Drive", "Email (Gmail / Outlook)", "Micrsoft Office (Word / Excel)",
                    "Cliphair website (front-end)", "Phone / manual process", "Yotpo", "Dropbox", "Other"
                ],
                help: {
                    why: "Knowing which systems are involved tells us what needs to connect to what — and whether we already have the building blocks.",
                    tip: 'If you\'re not sure what tool something lives in, just describe where you go to do the task. "I open a spreadsheet shared by someone else" is perfectly fine.'
                }
            },
            {
                id: "tools_other", label: "Any other tools not listed?", type: "text", required: true,
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
                hint: "What changes? What gets easier? Be specific if you can.", type: "textarea", required: true,
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
                hint: "If it only did one thing, what would it be?", type: "textarea", required: true,
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
                type: "textarea", required: true,
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
                hint: "Tick all that apply", type: "multi-select", required: true,
                options: [
                    "Customer Service team", "Google Ads", "Paid Social", "Organic Social", "Influencer", "Warehouse / Fulfilment team",
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
                hint: "Separate names or groups with commas", type: "text", required: true,
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
                hint: "Click the quadrant that best describes this project.", type: "matrix", required: true,
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
                id: "deadline", label: "When does this need to be done by?", type: "select", required: true,
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
                id: "approver", label: "Who needs to sign off on this?", type: "select", required: true,
                options: ["Manager", "Director", "Both (Manager recommends, Director approves)"],
                help: { why: "So we know who to loop in for approval and who has final say." }
            },
            {
                id: "anyone_else", label: "Anyone else who should be involved or kept in the loop?",
                hint: "Separate names or groups with commas", type: "textarea",
                help: {
                    why: "Other people often have context that changes the approach. Better to know now than find out halfway through.",
                    examples: [
                        "A colleague in marketing — manages the brand guidelines.",
                        "The trade team lead — they'll be the main users.",
                        "Nobody else, just me and my manager."
                    ]
                }
            }
        ]
    }
];
