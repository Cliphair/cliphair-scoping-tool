export const typeSpecificQuestions = {
    automation: {
        label: "Automation",
        icon: "⚙️",
        tagline: "Replacing repetitive manual tasks with automated workflows",
        questions: [
            {
                id: "auto_trigger", label: "What kicks this off?",
                type: "select", required: true,
                test_data: "Something happens (new order, form submitted, email received)",
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
            {
                id: "auto_trigger_detail", label: "Tell us more about the trigger:", type: "textarea", required: true,
                test_data: "A new order is placed in Shopify containing two or more hair extension products with different colour codes.",
                help: {
                    why: "A trigger is the specific event or condition that starts the automation — the 'if this happens, do that' moment.",
                    examples: [
                        "A new order is placed in Shopify with a trade customer tag.",
                        "Every Monday at 7am, before the team arrives.",
                        "When someone clicks 'Generate Report' in ClickUp.",
                        "A form is submitted on the website."
                    ],
                    tip: "Be as specific as you can — 'a new order' is good, 'a new trade order over £200' is even better."
                }
            },
            {
                id: "auto_steps", label: "What should happen automatically, in order?",
                hint: "Step 1 does X, then step 2 does Y, etc.", type: "textarea", required: true,
                test_data: "1. New Shopify order is detected. 2. System checks all extension products in the order for colour code mismatches. 3. If a mismatch is found, a flag is added to the order and a ClickUp task is created for CS to review. 4. If no mismatch, order proceeds as normal.",
                help: {
                    why: "This is the recipe. The more detail you give, the more accurately we can build it.",
                    examples: [
                        "1. Pull all new orders from Shopify tagged 'trade'. 2. Match each order to the salon's account in our trade spreadsheet. 3. Calculate the margin for each product. 4. Add a row to the weekly trade report. 5. If any order is over £500, send a Slack message to the trade manager."
                    ]
                }
            },
            {
                id: "auto_output", label: "What's the end result?",
                hint: "An email sent, a spreadsheet updated, a notification, a record created, etc.", type: "textarea", required: true,
                test_data: "A ClickUp task created for the CS team with the order details and a mismatch summary. A tag added to the Shopify order for easy filtering.",
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
                hint: "Who gets told? Should it retry? Should it stop?", type: "textarea", required: true,
                test_data: "Send an email to the tech team if the automation fails. Don't retry automatically — the warehouse will catch it manually as a fallback.",
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
                id: "auto_sensitive", label: "Does this involve sensitive data?",
                hint: "Tick all that apply",
                type: "multi-select", required: true,
                test_data: ["Customer data (names, emails, addresses)"],
                options: [
                    "Customer data (names, emails, addresses)",
                    "Payment or financial data",
                    "Login credentials or passwords",
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
                hint: "Answer customer questions, triage support tickets, recommend products, etc.", type: "textarea", required: true,
                test_data: "Help customers find the right hair extension colour and type for their hair, reducing the volume of colour match enquiries to the CS team.",
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
                hint: "Product guides, FAQs, order data, policies, etc.", type: "textarea", required: true,
                test_data: "Cliphair product catalogue, colour matching guide, hair type suitability charts, FAQs, returns and shipping policy.",
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
                id: "agent_channel", label: "Where will people use it?",
                hint: "Tick all that apply",
                type: "multi-select", required: true,
                test_data: ["Website chat widget"],
                options: [
                    "Website chat widget", "Slack", "Email",
                    "Inside another tool (ClickUp, Shopify, etc.)",
                    "Multiple places"
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
                id: "agent_channel_detail", label: "Which places?",
                hint: "List each channel or tool where it will be used",
                type: "textarea",
                showIf: (a) => Array.isArray(a.agent_channel) && a.agent_channel.includes("Multiple places")
            },
            {
                id: "agent_boundaries", label: "What should it never do or say?",
                hint: "Topics to avoid, actions it shouldn't take, limits on its authority", type: "textarea", required: true,
                test_data: "Never recommend self-application of tape or keratin extensions — always direct to a professional. Never promise specific delivery dates. Never discuss competitor brands.",
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
                hint: "What triggers the handoff, and who does it go to?", type: "textarea", required: true,
                test_data: "If the customer asks about a return, complaint, or damaged item — hand off to a human CS agent immediately. If it's asked the same question three times without a satisfying answer, offer a human.",
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
                id: "app_who", label: "Who is this for?", type: "select", required: true,
                test_data: "Internal team only",
                options: [
                    "Internal team only", "Customers (public-facing)",
                    "Trade customers (salons / professionals)",
                    "Both internal and external"
                ],
                help: { why: "Internal tools can be rougher and simpler. Customer-facing tools need to look polished and follow brand guidelines." }
            },
            {
                id: "app_screens", label: "Describe the key screens or pages — even roughly.",
                hint: "What does someone see and do on each screen?", type: "textarea", required: true,
                test_data: "A dashboard showing all Shopify orders from the past 7 days with a colour mismatch flag. A filter by status (flagged, cleared, resolved). A detail view per order showing the mismatch reason and actions taken.",
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
                id: "app_login", label: "Do people need to log in?", type: "select", required: true,
                test_data: "Yes — different users see different things",
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
                id: "app_mobile", label: "Does it need to work on mobile?", type: "select", required: true,
                test_data: "Yes — should work on both mobile and desktop",
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
            },
            {
                id: "app_visuals", label: "Can you share any images, videos, or screenshots?",
                hint: "Paste links to anything that helps show what you mean. Press 'Add another link' to add more.",
                type: "repeatable-text",
                help: {
                    why: "Seeing the actual screen, mockup, or example cuts through ambiguity faster than any description.",
                    examples: [
                        "A screenshot of the current spreadsheet you want to replace",
                        "A Loom walkthrough of the existing process",
                        "A photo of a whiteboard sketch of the layout",
                        "A link to a Figma, Canva, or Google Slides mockup"
                    ],
                    tip: "Even a rough phone photo of a hand-drawn sketch is useful."
                }
            }
        ]
    }
};

export const notSureQuestions = [
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

export const notSureRecommendations = {
    automation: "This sounds like a repeatable process that can run on its own once set up.",
    agent: "This sounds like it needs an AI that can understand questions and give relevant answers.",
    app: "This sounds like you need a dedicated tool with a visual interface.",
    combination: "This sounds like it might need more than one piece — for example, an automation that feeds data into a dashboard, or an AI agent backed by an automated workflow."
};
